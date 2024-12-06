//////////////////////////////////////////////////////////////////////////////////////
// MODIS LST
//////////////////////////////////////////////////////////////////////////////////////


//Study Area
var BMD_location = ee.Geometry.Point([90.3783, 23.7799]); // Dhaka BMD
// var BMD_location = ee.Geometry.Point([90.426291,  24.725688]); // Mymensingh BMD

// var roi = ee.FeatureCollection('projects/ee-sazidbs02/assets/Dhaka_Core'); // Dhaka Core
// var roi = ee.FeatureCollection('projects/ee-sazidbs02/assets/Dhaka_Surroundings'); // Dhaka City - Dhaka Core
var roi = ee.FeatureCollection('projects/ee-sazidbs02/assets/Dhaka_City_Dissolved'); // Dhaka City
// var roi = ee.FeatureCollection('projects/ee-sazidbs02/assets/Dhaka_City_Buffer_3_5km'); // Dhaka City Buffer
// var roi = ee.FeatureCollection('projects/ee-sazidbs02/assets/UHII_Blocks/1_Block_W'); // Dhaka Blocks

// 1_Block_N, 1_Block_S, 1_Block_E, 1_Block_W, 1_Block_S_E, 1_Block_Rustompur, 1_Block_Purbachal


//Import the LST image collection
var modis = ee.ImageCollection("MODIS/061/MOD11A1") // Terra 10:30 am (day), 10:30 pm (night)
// var modis = ee.ImageCollection("MODIS/061/MYD11A1") // Aqua 01:30 am (night), 01:30 pm (day)
.filter(ee.Filter.calendarRange(3, 3, 'month')) //ee.Filter.calendarRange(start, end, field) Selects Data of March only
.filterDate("2020-01-01","2021-01-01")
// .select('LST_Day_1km') //for day time
.select('LST_Night_1km') //for night time
// .select('Day_view_time')
// .select('Night_view_time')


// Visualization parametersb
var imageVisParam = {
  // bands: ["LST_Day_1km"],
  bands: ["LST_Night_1km"],
  min: 20,
  max: 50,
  palette: ["12a418", "4bff37", "faff2e", "ffac2c", "ff1d10"],
  opacity: 1
};

// kelvin to celcius
var modcel = modis.map(function(img){
  return img
  .multiply(0.02)
  .subtract(273.15)
  .copyProperties(img, ['system:time_start'])
})

Map.setOptions('SATELLITE');
Map.centerObject(BMD_location, 11);


// Clip the image using roi
var LST_clipped = modcel.mean().clip(roi);
// // Clip the image using Mymensingh_area
// var LST_clipped = modcel.mean().clip(Mymensingh_area);

// Print minimum, maximum, and average values
var statistics = LST_clipped.reduceRegion({
  reducer: ee.Reducer.minMax().combine({
    reducer2: ee.Reducer.mean(),
    sharedInputs: true
  }),
  geometry: roi,
  // geometry: Mymensingh_area,
  scale: 1000
});

// print('Minimum LST value:', statistics.get('LST_Day_1km_min'));
// print('Maximum LST value:', statistics.get('LST_Day_1km_max'));
// print('Average LST value:', statistics.get('LST_Day_1km_mean'));
print('Minimum LST value:', statistics.get('LST_Night_1km_min'));
print('Maximum LST value:', statistics.get('LST_Night_1km_max'));
print('Average LST value:', statistics.get('LST_Night_1km_mean'));



Map.addLayer(LST_clipped, imageVisParam, 'LST Clipped');
// Map.addLayer(BMD_location, {color: 'red'}, 'BMD Location');

// Export the clipped LST image to Google Drive
Export.image.toDrive({
  image: LST_clipped,
  description: 'MODIS_LST_Clipped_Dhaka_2020_March_1030pm',
  // description: 'MODIS_LST_Clipped_Mymensingh_2023_March',
  scale: 1000, // Set the scale according to your needs
  region: roi,
  // region: Mymensingh_area,
  folder: 'LST_MODIS', // Set the folder in your Google Drive where you want to export the image
  fileNamePrefix: 'MODIS_LST_Clipped_Dhaka_2020_March_1030pm',
  // fileNamePrefix: 'MODIS_LST_Clipped_Mymensingh_2023_March',
  maxPixels: 1e13
});


///////////////////////////////////////////////////////////////////////////////////////////////
// Building Volume
//////////////////////////////////////////////////////////////////////////////////////////////

// Load the built volume dataset for a specific year (e.g., 2020)
var image = ee.Image("JRC/GHSL/P2023A/GHS_BUILT_V/2020");
var builtVolume = image.select('built_volume_total').clip(roi);

// Reduce resolution to 1000 m, calculating mean building volume in each cell
var builtVolume_1000m = builtVolume.reduceResolution({
  reducer: ee.Reducer.mean(),
  bestEffort: true
}).reproject({
  crs: builtVolume.projection(),
  scale: 1000
});

// Calculate minimum and maximum values within the ROI
var minValue = builtVolume_1000m.reduceRegion({
  reducer: ee.Reducer.min(),
  geometry: roi,
  scale: 100, // Adjust based on your needs
  maxPixels: 1e13
}).get('built_volume_total');

var maxValue = builtVolume_1000m.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: roi,
  scale: 100,
  maxPixels: 1e13
}).get('built_volume_total');

// Print the minimum and maximum values
print('Minimum Built Volume [m³]:', minValue);
print('Maximum Built Volume [m³]:', maxValue);

// Define visualization parameters
var visParams = {
  min: 0.0,
  max: 83000, // Adjust according to expected values in built_volume_total
  palette: ['blue', 'green', 'yellow', 'red'],
};

// Set the map view
Map.setCenter(90.3835, 23.7852, 12); // Center on your area of interest
Map.addLayer(builtVolume_1000m, visParams, 'Total Built Volume [m³], 2020');



// Export the built volume to Google Drive
Export.image.toDrive({
  image: builtVolume_1000m,
  description: 'Built_Volume_2020_GHSL',
  scale: 1000, // Set the scale according to your needs
  region: roi, // Ensure roi is defined as your region of interest
  folder: 'LST_MODIS', // Set the folder in your Google Drive for the export
  fileNamePrefix: 'Built_Volume_2020_GHSL',
  maxPixels: 1e13
});


///////////////////////////////////////////////////////////////////////////////////////////////
// Correlation
//////////////////////////////////////////////////////////////////////////////////////////////


// Sample points within the region of interest (roi)
var samples = LST_clipped.addBands(builtVolume_1000m).sample({
  region: roi,
  scale: 1000, // Set scale to match LST and building volume resolution
  numPixels: 10000, // Specify number of samples; adjust as needed for accuracy
  geometries: true // Include geometry for visualization
});

// Filter out samples where the "built" value is less than 3
var filteredSamples = samples.filter(ee.Filter.gte('built_volume_total', 113));
////////////////////////////////////////////////////////////////////////////////////
// Minimum building volume = 20 ft X 20 ft X 10 ft = 4000 ft3 = 113 m3
///////////////////////////////////////////////////////////////////////////////////

// Print filtered sample results
print(filteredSamples, "Filtered Sampled LST and Building Volume");

// Convert to a feature collection and extract data for correlation calculation
var sampleData = filteredSamples.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  // selectors: ['LST_Day_1km', 'built_volume_total']
  selectors: ['LST_Night_1km', 'built_volume_total']
});

// Print the correlation result
print('Correlation between LST and building vloume (greater than 113 m3):', sampleData.get('correlation'));

// Generate a scatter plot of Building Volume (x-axis) vs. LST (y-axis)

// var chart = ui.Chart.feature.byFeature(filteredSamples, 'built_volume_total', 'LST_Day_1km')
var chart = ui.Chart.feature.byFeature(filteredSamples, 'built_volume_total', 'LST_Night_1km')
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Correlation between LST and Building Volume',
    hAxis: {title: 'Building Volume (m3)'},
    vAxis: {title: 'Land Surface Temperature (°C)'},
    pointSize: 3,
    trendlines: { 0: {showR2: true, visibleInLegend: true} }
  });

// Display the chart in the Console
print(chart);




///////////////////////////////////////////////////////////////////////////////////////////////////
// Pick Data from Grid Points
///////////////////////////////////////////////////////////////////////////////////////////////////

// Load the point shapefile
var points = ee.FeatureCollection('projects/ee-sazidbs02/assets/Dhaka_1000m_grid_label_WGS84_clipped');

// Sample the LST raster at the point locations
var sampledLST = LST_clipped.sampleRegions({
  collection: points,
  scale: 1000, // Match the scale of LST_clipped
  tileScale: 4,
  geometries: true // Keep geometry for spatial reference
});

// Sample the building density raster at the point locations
var sampledBuildingVolume = builtVolume_1000m.sampleRegions({
  collection: points,
  scale: 1000, // Match the scale of finalBuildingDensityRaster
  tileScale: 4,
  geometries: true // Keep geometry for spatial reference
});

// Export the sampled LST data to a CSV file in Google Drive
Export.table.toDrive({
  collection: sampledLST,
  description: 'Sampled_LST_Dhaka',
  fileFormat: 'CSV',
  folder: 'LST_MODIS' // Set the folder in Google Drive
});

// Export the sampled building density data to a CSV file in Google Drive
Export.table.toDrive({
  collection: sampledBuildingVolume,
  description: 'Sampled_Building_Volume_Dhaka',
  fileFormat: 'CSV',
  folder: 'LST_MODIS' // Set the folder in Google Drive
});
