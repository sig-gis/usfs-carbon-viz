from google.cloud import storage
import os
import logging
import datetime
import requests
import time

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

# Function to download files from a Google Cloud Storage bucket and present download links to the user.
def download_files(bucket_name, file_id):
    # Define extensions to exclude
    bad_shp_extensions = ["cpg", "fix"]

    # Initialize the GCS client
    storage_client = storage.Client()

    # Get the bucket object
    bucket = storage_client.bucket(bucket_name)

    # List files in the bucket
    blobs = bucket.list_blobs()

    # Filter files based on file_id and excluded extensions
    filtered_files = [
        blob for blob in blobs
        if blob.name.split(".")[-1] not in bad_shp_extensions and file_id in blob.name
    ]

    # Generate download links and messages
    message = "<ul>"
    for blob in filtered_files:
        message += f'<li><a href="https://storage.googleapis.com/{bucket_name}/{blob.name}" target="_blank">{blob.name}</a></li>'
    message += "</ul>"

    logger.info(f"Export complete for ID: {file_id}")
    logger.info("The following files are available for download:")
    logger.info(message)

    # Auto-download the files
    for blob in filtered_files:
        file_name = blob.name.split("/")[-1]  # Get the file name
        logger.info(f"Downloading {file_name}...")

        try:
            # Download file to local disk
            blob.download_to_filename(file_name)
            logger.info(f"Downloaded {file_name}")
        except Exception as e:
            logger.error(f"Error downloading {file_name}: {e}")

# Function to download files from a Google Cloud Storage bucket and present download links to the user.
def download_files_2(bucket_name, file_id):
    # Define extensions to exclude
    bad_shp_extensions = ["cpg", "fix"]

    # Get the list of files from the bucket
    url = f"https://storage.googleapis.com/storage/v1/b/{bucket_name}/o?maxResults=100000"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Error fetching file list from bucket: {e}")
        return

    files = response.json().get("items", [])
    # Filter files based on file_id and excluded extensions
    filtered_files = [
        file
        for file in files
        if file["name"].split(".")[-1] not in bad_shp_extensions
        and file_id in file["id"]
    ]

    # Generate download links and messages
    message = "<ul>"
    for file in filtered_files:
        message += f'<li><a href="{file["mediaLink"]}" target="_blank">{file["name"]}</a></li>'
    message += "</ul>"

    logger.info(f"Export complete for ID: {file_id}")
    logger.info("The following files are available for download:")
    logger.info(message)

    # Auto-download the files
    for file in filtered_files:
        media_link = file["mediaLink"]
        file_name = file["name"]

        logger.info(f"Downloading {file_name}...")
        try:
            file_response = requests.get(media_link, stream=True)
            file_response.raise_for_status()

            with open(file_name, "wb") as f:
                for chunk in file_response.iter_content(chunk_size=1024):
                    f.write(chunk)

            logger.info(f"Downloaded {file_name}")
        except requests.RequestException as e:
            logger.error(f"Error downloading {file_name}: {e}")
        time.sleep(1)  # Sleep to mimic the behavior of sleep in JavaScript