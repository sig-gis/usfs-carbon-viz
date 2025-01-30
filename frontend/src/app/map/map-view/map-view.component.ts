import { Component, inject, Input, OnInit } from '@angular/core';
import { Map, MapMouseEvent } from 'maplibre-gl';
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
            ></app-highlight-layer>
        </ng-container>

        <ng-container *ngFor="let layer of config.layers">
          <ng-container [ngSwitch]="layer.type">
            <!-- WMS Layer -->
            <ng-container *ngSwitchCase="'wms'">
              <app-wms-layer [layer]="layer"></app-wms-layer>
            </ng-container>

            <!-- Line Layer -->
            <ng-container *ngSwitchCase="'line'">
              <app-line-layer [layer]="layer"></app-line-layer>
            </ng-container>

            <!-- Point Layer -->
            <ng-container *ngSwitchCase="'point'">
              <app-point-layer [layer]="layer"></app-point-layer>
            </ng-container>

          </ng-container>
       </ng-container>

      <mgl-control
        mglNavigation position="top-right">
      </mgl-control>

      </mgl-map>

      <app-basemap-control (styleSelected)="updateStyle($event)"></app-basemap-control>`,
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

  constructor() { }

  onMapLoad(map: Map) {
    this.map = map;
    this.configService.setMap(map);

    // Define custom styles for drawing
    const drawStyles = [
      {
        'id': 'gl-draw-polygon-fill',
        'type': 'fill',
        'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'paint': {
          'fill-color': '#D20C0C',
          'fill-outline-color': '#D20C0C',
          'fill-opacity': 0.1
        }
      },
      {
        'id': 'gl-draw-polygon-stroke-active',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true']],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-color': '#D20C0C',
          'line-dasharray': [0.2, 2],
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-polygon-stroke-inactive',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'false']],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-color': '#D20C0C',
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-line-inactive',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'false']],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-color': '#D20C0C',
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-line-active',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-color': '#D20C0C',
          'line-dasharray': [0.2, 2],
          'line-width': 2
        }
      },
      {
        'id': 'gl-draw-point-point-stroke-inactive',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
        'paint': {
          'circle-radius': 5,
          'circle-color': '#D20C0C'
        }
      },
      {
        'id': 'gl-draw-point-point-stroke-active',
        'type': 'circle',
        'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['==', 'active', 'true']],
        'paint': {
          'circle-radius': 7,
          'circle-color': '#D20C0C'
        }
      }
    ];

    // Initialize Mapbox Draw
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      styles: drawStyles
    });
    (this.map as any).addControl(this.draw);

    // Handle draw events
    // this.map.on('draw.create', this.updateArea.bind(this));
    // this.map.on('draw.update', this.updateArea.bind(this));
    // this.map.on('draw.delete', this.updateArea.bind(this));
  }

  onMapClick(evt: MapMouseEvent) {
    // console.log('Map clicked:', evt.lngLat);
    //this.map.setStyle("/assets/map_style/style_maptiler_3d.json", ({ diff: true }));
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }

  updateStyle(selectedStyle: string) {

    switch (selectedStyle) {
      case 'Rupabumi':
        // this.configService.updateStyle("/assets/map_style/style_rbi_v1.json");
        this.map.setStyle("https://api.maptiler.com/maps/winter-v2/style.json?key=TUeJmK9d5lh6wwNUyq6u", ({ diff: true }));
        console.log('Updating map style to Rupabumi');
        break;
      case 'Rupabumi2':
        // this.configService.updateStyle("/assets/map_style/style_rbi_v1_no_building.json");
        this.map.setStyle("/assets/map_style/style_rbi_v1_no_building.json", ({ diff: true }));
        // console.log('Updating map style to Rupabumi2');
        break;
      case 'Citra Satelit':
        // this.configService.updateStyle("/assets/map_style/style_sattelite.json");
        this.map.setStyle("/assets/map_style/style_sattelite.json", ({ diff: true }));
        // console.log('Updating map style to Citra Satelit');
        break;
      case 'Bright Style':
        // this.style = "/assets/map_style/style_maptiler_3d.json"
        // Code to update the map style to 'Citra Satelit' style
        // this.configService.updateStyle("/assets/map_style/style_maptiler_3d.json");
        console.log(this.map.getStyle());
        this.map.setStyle("/assets/map_style/style_maptiler_3d.json", ({ diff: true }));
        // console.log('Bright Style');
        break;
      case 'Mapfan':
        // this.style = "/assets/map_style/style_maptiler_3d.json"
        // Code to update the map style to 'Citra Satelit' style
        // this.configService.updateStyle("/assets/map_style/style_maptiler_3d.json");
        console.log(this.map.getStyle());
        this.map.setStyle("/assets/map_style/style_rbi_v1_mapfan.json", ({ diff: true }));
        // console.log('Bright Style');
        break;
    }
  }

}
