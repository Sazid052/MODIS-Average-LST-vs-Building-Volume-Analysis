# MODIS Land Surface Temperature (LST) and Building Density Analysis for Dhaka City

This project uses *Google Earth Engine (GEE)* to analyze *MODIS Land Surface Temperature (LST)* data and building density in Dhaka City. The script focuses on understanding the spatial and temporal distribution of LST and its correlation with urban building density.

## Overview

The script performs several key tasks:
- Imports and visualizes *MODIS LST data* for the nighttime, converting it from Kelvin to Celsius.
- Computes and visualizes *building density* using the Microsoft Building dataset.
- Analyzes the *correlation between LST and building density* using statistical methods and visualizations.

## Key Features

1. **Study Area Definition**:
   - Defines key locations and regions of interest (ROIs) within Dhaka City, including various pre-defined areas such as the Dhaka City boundary and surrounding areas.
   - Option to switch between Dhaka BMD and Mymensingh BMD points.

2. **MODIS LST Analysis**:
   - Imports *MODIS Terra LST* data, focusing on nighttime temperatures in March from 2018 to 2019.
   - Converts LST from Kelvin to Celsius and clips the data to the specified ROI.
   - Computes and prints the minimum, maximum, and average LST values.

3. **Building Density Analysis**:
   - Uses the *Microsoft Buildings* dataset to extract building footprints within Dhaka City.
   - Computes a binary raster for building presence and calculates building density using a square kernel.
   - Resamples the raster to a 100-meter resolution and visualizes the building density.

4. **Correlation Analysis**:
   - Samples both LST and building density data to calculate Pearson's correlation.
   - Generates a scatter plot showing the relationship between LST and building density, including a trendline with R² values.

## Requirements

- *Google Earth Engine Account*: This code must be run in the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).

## Usage Instructions

1. **Setup**:
   - Import the script into your Google Earth Engine Code Editor.
   - Ensure that the *Dhaka City boundary* and *Microsoft Buildings dataset* are correctly referenced.

2. **Adjust Parameters**:
   - Modify the ROI to suit your area of interest. Available options include `Dhaka Core`, `Dhaka Surroundings`, `Dhaka City Buffer`, and various blocks.
   - To switch between day and night LST data, change the `.select()` method accordingly.

3. **Run the Analysis**:
   - Visualize the LST and building density on the map.
   - Export the clipped LST image to Google Drive for further analysis.
   - View the minimum, maximum, and average LST values in the Console.

## Outputs

1. **Map Visualization**:
   - LST and building density data are visualized with custom color palettes.
   - Dhaka buildings are highlighted on the map.

2. **Statistical Analysis**:
   - Minimum, maximum, and average LST values are printed for the ROI.
   - The building density raster is clipped and analyzed.

3. **Correlation Analysis**:
   - Pearson's correlation between LST and building density is calculated and displayed.
   - A scatter plot with a trendline is generated to show the relationship between LST and building density.

## Export

- The LST image is exported to your Google Drive with a specified description and folder name.
- Modify the `Export.image.toDrive()` parameters as needed, such as `scale`, `region`, and `fileNamePrefix`.

## Visualization Parameters

### LST Visualization
- **Bands**: `LST_Night_1km`
- **Min**: 20°C, **Max**: 50°C
- **Palette**: Gradient from green (cooler) to red (warmer)

### Building Density Visualization
- **Resolution**: 100-meter
- **Palette**: White (low density) to red (high density)

## Notes

- Ensure the *MODIS LST dataset* is appropriately filtered for the desired time range and region.
- The *Microsoft Buildings dataset* should cover the complete area of interest for accurate density analysis.
- You may need to adjust the `scale` parameter for sampling and exporting data based on your analysis requirements.

## Resources

- [MODIS Land Surface Temperature (LST) Data](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1)
- [Microsoft Building Footprints](https://gee-community-catalog.org/projects/msbuildings/)

Feel free to modify the code and parameters to suit your research needs. If you encounter any issues, consult the Google Earth Engine community or relevant documentation.
