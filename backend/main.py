import ee
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from google.oauth2 import service_account
from google.auth import default
from google.cloud import storage
import datetime

app = FastAPI()

# Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use default gcloud credentials
# credentials, project_id = default()
#ee.Initialize(credentials, project='usfs-carbon-viz-test')

# Path to your service account JSON key
SERVICE_ACCOUNT_KEY_PATH = '/home/tkunlamai/gcloud/usfs-carbon-tool-test-sa-key.json'
# SERVICE_ACCOUNT_KEY_PATH = '/Users/thannarot/Work/Sig/Code/usfs-2/usfs-carbon-tool-test-sa-key.json'
SCOPES = ['https://www.googleapis.com/auth/earthengine', 'https://www.googleapis.com/auth/devstorage.full_control']
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_KEY_PATH,
    scopes=SCOPES
)
ee.Initialize(credentials=credentials, project='usfs-carbon-viz-test')

# Constants
BUCKET_NAME = 'gee-export-location'
CRS = 'EPSG:4269'
SCALE = 30
MAX_PIXELS = 1e13
BAD_EXTENSIONS = ['cpg', 'fix']

# In-memory task tracking (task_id -> task)
TASKS: Dict[str, ee.batch.Task] = {}

# Request model
class ExportRequest(BaseModel):
    assetId: str
    band: str
    region: List[List[List[List[float]]]]
    layerId: str
    geometryType: str 

# Helper: Check asset access
def check_asset_access(asset_id: str):
    try:
        ee.Image(asset_id).getInfo()
        return True
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Asset not accessible: {e}")

# Helper: Generate file ID
def generate_file_id(band: str, layerId: str) -> str:
    timestamp = datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')
    return f"usfs_{layerId}_{band}_{timestamp}"

# Helper: List exported files
def list_exported_files(bucket_name: str, file_id: str):
    client = storage.Client(credentials=credentials, project='usfs-carbon-viz-test')
    bucket = client.bucket(bucket_name)
    blobs = bucket.list_blobs()
    return [
        {
            "name": blob.name,
            "url": f"https://storage.googleapis.com/{bucket_name}/{blob.name}"
        }
        for blob in blobs
        if file_id in blob.name and blob.name.split('.')[-1] not in BAD_EXTENSIONS
    ]

# Helper: Delete exported files
def delete_exported_files(bucket_name: str, file_id: str):
    client = storage.Client(credentials=credentials, project='usfs-carbon-viz-test')
    bucket = client.bucket(bucket_name)
    blobs = bucket.list_blobs()
    deleted = []
    for blob in blobs:
        if file_id in blob.name:
            blob.delete()
            deleted.append(blob.name)
    return deleted


# POST /export-to-gcs/ - Trigger export
@app.post("/export-to-gcs/")
async def export_to_gcs(req: ExportRequest):
    check_asset_access(req.assetId)
    # Handle Polygon and MultiPolygon
    if req.geometryType == "MultiPolygon" or req.geometryType == "Polygon":
        geometry = ee.Geometry.MultiPolygon(req.region)
    else:
        raise HTTPException(status_code=400, detail="Unsupported geometry type")

    image = ee.Image(req.assetId).select(req.band).clip(geometry)
    file_id = generate_file_id(req.band, req.layerId)
    
    task = ee.batch.Export.image.toCloudStorage(
        image=image,
        description="backend_cloud_export",
        bucket=BUCKET_NAME,
        fileNamePrefix=file_id,
        region=geometry,
        scale=SCALE,
        crs=CRS,
        maxPixels=MAX_PIXELS,
        fileFormat="GeoTIFF"
    )
    task.start()
    TASKS[task.id] = task
    return {
        "message": "Export started",
        "taskId": task.id,
        "fileId": file_id
    }

# GET /export-status/{file_id}
@app.get("/export-status/{file_id}")
def export_status(file_id: str):
    files = list_exported_files(BUCKET_NAME, file_id)
    return {"ready": len(files) > 0, "files": files}

# GET /download-links/{file_id}
@app.get("/download-links/{file_id}")
def download_links(file_id: str):
    files = list_exported_files(BUCKET_NAME, file_id)
    if not files:
        raise HTTPException(status_code=404, detail="No files found.")
    return {"files": files}

# DELETE /export-delete/{file_id}
@app.delete("/export-delete/{file_id}")
def delete_export(file_id: str):
    deleted = delete_exported_files(BUCKET_NAME, file_id)
    return {"deleted": deleted}

# GET /export-cancel/{task_id}
@app.get("/export-cancel/{task_id}")
def cancel_task(task_id: str):
    task = TASKS.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task ID not found or already finished.")
    task.cancel()
    return {"message": f"Task {task_id} canceled"}
