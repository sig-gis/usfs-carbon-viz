import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AppConfig, ConfigLayer, MapConfig, Analysis } from './layers.interface';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Map } from 'maplibre-gl';
import { EarthEngineService } from './ee/ee.service';
import { map } from 'rxjs/operators';
import { staticConfig } from './static-config';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {
  layerconfig: AppConfig = staticConfig;

  constructor(private httpClient: HttpClient, private eeService: EarthEngineService) { }

  private config$ = new BehaviorSubject<AppConfig>(this.layerconfig);

  public getConfig(map_code: any = ""): Observable<AppConfig> {
    this.config$.next(staticConfig);
    return this.config$;
  }


  convertEETilesToWMS(layers: ConfigLayer[]): Observable<ConfigLayer[]> {
    const processLayer = (layer: ConfigLayer): Observable<ConfigLayer> => {
      // Handle layer groups recursively
      if (layer.type === 'layerGroup' && layer.groupLayers) {
        return forkJoin(
          layer.groupLayers.map((groupLayer: ConfigLayer) => processLayer(groupLayer))
        ).pipe(
          map(updatedGroupLayers => ({
            ...layer,
            groupLayers: updatedGroupLayers
          }))
        );
      }

      // Convert eeTiles to WMS
      if (layer.type === 'eeTiles' && layer.eeVisParams) {
        return this.eeService.getXyzUrl(layer.url[0], layer.eeVisParams).pipe(
          map(xyzUrl => ({
            ...layer,
            url: [xyzUrl],
            type: 'wms'
          }))
        );
      }

      // Return unchanged layer
      return of(layer);
    };

    // Process all layers
    const updates = layers.map(layer => processLayer(layer));
    return forkJoin(updates) as Observable<ConfigLayer[]>;
  }


  getLayerList(): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + '/layers');
  }

  setMap(map: Map): void {
    const currentConfig = this.config$.value;

    this.config$.next({
      ...currentConfig,
      status: {
        ...currentConfig.status,
        screenLoading: true
      }
    });

    this.convertEETilesToWMS(currentConfig.layers).subscribe({
      next: (updatedLayers) => {
        const updatedConfig: AppConfig = {
          ...currentConfig,
          layers: updatedLayers,
          mapInterface: updatedMap,
          status: {
            ...currentConfig.status,
            screenLoading: false
          }
        };
        this.config$.next(updatedConfig);
      },
      error: (err) => console.error('Error converting EE tiles:', err)
    });

    const updatedMap = { ...currentConfig.mapInterface, map: map }

    const updatedConfig: AppConfig = {
      ...currentConfig,
      mapInterface: updatedMap,
    };

    this.config$.next(updatedConfig);
  }

  public updateConfig(newConfig: AppConfig): void {
    this.config$.next(newConfig);
  }

  public getUpdatedConfig(): Observable<any> {
    return this.config$;
  }

  // public updateVisible(layerId: string): void {
  //   const currentConfig = this.config$.value;

  //   const updatedLayers = currentConfig.layers.map((layer, index, array) => {
  //     // Check if the current layer id matches the provided layerId
  //     if (layer.id === layerId) {
  //       // Initialize with the current layer's placed_before value
  //       let newPlacedBefore = layer.placed_before;

  //       // Check if there's a layer with placed_before = building whose id is not the current layer's id
  //       const hasLayerWithBuilding = array.some((item, itemIndex) => item.placed_before === 'building' && itemIndex < index);

  //       const hasLayerTop = array.some((item, itemIndex) => item.placed_before === "" && itemIndex < index);

  //       // If there's such a layer and the current layer's placed_before is neither 'building' nor an empty string, update newPlacedBefore
  //       if ((hasLayerTop && layer.placed_before !== 'building') || hasLayerWithBuilding || (layer.placed_before !== 'building' && layer.placed_before !== '')) {
  //         // Update the placed_before value to the id of the previous layer if it exists
  //         if (index > 0) {
  //           newPlacedBefore = array[index - 1].id;
  //         }
  //       }

  //       return { ...layer, visible: !layer.visible, placed_before: newPlacedBefore };
  //     }
  //     return layer;
  //   });

  //   const updatedConfig: AppConfig = {
  //     ...currentConfig,
  //     layers: updatedLayers,
  //   };

  //   this.config$.next(updatedConfig);
  // }

  private calculatePlacedBefore(layer: ConfigLayer, array: ConfigLayer[], index: number): string {
    let newPlacedBefore = layer.placed_before;

    // Helper function to get actual layer ID
    const getActualLayerId = (layer: ConfigLayer): string => {
      return layer.type === 'layerGroup' ? layer.activeLayerId || '' : layer.id;
    };

    const hasLayerWithBuilding = array.some(
      (item, itemIndex) => item.placed_before === 'building' && itemIndex < index
    );

    const hasLayerTop = array.some(
      (item, itemIndex) => item.placed_before === "" && itemIndex < index
    );

    if ((hasLayerTop && layer.placed_before !== 'building') ||
      hasLayerWithBuilding ||
      (layer.placed_before !== 'building' && layer.placed_before !== '')) {
      if (index > 0) {
        // Use active layer ID for group layers
        const previousLayer = array[index - 1];
        newPlacedBefore = getActualLayerId(previousLayer);
      }
    }

    return newPlacedBefore || '';
  }

  public updateVisible(layerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer, index, array) => {
      if (layer.type === 'layerGroup' && layer.groupLayers) {
        if (layer.id === layerId) {
          const newVisible = !layer.visible;
          const newPlacedBefore = this.calculatePlacedBefore(layer, array, index);
          return {
            ...layer,
            visible: newVisible,
            placed_before: newPlacedBefore,
            groupLayers: layer.groupLayers.map((groupLayer: ConfigLayer) => ({
              ...groupLayer,
              visible: newVisible && groupLayer.id === layer.activeLayerId
            }))
          };
        }
      }

      if (layer.id === layerId) {
        const newPlacedBefore = this.calculatePlacedBefore(layer, array, index);
        return {
          ...layer,
          visible: !layer.visible,
          placed_before: newPlacedBefore
        };
      }
      return layer;
    });

    this.config$.next({
      ...currentConfig,
      layers: updatedLayers
    });
  }

  public updateActiveGroupLayer(groupId: string, newActiveLayerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer, index, array) => {
      if (layer.type === 'layerGroup' && layer.id === groupId) {
        const newPlacedBefore = this.calculatePlacedBefore(layer, array, index);
        return {
          ...layer,
          activeLayerId: newActiveLayerId,
          placed_before: newPlacedBefore,
          groupLayers: layer.groupLayers?.map((groupLayer: ConfigLayer) => ({
            ...groupLayer,
            visible: groupLayer.id === newActiveLayerId && layer.visible
          }))
        };
      }
      return layer;
    });

    this.config$.next({
      ...currentConfig,
      layers: updatedLayers
    });
  }

  public updateVisible2(layerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer) => {
      if (layer.id === layerId) {
        return { ...layer, visible: !layer.visible };
      }
      return layer;
    });

    const updatedConfig: AppConfig = {
      ...currentConfig,
      layers: updatedLayers,
    };

    this.config$.next(updatedConfig);
  }

  public addHighlight(highlight: ConfigLayer | null): void {
    const currentConfig = this.config$.value;

    // Ensure that analysis is initialized as an empty array if it's undefined
    const highlightArray = currentConfig.highlight || [];

    if (highlight === null) {
      // Clear the array if the highlight is null
      highlightArray.length = 0;
    } else if (highlightArray.length > 0) {
      highlightArray[0] = highlight;
    } else {
      highlightArray.push(highlight);
    }

    const updatedConfig: AppConfig = { ...currentConfig, highlight: highlightArray };
    this.config$.next(updatedConfig);
  }

  public addLayer(layer: ConfigLayer): void {
    const currentConfig = this.config$.value;
    const updatedLayers = [...currentConfig.layers, layer];
    const updatedConfig: AppConfig = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public reorderLayers(map: Map, currentIndex: string, previousIndex: string, movedLayerId: string, beforeLayerid?: string, setBuilding?: string, moveItem?: boolean, setTop?: string): void {
    console.log("REORDER LAYER");

    const currentConfig = this.config$.value;

    // Helper to get the actual layer ID (either group's active layer or regular layer)
    const getActualLayerId = (layerId: string): string => {
      const layer = currentConfig.layers.find(l => l.id === layerId);
      if (layer?.type === 'layerGroup') {
        return layer.activeLayerId || '';
      }
      return layerId;
    };

    // Get actual layer IDs for move operation
    const actualMovedId = getActualLayerId(movedLayerId);
    let actualBeforeId = getActualLayerId(beforeLayerid || '');

    console.log("Set placed before", actualBeforeId);

    // Move layer in map using actual layer IDs
    if (actualMovedId) {
      map.moveLayer(actualMovedId, actualBeforeId);
    }

    // Rest of the reordering logic remains the same
    const prevIndex = currentConfig.layers.findIndex(layer => layer.id === previousIndex);
    const currIndex = currentConfig.layers.findIndex(layer => layer.id === currentIndex);

    // Clone and update layers array
    const updatedLayers = [...currentConfig.layers];

    // Update placed_before attribute
    const layerToUpdate = updatedLayers.find(layer => layer.id === movedLayerId);
    if (layerToUpdate) {
      layerToUpdate.placed_before = actualBeforeId;
    }

    if (setBuilding) {
      const newUnderBuilding = updatedLayers.find(layer => layer.id === setBuilding);
      if (newUnderBuilding) {
        newUnderBuilding.placed_before = "building";
      }
    }

    if (setTop) {
      const newTop = updatedLayers.find(layer => layer.id === setBuilding);
      if (newTop) {
        newTop.placed_before = "";
      }
    }

    if (moveItem) {
      if (beforeLayerid == "building") {
        moveItemInArray(updatedLayers, prevIndex, currIndex - 1);
      }
      else {
        moveItemInArray(updatedLayers, prevIndex, currIndex);
      }
    } else {
      moveItemInArray(updatedLayers, prevIndex, currIndex);
    }

    // ...existing building and top settings code...

    this.config$.next({
      ...currentConfig,
      layers: updatedLayers
    });
  }

  public reorderLayers2(map: Map, currentIndex: string, previousIndex: string, movedLayerId: string, beforeLayerid?: string, setBuilding?: string, moveItem?: boolean, setTop?: string): void {
    this

    map.moveLayer(movedLayerId, beforeLayerid);

    // console.log("currentIndex:", currentIndex, "previousIndex:", previousIndex, " movedLayerId:", movedLayerId, " beforeLayerid:", beforeLayerid, "setBuilding", setBuilding, "setTop:", setTop);

    const currentConfig = this.config$.value;

    const prevIndex = currentConfig.layers.findIndex(layer => layer.id === previousIndex);
    const currIndex = currentConfig.layers.findIndex(layer => layer.id === currentIndex);

    // Clone the current layers array to make changes
    const updatedLayers = [...currentConfig.layers];

    // Update the 'placed_before' attribute
    const layerToUpdate = updatedLayers.find(layer => layer.id === movedLayerId);
    if (layerToUpdate) {
      layerToUpdate.placed_before = beforeLayerid;
    }

    if (setBuilding) {
      const newUnderBuilding = updatedLayers.find(layer => layer.id === setBuilding);
      if (newUnderBuilding) {
        newUnderBuilding.placed_before = "building";
      }
    }

    if (setTop) {
      const newTop = updatedLayers.find(layer => layer.id === setBuilding);
      if (newTop) {
        newTop.placed_before = "";
      }
    }

    if (moveItem) {
      if (beforeLayerid == "building") {
        moveItemInArray(updatedLayers, prevIndex, currIndex - 1);
      }
      else {
        moveItemInArray(updatedLayers, prevIndex, currIndex);
      }
    } else {
      moveItemInArray(updatedLayers, prevIndex, currIndex);
    }

    const updatedConfig: AppConfig = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public removeLayerById(layerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.filter((layer: { id: string; }) => layer.id !== layerId);
    const updatedConfig: any = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public changeOpacity(layerId: string, value: number): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer) => {
      if (layer.id === layerId) {
        return { ...layer, opacity: value };
      }
      return layer;
    });

    const updatedConfig: AppConfig = {
      ...currentConfig,
      layers: updatedLayers,
    };

    this.config$.next(updatedConfig);
  }

  public updateStyle(newStyle: string): void {
    const currentConfig = this.config$.value;
    const updatedMapConfig: MapConfig = {
      ...currentConfig.mapConfig,
      style: newStyle,
    };

    // console.log(currentConfig, "Current Config");

    const updatedConfig: AppConfig = {
      ...currentConfig,
      mapConfig: updatedMapConfig,
    };

    this.config$.next(updatedConfig);
  }

  public updateAnalysis(output: Analysis | null): void {
    const currentConfig = this.config$.value;

    // Ensure that analysis is initialized as an empty array if it's undefined
    const analysisArray = currentConfig.analysis || [];

    if (output === null) {
      // Clear the array if the output is null
      analysisArray.length = 0;
    } else if (analysisArray.length > 0) {
      analysisArray[0] = output;
    } else {
      analysisArray.push(output);
    }

    const updatedConfig: AppConfig = { ...currentConfig, analysis: analysisArray };

    this.config$.next(updatedConfig);
  }

}
