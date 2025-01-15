import ee
import datetime
import logging
import os
import time

# Initialize the Earth Engine API
ee.Initialize(project='usfs-carbon-viz-test')

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

def poll_submitted_task(task,sleeper:int):
    """
    polls for the status of one started ee.batch.Task, completes when task status is 'COMPLETED'
    task needs to be started in order to retrieve needed status info, so use this function after executing `task.start()`
    args:
        task : task status dictionary returned by ee.batch.Task.status() method
        sleeper (int): minutes to sleep between status checks
    returns:
        None
    """
    
    if isinstance(task,ee.batch.Task):
        t_id = task.status()['id']
        status = task.status()['state']
        
        if status == 'UNSUBMITTED':
            raise RuntimeError(f"run .start() method on task before polling. {t_id}:{status}")
        
        logging.info(f"polling for task: {t_id}")
        while status != 'COMPLETED':
            if status in ['READY','RUNNING']:
                logging.info(f"{t_id}:{status} [sleeping {sleeper} mins] ")
                time.sleep(60*sleeper)
                t_id = task.status()['id']
                status = task.status()['state'] 
            elif status in ['FAILED','CANCELLED','CANCEL_REQUESTED']:
                raise RuntimeError(f"Bad Status - {t_id}:{status}")
        logging.info(f"{t_id}:{status}")
    else:
        raise TypeError(f"{task} is not instance of <ee.batch.Task>. {type(task)}")
    return

def export_img_to_cloud_storage(image:ee.Image, 
                                description:str='myGCSExportTask', 
                                bucket:str='my-bucket', 
                                fileNamePrefix:str='my-file-prefix', 
                                dimensions:list=None, 
                                region:ee.Geometry=None, 
                                scale:int=100, 
                                crs:str='EPSG:4326', 
                                crsTransform:list=None, 
                                maxPixels:int=1e13, 
                                fileFormat:str='GeoTIFF', 
                                ):
    """Creates a task to export an EE Image to Google Cloud Storage Bucket.

    Args:
        image: The image to be exported.
        description: Human-readable name of the task.
        bucket: The Cloud Storage destination bucket.
        fileNamePrefix: The string used as the output's prefix. 
            A trailing "/" indicates a path. Defaults to the task's description/
        dimensions: The dimensions of the exported image. Takes either a
            single positive integer as the maximum dimension or "WIDTHxHEIGHT"
            where WIDTH and HEIGHT are each positive integers.
        region: A LinearRing, Polygon, or coordinates representing 
            region to export. These may be specified as the Geometry objects 
            or coordinates serialized as a string.
        scale: Resolution in meters per pixel. Defaults to 1000.
        crs: CRS to use for the exported image.Defaults to the image's default projection.
        crsTransform: A comma-separated string of 6 numbers describing
            the affine transform of the coordinate reference system of the
            exported image's projection, in the order: xScale, xShearing,
            xTranslation, yShearing, yScale and yTranslation. Defaults to
            the image's native CRS transform.
        maxPixels: The maximum allowed number of pixels in the exported
            image. The task will fail if the exported region covers more
            pixels in the specified projection. Defaults to 100,000,000.
        fileFormat: The string file format to which the image is exported. 
            Currently only 'GeoTIFF' and 'TFRecord' are supported, defaults to 'GeoTIFF'.
        
    """

    if isinstance(image, ee.Image) or isinstance(image, ee.image.Image):
        pass
    else:
        raise ValueError("Input image must be an instance of ee.Image")

    task = ee.batch.Export.image.toCloudStorage(
        image=image, 
        description=description,
        bucket=bucket,
        fileNamePrefix=fileNamePrefix, 
        dimensions=dimensions, 
        region=region, 
        scale=scale, 
        crs=crs, 
        crsTransform=crsTransform, 
        maxPixels=maxPixels, 
        fileFormat=fileFormat)
    
    task.start()
    
    logging.info(f"Exporting image to: gs://{bucket}/{fileNamePrefix}.tif")
    logging.info(f"Task description: {description}")
    logging.info(f"Task ID: {task.id}")
    return task
 

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