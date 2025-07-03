import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class EarthEngineService {

  ngZone = inject(NgZone);

  private token$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  /**
   * Authenticate with the backend and initialize Earth Engine.
   * @returns Observable<boolean> indicating success or failure.
   */
  authenticate(): Observable<boolean> {
    console.log('[EarthEngineService] Starting authentication...');

    return this.http.post<any>('https://app.wildfireriskcarbon.org/api/auth/usfs', {}).pipe(
      switchMap((response) => {
        // console.log('[EarthEngineService] Backend response:', response);
        const { token, user } = response;
        if (!token || !user) {
          throw new Error('Invalid response: missing token or user');
        }

        return from(new Promise<boolean>((resolve, reject) => {
          try {
            // console.log('[EarthEngineService] Setting auth token...');

            ee.data.setAuthToken(
              null,  // client ID not needed for bearer token
              "Bearer",
              token,
              '3600',
              [],
              () => {
                // console.log('[EarthEngineService] Auth token set successfully');
                // Verify the token was set
                const authToken = ee.data.getAuthToken();
                ee.initialize(
                  'https://earthengine.googleapis.com',
                  'https://earthengine.googleapis.com',
                  () => {
                    // console.log('[EarthEngineService] EE initialized successfully');
                    resolve(true);
                  },
                  (error: any) => {
                    // console.error('[EarthEngineService] EE initialization error:', error);
                    reject(error);
                  }
                );
              },
              (error: any) => {
                console.error('[EarthEngineService] Error setting auth token:', error);
                console.error('[EarthEngineService] Error details:', {
                  name: error.name,
                  message: error.message,
                  stack: error.stack
                });
                reject(error);
              }
            );
          } catch (error) {
            console.error('[EarthEngineService] Unexpected error:', error);
            reject(error);
          }
        }));
      }),
      catchError((error) => {
        console.error('[EarthEngineService] Authentication error:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Translate an Earth Engine asset ID to an XYZ URL.
   * @param assetId The ID of the Earth Engine asset.
   * @param visParams Visualization parameters for the asset.
   * @returns Observable<string> The XYZ URL.
   */
  getXyzUrl(assetId: string, visParams: any): Observable<string> {
    return new Observable((observer) => {
      try {
        // if (!this.token$.value) {
        //   throw new Error('Not authenticated with Earth Engine');
        // }

        const asset = ee.Image(assetId);
        asset.getMap(visParams, (map: any) => {
          if (map && map.urlFormat) {
            observer.next(map.urlFormat);
            observer.complete();
          } else {
            observer.error(new Error('Failed to generate XYZ URL'));
          }
        });
      } catch (error) {
        console.error('[EarthEngineService] Error generating XYZ URL:', error);
        observer.error(error);
      }
    });
  }

  /**
   * Get the current token as an observable.
   * @returns Observable<string | null>
   */
  getToken(): Observable<string | null> {
    return this.token$.asObservable();
  }

  calculateZonalStatistics(
    assetId: string,
    band: string,
    region: any,
    unit: string
  ): Observable<any> {
    return new Observable((observer) => {
      try {
        const image = ee.Image(assetId).select(band);
        const clipped = image.clip(region);

        // Define reducer to calculate mean, min, max, and sum
        const reducer = ee.Reducer.mean()
          .combine(ee.Reducer.min(), '', true)
          .combine(ee.Reducer.max(), '', true)
          .combine(ee.Reducer.sum(), '', true);

        const stats = clipped.reduceRegion({
          reducer,
          geometry: region,
          scale: 30, // 30m pixel size (e.g., Landsat)
          maxPixels: 1e15
        });

        stats.evaluate((result: any, error: any) => {
          if (error) {
            observer.error(error);
          } else {
            let sum = result[`${band}_sum`];
            const mean = result[`${band}_mean`];
            const min = result[`${band}_min`];
            const max = result[`${band}_max`];

            // Convert sum to total tons for area if unit is tons/acre
            if (unit.includes('tons/acre') && typeof sum === 'number') {
              const ACRE_CONVERSION = 0.2224; // 900 m² / 4046.86 m²
              sum = sum * ACRE_CONVERSION; // total tons = per-acre value × pixel area in acres × number of pixels (implicitly via reducer sum)
            }

            observer.next({
              stats: {
                mean,
                min,
                max,
                sum,
                unit
              }
            });
            observer.complete();
          }
        });
      } catch (error) {
        observer.error(error);
      }
    });
  }

  getPixelValueAtPoint(assetId: string, band: string, point: any): Observable<any> {
    return new Observable((observer) => {
      try {
        const image = ee.Image(assetId).select(band);

        image.reduceRegion({
          reducer: ee.Reducer.first(),
          geometry: point,
          scale: 30,
          maxPixels: 1e9
        }).evaluate((result: any, error: any) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(result);
            observer.complete();
          }
        });

      } catch (error) {
        observer.error(error);
      }
    });
  }
}
