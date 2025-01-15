from export_ee import export_img_to_cloud_storage, poll_submitted_task
from export_gcs import download_files, delete_files_gcs
import ee
ee.Initialize(project='usfs-carbon-viz-test')

# Define back-end export parameters that we don't expose to user as choices 
# (some of these are negotiable)
bucket = 'gee-export-location'
crs = 'EPSG:4269'
scale = 30
maxPixels = 1e13

# simulating front-end collecting user choices and forming into request dictionaries to pass to back-end
states = ee.FeatureCollection("TIGER/2018/States")
louisiana = states.filter(ee.Filter.eq('STATEFP', '22')).first().geometry()
counties = ee.FeatureCollection("TIGER/2018/Counties")
example_boundary1 = counties.filter(ee.Filter.eq('STATEFP', '22')).first().geometry()
example_boundary2 = counties.filter(ee.Filter.eq('STATEFP', '48')).first().geometry()

request_dict1 = {'image_asset_id': 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2',
                  'export_region': example_boundary1,
                  'file_name': 'Carbon_Emissions_tile2_example_boundary1',
                }
request_dict2 = {'image_asset_id': 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2',
                    'export_region': example_boundary2,
                    'file_name': 'Carbon_Emissions_tile2_example_boundary2',}

request_dict3 = {'image_asset_id': 'projects/usfs-carbon-viz-test/assets/Carbon_Emissions/Carbon_Emissions_tile2',
                    'export_region': louisiana,
                    'file_name': 'Carbon_Emissions_tile2_louisiana',}

requests = [request_dict1, request_dict2]

# simulating processing of two sequential requests
for request in requests:

    task = export_img_to_cloud_storage(image=ee.Image(request.get('image_asset_id')), 
                                description=f"GCS_{request.get('file_name')}",
                                bucket=bucket, 
                                fileNamePrefix=request.get('file_name'), 
                                region=request.get('export_region'), 
                                scale=scale, 
                                crs=crs, 
                                maxPixels=maxPixels, 
                                )

    # poll for task by task ID
    poll_submitted_task(task,0.5)

    # download the file(s) in GCS bucket matching fileNamePrefix
    download_files(bucket, request.get('file_name'))

    # delete those file(s) in GCS bucket matching fileNamePrefix
    delete_files_gcs(bucket, request.get('file_name'))
