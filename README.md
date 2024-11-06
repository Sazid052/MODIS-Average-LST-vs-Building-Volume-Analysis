# MODIS Land Surface Temperature (LST) and Building Volume Analysis in Dhaka

## Overview
This project leverages Google Earth Engine (GEE) to analyze the relationship between urban development and nighttime land surface temperature (LST) in Dhaka, Bangladesh. Using MODIS LST data and GHSL building volume data, the analysis investigates how building density influences urban heat patterns.

## Key Features
- **LST Analysis**: Import and process MODIS Terra LST data for nighttime, focusing on March 2018. Convert the data from Kelvin to Celsius and visualize using a color palette.
- **Building Volume Analysis**: Use JRC’s GHSL Built Volume dataset (2020) to quantify urban density and clip data to the region of interest (ROI).
- **Correlation Calculation**: Sample both LST and building volume data within the ROI and compute the Pearson correlation coefficient. Visualize this relationship using a scatter plot.
- **Grid Sampling**: Extract LST and building volume data at 1000 m grid points and export the results for further analysis.
- **Data Export**: Save processed images and sampled data to Google Drive in both GeoTIFF and CSV formats.

## Requirements
- **Google Earth Engine Account**: You need a GEE account to run and modify the scripts.
- **Google Drive**: Data exports are directed to Google Drive, so make sure your account has sufficient storage space.
- **GEE Assets**: Custom assets such as the ROI shapefile and grid point shapefile need to be uploaded to your GEE account.

## Usage Instructions
1. **Setup**: Open the Google Earth Engine Code Editor and paste the script provided in the repository.
2. **Select Region**: Modify the `roi` and `points` variables to choose your desired region of interest and the grid points shapefile. These default to specific assets for Dhaka City but should be updated to match your analysis needs.
3. **Run the Script**:
   - The script will process MODIS LST and GHSL building volume data.
   - It will calculate minimum, maximum, and mean values for both datasets and print these in the GEE Console.
4. **Export Data**:
   - LST and building volume images are exported to Google Drive as GeoTIFFs.
   - Sampled LST and building volume values are exported as CSV files to Google Drive.

## Outputs
- **Visualizations**:
  - Nighttime LST map with a color palette.
  - Building volume map showing urban density variations.
  - Scatter plot depicting the correlation between LST and building volume.
- **Statistics**:
  - Minimum, maximum, and mean values for both LST and building volume.
  - Pearson correlation coefficient to quantify the relationship.
- **Exported Data**:
  - **GeoTIFFs**: Clipped LST and building volume images.
  - **CSV Files**: Sampled data from grid points for external analysis.

## Notes
- **Adjustable Parameters**: Customize filters, time ranges, and scales in the script to suit your analysis. You can easily switch between daytime and nighttime LST or modify the building volume resolution.
- **Filtering Threshold**: Building volume values below 113 m³ are excluded from the correlation analysis. This threshold corresponds to a minimum built area of 20 ft × 20 ft × 10 ft.
- **Visualization Options**: Modify the color palette and visualization parameters as needed for better data representation.
- **Region and Points**: Ensure to update the `roi` (region of interest) and `points` (grid points) variables to your desired shapefiles to match your study area.

## Resources
- **MODIS LST Data**: [NASA MODIS](https://modis.gsfc.nasa.gov/)
- **GHSL Built Volume Data**: [JRC GHSL Project](https://ghsl.jrc.ec.europa.eu/)
- **Google Earth Engine Documentation**: [GEE Developers Guide](https://developers.google.com/earth-engine)

This project serves as a template for urban heat analysis and can be adapted for other regions or datasets. Feel free to modify and extend the code to support your research.
