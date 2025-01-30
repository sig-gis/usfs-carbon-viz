import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, MapMouseEvent, PointLike } from 'maplibre-gl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  constructor(private http: HttpClient) { }


  //Handle map click
  public mapClickHandler(evt: MapMouseEvent): void {

  }

  //Calculate statistic from geometry (geometry, data to calculate, APIurl) | return data statistic of sum, mean, median, min, max

  //Get feature from API by field data (data, field, query, APIurl) | return geojson feature(s)

  //Check overlay (data1, data2, bound analysis, APIurl) | output analisis overlay

  //Zoom to feature (feature) | output move to new feature

  //

  identifyWMS(evt: MapMouseEvent, map: Map): void {
    console.log('Map clicked:', evt.lngLat);
    // console.log(screenPoint);

    // // Get the clicked point's screen coordinates
    const screenPoint = evt.point;

    // const offsetScreenPoint: PointLike = [screenPoint.x + 5, screenPoint.y - 5];

    // console.log(offsetScreenPoint2);
    const screenPointTopLeft: PointLike = [screenPoint.x - 5, screenPoint.y - 5];
    const screenPointBottomRight: PointLike = [screenPoint.x + 5, screenPoint.y + 5];

    const topLeftLngLat = map.unproject(screenPointTopLeft);
    const bottomRightLngLat = map.unproject(screenPointBottomRight);

    // Create a bounding box around the clicked point
    const boundingBox = {
      minX: topLeftLngLat.lng,
      minY: bottomRightLngLat.lat,
      maxX: topLeftLngLat.lat,
      maxY: bottomRightLngLat.lng
    };

    // console.log('Bounding Box:', boundingBox);
  }

  identifyNOP(nop: string, url: string): Observable<any> {
    // Construct the URL with parameters
    const apiUrl = `${url}?nop=${nop}`;

    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => {
        // Process the response if needed

        // console.log(response);
        return response;
      }),
      catchError((error: Error) => {
        console.error(error);
        // Handle the error, and optionally return a default value or rethrow it
        throw error;
      })
    );
  }

  identifyXY(evt: MapMouseEvent, url: string): Observable<any> {
    // Extract latitude and longitude from the MapMouseEvent
    const x = evt.lngLat.lng;
    const y = evt.lngLat.lat;

    // Construct the URL with parameters
    const apiUrl = `${url}?x=${x}&y=${y}`;

    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => {
        // Process the response if needed

        // console.log(response);
        return response;
      }),
      catchError((error: Error) => {
        console.error(error);
        // Handle the error, and optionally return a default value or rethrow it
        throw error;
      })
    );
  }

  calcStatformBBOX(bbox: LngLatBounds | undefined, url: string): Promise<any> {
    // Extract bbox
    const maxlat = bbox?.getNorth()
    const minlat = bbox?.getSouth()
    const maxlon = bbox?.getEast()
    const minlon = bbox?.getWest()

    // Construct the URL with parameters
    const apiUrl = `${url}?maxlat=${maxlat}&minlat=${minlat}&maxlon=${maxlon}&minlon=${minlon}`

    //Return the data
    return this.http.get<any>(apiUrl).toPromise();
  }

  zoomtogeojson(geom: any, map: Map | undefined) {
    if (map) {
      let bounds = new LngLatBounds();

      if (geom.type === 'FeatureCollection') {
        geom.features.forEach((feature: any) => {
          this.extendBounds(bounds, feature.geometry.coordinates);
        });
      } else if (geom.type === 'Feature') {
        this.extendBounds(bounds, geom.geometry.coordinates);
      }

      const mapWidth = map.getCanvas().width;
      const padding = 200;
      const offset: [number, number] = [mapWidth * 0.05, 0]; // 25% of the map width to the right

      const extendedBounds = this.extendBoundsWithOffset(bounds, mapWidth, offset[0]);

      map.fitBounds(extendedBounds, {
        padding: padding,
        offset: offset
      });
    }
  }

  extendBounds(bounds: LngLatBounds, coordinates: any) {
    if (coordinates[0][0] instanceof Array) {
      coordinates.forEach((coordArray: any) => {
        coordArray.forEach((coord: any) => {
          bounds.extend(coord);
        });
      });
    } else {
      coordinates.forEach((coord: any) => {
        bounds.extend(coord);
      });
    }
  }

  extendBoundsWithOffset(bounds: LngLatBounds, mapWidth: number, offsetX: number): LngLatBounds {
    const offsetLng = (bounds.getEast() - bounds.getWest()) * (offsetX / mapWidth);
    return new LngLatBounds(
      [bounds.getWest() - offsetLng, bounds.getSouth()],
      [bounds.getEast(), bounds.getNorth()]
    );
  }

  getRoute(start: [number, number], end: [number, number]): Observable<any> {
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=true&geometries=geojson&language=id&overview=full&steps=true&access_token=pk.eyJ1IjoibXdhcml6bWl3YWZpcSIsImEiOiIwdDQ1cDBjIn0.1NxYA6PkqTEOqW__lEqwHA`;

    return this.http.get<any>(apiUrl).pipe(
      map((response: any) => {
        // console.log(response);
        // Process the response if needed
        return response;
      }),
      catchError((error: Error) => {
        console.error(error);
        // Handle the error, and optionally return a default value or rethrow it
        throw error;
      })
    );
  }

}


