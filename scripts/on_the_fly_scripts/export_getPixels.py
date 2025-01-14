import os
import logging
import datetime
import time
import ee

# Set up logger
log_filename = os.path.join(
    os.path.dirname(__file__),
    f"logfile_{datetime.datetime.now().strftime('%Y%m%d')}.log"
)
logging.basicConfig(
    filename=log_filename,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger()

# Initialize the Earth Engine API
ee.Initialize(project='usfs-carbon-viz-test')

def export_image_to_test_folder(image_asset_id, name="test_image", pixel_size=90, tile_size=640):
    # Define the output directory as 'test'
    output_directory = r"C:\Users\edalt\PC357\Data\test"
    os.makedirs(f"{output_directory}/images", exist_ok=True)

    # Load the image
    image = ee.Image(image_asset_id).select([0])
    proj = 'EPSG:4326'
    
    gridSize = tile_size * tile_size

    # Use coveringGrid to split the image into tiles
    grid = image.geometry().coveringGrid(proj, gridSize)
    
    # Aggregate the grid into tile IDs
    tile_ids = grid.aggregate_array('system:index').getInfo()
    print('Total tiles', len(tile_ids))

    # Export each tile
    for i, tile in enumerate(tile_ids):
        # Extract the geometry of the tile (specific feature)
        feature = ee.Feature(grid.toList(1, i).get(0))

        # Extract the bounds of the tile geometry
        bounds = feature.geometry().bounds(**{
            'proj': proj, 'maxError': 1
        })
        
        # Get the coordinates of the tile's bounding box
        coordList = ee.Array.cat(bounds.coordinates(), 1)
        
        # Extract X and Y coordinates
        xCoords = coordList.slice(1, 0, 1)
        yCoords = coordList.slice(1, 1, 2)
        
        # Calculate the centroid (average of min/max coordinates)
        xMin = xCoords.reduce('min', [0]).get([0,0]).getInfo()  # Get the native Python value
        xMax = xCoords.reduce('max', [0]).get([0,0]).getInfo()  # Get the max x coordinate
        yMin = yCoords.reduce('min', [0]).get([0,0]).getInfo()  # Get the min y coordinate
        yMax = yCoords.reduce('max', [0]).get([0,0]).getInfo()  # Get the max y coordinate
        
        # Calculate the centroid of the tile's bounding box
        centroid_x = (xMin + xMax) / 2
        centroid_y = (yMin + yMax) / 2

        # Create the affine transformation using the centroid coordinates
        transform = ee.List([pixel_size, 0, centroid_x, 0, -pixel_size, centroid_y]).getInfo()
        logger.info(f'Tile {i} centroid transform: {transform}')

        # Define the filename for the tile
        id_date = time.strftime("%Y%m%d_%H%M%S")
        tile_filename = f"{output_directory}/images/{name}_tile_{i}_{id_date}.tif"
        
        # Check if the file already exists
        if not os.path.exists(tile_filename):
            print(f"Exporting tile {i} to {tile_filename}...")

            try:
                # Define the export request using tile-specific information
                request = {
                    'assetId': image.getInfo()['id'],
                    'fileFormat': 'GeoTIFF',
                    'grid': {
                        'dimensions': {
                            'width': tile_size,
                            'height': tile_size
                        },
                        'affineTransform': {
                            'scaleX': transform[0],
                            'shearX': transform[1],
                            'translateX': transform[2],
                            'shearY': transform[3],
                            'scaleY': transform[4],
                            'translateY': transform[5]
                        },
                        'crsCode': proj,
                    },
                }

                # Export the tile as GeoTIFF
                data = ee.data.getPixels(request)
                
                # Write data to file
                with open(tile_filename, 'wb') as f:
                    f.write(data)
                print(f"Tile {i} exported successfully: {tile_filename}")
                logger.info(f"Exported tile: {tile_filename}")
            
            except Exception as e:
                print(f"Error exporting tile {i}: {e}")
                logger.error(f"Error exporting tile {i}: {e}")
        else:
            print(f"Tile file {tile_filename} already exists, skipping...")

# Example usage
if __name__ == "__main__":
    # Define the image asset ID
    image_asset_id = 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2'

    # Call the export function with tiling
    export_image_to_test_folder(image_asset_id, name="test")