import arcpy
import os

# Input large TIFF file
input_tif = r"C:\Users\edalt\PC357\Data\rangeland\rangeland_annual_expected_carbon_loss.tif" # Replace with the path to your TIFF file

# Output folder for tiled TIFFs
output_folder = r"C:\Users\edalt\PC357\Data\rangeland"  # Replace with the path to your output folder

# Raster properties
arcpy.env.workspace = output_folder
arcpy.env.overwriteOutput = True
raster = arcpy.Raster(input_tif)

# Use the Split Raster tool
arcpy.management.SplitRaster(
    in_raster=input_tif,
    out_folder=output_folder,
    out_base_name="tile",
    split_method="NUMBER_OF_TILES",
    num_rasters="2 2",
    format="TIFF",
    resampling_type="NEAREST",  # Change resampling method if needed
    cell_size=None,  # Retain original cell size
    overlap=0
)

print("Split Raster process completed.")
