import ee
import json

def compute_band_stats(image, boundary_geometry):
    """
    Compute summary statistics for each band within the specified boundary from an Image.

    Args:
        image (ee.Image): The input Image to analyze.
        boundary_geometry (ee.Geometry): The boundary geometry uploaded by the user.

    Returns:
        str: A JSON string with computed statistics for each band.
    """
    # Initialize an empty dictionary to hold statistics for all bands.
    stats_dict = {}

    # Get the list of bands from the image.
    bands = image.bandNames().getInfo()

    # Iterate over each band in the image.
    for band in bands:
        band_image = image.select(band)

        # Reduce the image within the boundary geometry.
        stats = band_image.reduceRegion(
            reducer=ee.Reducer.mean()
            .combine(reducer2=ee.Reducer.min(), sharedInputs=True)
            .combine(reducer2=ee.Reducer.max(), sharedInputs=True)
            .combine(reducer2=ee.Reducer.sum(), sharedInputs=True)
            .combine(reducer2=ee.Reducer.median(), sharedInputs=True)
            .combine(reducer2=ee.Reducer.stdDev(), sharedInputs=True),
            geometry=boundary_geometry,
            scale=30,
            bestEffort=True
        )

        # Fetch and format the results for this band.
        stats = stats.getInfo()
        stats_dict[band] = {
            "mean": stats.get(f"{band}_mean"),
            "min": stats.get(f"{band}_min"),
            "max": stats.get(f"{band}_max"),
            "sum": stats.get(f"{band}_sum"),
            "median": stats.get(f"{band}_median"),
            "stdDev": stats.get(f"{band}_stdDev"),
        }

    # Convert the dictionary to a JSON string.
    stats_json = json.dumps(stats_dict)
    return stats_json

def generate_band_histograms(image, boundary_geometry):
    """
    Generate histograms for each band within the specified boundary from an Image.

    Args:
        image (ee.Image): The input Image to analyze.
        boundary_geometry (ee.Geometry): The boundary geometry uploaded by the user.

    Returns:
        str: A JSON string containing histogram data for each band.
    """
    # Get the list of bands from the image.
    bands = image.bandNames().getInfo()

    # Initialize a dictionary to store histogram data for each band.
    histograms = {}

    # Iterate over each band in the image.
    for band in bands:
        band_image = image.select(band)

        # Compute the histogram for the band within the boundary geometry.
        histogram = band_image.reduceRegion(
            reducer=ee.Reducer.fixedHistogram(0, 1, 50),  # Adjust min, max, and bins as needed
            geometry=boundary_geometry,
            scale=30,
            bestEffort=True
        )

        # Fetch and format the histogram data for this band.
        histograms[band] = histogram.getInfo().get(band)

    # Convert the dictionary to a JSON string.
    histograms_json = json.dumps(histograms)
    return histograms_json