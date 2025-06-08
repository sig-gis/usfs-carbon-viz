import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { ConfigLayer, AppConfig } from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { LngLatBounds, Map, MapMouseEvent } from 'maplibre-gl';
@Component({
  selector: 'app-highlight-layer',
  template: `
    <mgl-vector-source [id]="id" [tiles]="url" [scheme]="'xyz'"></mgl-vector-source>

    <mgl-layer
      [id]="id"
      type="line"
      [source]="id"
      [layout]="{}"
      [paint]="{
        'line-color': color,
        'line-width': width
      }"
      [before]="before"
      [sourceLayer]="sourceLayer"
    ></mgl-layer>

    <mgl-layer
      *ngIf="adminModeActive"
      [id]="id + '-clickable'"
      type="fill"
      [source]="id"
      [paint]="{
        'fill-color': '#000000',
        'fill-opacity': 0
      }"
      [sourceLayer]="sourceLayer"
      (layerClick)="onLayerClick($event)"
    ></mgl-layer>

    <mgl-geojson-source
      *ngIf="selectedFeature"
      id="selected-feature-source"
      [data]="selectedFeature"
    ></mgl-geojson-source>

    <mgl-layer
      *ngIf="selectedFeature"
      id="selected-feature-layer"
      type="fill"
      source="selected-feature-source"
      [paint]="{
        'fill-color': '#FF0000',
        'fill-opacity': 0.1
      }"
    ></mgl-layer>

    <mgl-layer
      *ngIf="selectedFeature"
      id="selected-feature-outline"
      type="line"
      source="selected-feature-source"
      [paint]="{
        'line-color': '#FF0000',
        'line-width': 2
      }"
    ></mgl-layer>

    <mgl-popup
      *ngIf="popupCoords"
      [lngLat]="popupCoords"
      (close)="popupCoords = null"
    >
      <div>
        <strong>Properties:</strong>
        <pre>{{ popupFeature?.properties | json }}</pre>
        <button (click)="logGeometry()">Select this admin boundary</button>
      </div>
    </mgl-popup>
  `,
  styles: []
})
export class HighlightLayerComponent implements OnInit, OnChanges {
  @Input() highlightLayer!: ConfigLayer;
  @Input() adminModeActive: boolean = false;
  // @Input() mapInstance!: Map;
  @Input() config!: AppConfig;

  title!: string;
  id!: string;
  type!: string;
  url!: any;
  sourceLayer?: string;
  color?: string;
  width?: number;
  lineJoin?: 'round' | 'bevel' | 'miter';
  lineCap?: 'round' | 'butt' | 'square';
  before?: string;
  popupCoords: [number, number] | null = null;
  popupFeature: any = null;
  selectedFeature: FeatureCollection | null = null;

  constructor(private configService: AppconfigService) {}

  ngOnInit(): void {
    this.title = this.highlightLayer.title;
    this.id = this.highlightLayer.id;
    this.url = this.highlightLayer.url;
    this.sourceLayer = this.highlightLayer.sourceLayer;
    this.color = this.highlightLayer.style?.color || 'cyan';
    this.width = this.highlightLayer.style?.width || 0.2;
    this.lineJoin = this.highlightLayer.layout?.lineJoin || 'round';
    this.lineCap = this.highlightLayer.layout?.lineCap || 'round';
    this.before = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adminModeActive'] && changes['adminModeActive'].currentValue === false) {
      this.selectedFeature = null;
      this.popupCoords = null;
      this.popupFeature = null;
    }
  }

  onLayerClick(event: any) {
    if (event.features && event.features.length > 0) {
      this.popupFeature = event.features[0];
      this.popupCoords = [event.lngLat.lng, event.lngLat.lat];
      this.selectedFeature = {
        type: 'FeatureCollection',
        features: [this.popupFeature]
      };
    }
  }

  logGeometry() {
    if (this.popupFeature?.geometry) {
      this.configService.updateSelectedGeometryWithArea(this.popupFeature.geometry);

      // Zoom to geometry
      const bounds = new LngLatBounds();
      const coords = this.popupFeature.geometry.coordinates.flat(Infinity);
      for (let i = 0; i < coords.length; i += 2) {
        bounds.extend([coords[i], coords[i + 1]]);
      }

      if (this.config?.mapInterface?.map) {
        const map = this.config.mapInterface.map; // Now safe to use
        const mapWidth = map.getCanvas().width;
        const padding = 300;
        const offset: [number, number] = [mapWidth * 0.05, 0]; // 25% of the map width to the right
        
        map.fitBounds(bounds, {
          padding: padding,
          offset: offset
        });
      }  
      
      // Close the popup after selecting geometry
      this.popupCoords = null;
    } else {
      console.log('No geometry found on feature.');
    }
  }
}
