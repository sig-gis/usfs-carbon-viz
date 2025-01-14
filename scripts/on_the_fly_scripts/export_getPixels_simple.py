import os
import time
import math
import ee

# Initialize the Earth Engine API
ee.Initialize(project='usfs-carbon-viz-test')

# Main script
if __name__ == "__main__":

    # Load the example image and region
    image_asset_id = 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2'
    example_image = ee.Image(image_asset_id)
    example_boundary = ee.FeatureCollection("TIGER/2018/Counties").filter(ee.Filter.eq('STATEFP', '22')).first()

    proj = 'EPSG:4326'

    # Get bounding box and coordinates
    bounds = ee.Feature(example_boundary).geometry().bounds(proj=proj, maxError=1)
    coord_list = bounds.coordinates().getInfo()[0]

    x_coords = [coord[0] for coord in coord_list]
    y_coords = [coord[1] for coord in coord_list]

    # Calculate bounding box parameters
    xMin = min(x_coords)
    xMax = max(x_coords)
    yMin = min(y_coords)
    yMax = max(y_coords)
    xCentroid = (xMin + xMax) / 2

    scale = 30
    width = ee.Number(xMax).subtract(ee.Number(xMin))
    height = ee.Number(yMax).subtract(ee.Number(yMin))

    # Convert the width and height in degrees to meters (assuming WGS84 or similar projection)
    width_meters = width.multiply(111320)
    height_meters = height.multiply(111320)

    # Convert the width and height in meters to pixels by dividing by the scale
    width_pixels = width_meters.divide(30)
    height_pixels = height_meters.divide(30).ceil()

    width_pixels_final = width_pixels.divide(2).ceil()

    print('Width in pixels:', width_pixels_final.getInfo())
    print('Height in pixels:', height_pixels.getInfo())

    # Prepare the export points
    export_points = [
        {'translateX': xMin, 'translateY': yMax},
        {'translateX': xMax, 'translateY': yMax},
        {'translateX': xCentroid, 'translateY': yMax}
    ]

    # Get the projection
    proj_info = ee.Projection('EPSG:4326').atScale(scale).getInfo()
    scale_x = proj_info['transform'][0]
    scale_y = -proj_info['transform'][4]

    # Output directory
    output_directory = r"C:\Users\edalt\PC357\Data\test"
    os.makedirs(f"{output_directory}/images", exist_ok=True)

    # Iterate through the points and export
    for i, point in enumerate(export_points):
        request = {
            'assetId': example_image.getInfo()['id'],
            'fileFormat': 'GeoTIFF',
            'grid': {
                'dimensions': {
                    'width': width_pixels_final.getInfo(),
                    'height': height_pixels.getInfo()
                },
                'affineTransform': {
                    'scaleX': scale_x,
                    'shearX': 0,
                    'translateX': point['translateX'],
                    'shearY': 0,
                    'scaleY': scale_y,
                    'translateY': point['translateY']
                },
                'crsCode': proj_info['crs'],
            },
        }

        # Get the data
        data = ee.data.getPixels(request)

        # Save the tile
        id_date = time.strftime("%Y%m%d_%H%M%S")
        tile_filename = f"{output_directory}/images/tile_{i}_{id_date}.tif"
        with open(tile_filename, 'wb') as f:
            f.write(data)

        print(f"Tile exported successfully: {tile_filename}")