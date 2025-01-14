import ee

# Initialize the Earth Engine API
ee.Initialize(project='usfs-carbon-viz-test')

def get_image_download_url(image, boundary, scale=30, crs='EPSG:4326', file_format='GeoTIFF'):
    """
    Generate a download URL for an Earth Engine image as a GeoTIFF.

    Args:
        image (ee.Image): The Earth Engine image to export.
        boundary (ee.Geometry): The boundary for the export region.
        scale (int, optional): The spatial resolution in meters. Default is 30.
        crs (str, optional): The coordinate reference system. Default is 'EPSG:4326'.
        file_format (str, optional): The output file format. Default is 'GeoTIFF'.

    Returns:
        str: A URL to download the GeoTIFF image.
    """
    # Define export parameters
    export_params = {
        'region': boundary.getInfo(),
        'scale': scale,
        'crs': crs,
        'format': file_format
    }

    try:
        # Generate the download URL
        url = image.getDownloadURL(export_params)
        return url
    except Exception as e:
        print(f"Error generating download URL: {e}")
        return None

def split_geometry(boundary, grid_size=34650):
    """
    Split a geometry into a grid of sub-regions.

    Args:
        boundary (ee.Geometry): The boundary to split.
        grid_size (int): Size of the grid cells.

    Returns:
        list of ee.Geometry: A list of smaller geometries (tiles).
    """
    proj = 'EPSG:4326'
    
    # Use coveringGrid to split the image into tiles
    grid = boundary.coveringGrid(proj, grid_size)
    
    # Aggregate the grid into tile IDs
    tile_ids = grid.aggregate_array('system:index').getInfo()
    print(f'Total tiles: {len(tile_ids)}')

    # Create a list of geometries from the grid
    tiles = []
    for i in range(len(tile_ids)):
        tile = ee.Feature(grid.toList(1, i).get(0)).geometry()
        tiles.append(tile)
    
    return tiles

# Main script
if __name__ == "__main__":

    image_asset_id = 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2'
    example_image = ee.Image(image_asset_id)
    geo = example_image.geometry().bounds()

    states = ee.FeatureCollection("TIGER/2018/States")
    louisiana = states.filter(ee.Filter.eq('STATEFP', '22')).first().geometry()

    counties = ee.FeatureCollection("TIGER/2018/Counties")
    example_boundary = counties.filter(ee.Filter.eq('STATEFP', '22')).first().geometry()

    # Attempt to get the download URL for the entire region
    print("Attempting to download the full image...")
    download_url = get_image_download_url(example_image, example_boundary)

    if download_url:
        print("Download URL:", download_url)
    else:
        print("The region is too large. Splitting into smaller tiles...")
        tiles = split_geometry(louisiana)  # Adjust rows/cols as needed

        for idx, tile in enumerate(tiles):
            print(f"Processing tile {idx + 1}...")

            tile_url = get_image_download_url(example_image, tile)
            if tile_url:
                print(f"Tile {idx + 1} URL:", tile_url)
            else:
                print(f"Tile {idx + 1} is too large. Try again.")