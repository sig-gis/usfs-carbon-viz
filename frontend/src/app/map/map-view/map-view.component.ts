import { Component, inject, Input, OnInit } from '@angular/core';
import { Map, MapMouseEvent, StyleSpecification } from 'maplibre-gl';
import { AppconfigService } from 'src/app/service/appconfig.service';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { AppConfig } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-map-view',
  template: `
        <mgl-map
          [style]="config.mapConfig.style"
          [zoom]="[4]"
          [center]="[-98.63567370723634, 40.034319079065874]"
          (mapLoad)="onMapLoad($event)"
          (mapClick)="onMapClick($event)"
          >
        <ng-container *ngIf="config.highlight && config.highlight.length > 0">
            <app-highlight-layer
              *ngFor="let highlightLayer of config.highlight" [highlightLayer] = "highlightLayer"
              [adminModeActive]="config.adminModeActive"
              [config]="config"
              [selectedAdminLevel]="config.selectedAdminLevel ?? null"
            ></app-highlight-layer>
        </ng-container>

        <app-us-boundary-layer
              [adminModeActive]="config.adminModeActive"
              [config]="config"
              [selectedAdminLevel]="config.selectedAdminLevel ?? null"
        ></app-us-boundary-layer>

        <ng-container *ngFor="let layer of config.layers">
          <ng-container [ngSwitch]="layer.type">
            <ng-container *ngSwitchCase="'layerGroup'">
              <app-layer-group [layer]="layer" [config]="config"></app-layer-group>
            </ng-container>
            <ng-container *ngSwitchCase="'wms'">
              <app-wms-layer [layer]="layer"></app-wms-layer>
            </ng-container>
            <ng-container *ngSwitchCase="'line'">
              <app-line-layer [layer]="layer"></app-line-layer>
            </ng-container>
            <ng-container *ngSwitchCase="'point'">
              <app-point-layer [layer]="layer"></app-point-layer>
            </ng-container>
          </ng-container>
        </ng-container>

        <mgl-control mglNavigation position="top-right"></mgl-control>
        </mgl-map>

        <app-basemap-control (styleSelected)="updateStyle($event)"></app-basemap-control>
        <app-map-attribution></app-map-attribution>
    `,
  styles: [`
        mgl-map {
          height: calc(100vh - 70px);
          width: 100%;
        }
    `]
})
export class MapViewComponent implements OnInit {

  @Input() config!: AppConfig;
  configService = inject(AppconfigService);

  map!: Map;
  draw!: MapboxDraw;
  private drawInitialized = false;

  ngOnInit(): void { }

  onMapLoad(map: Map): void {
    this.map = map;
    this.configService.setMap(map);

    if (!this.drawInitialized) {
      this.initializeDrawControl();
      this.drawInitialized = true;
    }

    (this.map as any).addControl(this.draw);
    this.configService.setDrawControl(this.draw);
    
    this.moveLayersToTop();
  }

  onMapClick(evt: MapMouseEvent): void {
    // console.log('Map clicked:', evt.lngLat);
    // this.moveLayersToTop();
  }

  private initializeDrawControl(): void {
    const drawStyles = [
      {
        'id': 'gl-draw-polygon-fill', 'type': 'fill',
        'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'paint': { 'fill-color': '#D20C0C', 'fill-outline-color': '#D20C0C', 'fill-opacity': 0.1 }
      },
      {
        'id': 'gl-draw-polygon-stroke-active', 'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#D20C0C', 'line-dasharray': [0.2, 2], 'line-width': 2 }
      },
      {
        'id': 'gl-draw-polygon-stroke-inactive', 'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'false']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#D20C0C', 'line-width': 2 }
      },
      {
        'id': 'gl-draw-line-inactive', 'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'false']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#D20C0C', 'line-width': 2 }
      },
      {
        'id': 'gl-draw-line-active', 'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
        'layout': { 'line-cap': 'round', 'line-join': 'round' },
        'paint': { 'line-color': '#D20C0C', 'line-dasharray': [0.2, 2], 'line-width': 2 }
      },
      {
        'id': 'gl-draw-point-point-stroke-inactive', 'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
        'paint': { 'circle-radius': 5, 'circle-color': '#D20C0C' }
      },
      {
        'id': 'gl-draw-point-point-stroke-active', 'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['==', 'active', 'true']],
        'paint': { 'circle-radius': 7, 'circle-color': '#D20C0C' }
      }
    ];

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, point: true, trash: true },
      styles: drawStyles
    });
  }

  updateStyle(selectedStyle: string): void {
    const styleMap: { [key: string]: string } = {
      'Rupabumi': 'https://api.maptiler.com/maps/winter-v2/style.json?key=TUeJmK9d5lh6wwNUyq6u',
      'Rupabumi2': '/assets/map_style/style_rbi_v1_no_building.json',
      'Citra Satelit': '/assets/map_style/style_sattelite.json',
      'Bright Style': '/assets/map_style/style_maptiler_3d.json',
      'Mapfan': '/assets/map_style/style_rbi_v1_mapfan.json',
    };

    const selected = styleMap[selectedStyle];
    if (selected) {
      this.map.setStyle(selected, { diff: true });
    }
  }

  private moveLayersToTop(): void {
    // Use a timeout to ensure all layers have been added to the map before moving them.
    setTimeout(() => {
      const drawLayerIds = [
        'gl-draw-polygon-fill', 'gl-draw-polygon-stroke-active', 'gl-draw-polygon-stroke-inactive',
        'gl-draw-line-inactive', 'gl-draw-line-active', 'gl-draw-point-point-stroke-inactive',
        'gl-draw-point-point-stroke-active',
      ];

      const boundaryLayerIds = [
        'us-boundary-line',
        'US_States-outline',
      ];
      
      // Combine the lists. By moving boundary layers last, we ensure they are on top.
      const allLayersToMove = [...drawLayerIds, ...boundaryLayerIds];

      allLayersToMove.forEach(layerId => {
        if (this.map.getLayer(layerId)) {
          this.map.moveLayer(layerId);
        }
      });
    }, 200);
  }
}