import { Component, Input, OnInit } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import { GeoJSONFeature } from 'maplibre-gl';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-highlight-layer',
  template: `
  <mgl-vector-source [id]="id" [tiles]="url" [scheme]="'xyz'">

  <!-- <mgl-geojson-source [id]="id" [data]="url"> </mgl-geojson-source> -->

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
  >
  </mgl-layer>

  <mgl-layer
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

  <mgl-popup
    *ngIf="popupCoords"
    [lngLat]="popupCoords"
    (close)="popupCoords = null"
  >
    <div>
      <strong>Properties:</strong>
      <pre>{{ popupFeature?.properties | json }}</pre>
      <button (click)="logGeometry()">Log Geometry</button>
    </div>
  </mgl-popup>
  `,
  styles: []
})
export class HighlightLayerComponent implements OnInit {

  @Input() highlightLayer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: string;
  url!: any;
  sourceLayer?: string;
  color?: string;
  width?: number;
  lineJoin?: "round" | "bevel" | "miter";
  lineCap?: "round" | "butt" | "square";
  //TODO: add more variable support.
  before?: string;
  //TODO: do not hardcode this variable.
  //instead get it from the first "symbol" in styles json.

  popupCoords: [number, number] | null = null;
  popupFeature: any = null;

  constructor() { }

  ngOnInit(): void {
    this.title = this.highlightLayer.title;
    this.id = this.highlightLayer.id;
    this.url = this.highlightLayer.url;
    this.sourceLayer = this.highlightLayer.sourceLayer;
    this.color = this.highlightLayer.style?.color || "cyan";
    this.width = this.highlightLayer.style?.width || 0.2;
    this.lineJoin = this.highlightLayer.layout?.lineJoin || "round";
    this.lineCap = this.highlightLayer.layout?.lineCap || "round";
    this.before = "";
  }

  onLayerClick(event: any) {
    console.log('Layer clicked:', event);
    // event.features[0] contains the clicked feature
    // event.lngLat contains the coordinates
    if (event.features && event.features.length > 0) {
      this.popupFeature = event.features[0];
      this.popupCoords = [event.lngLat.lng, event.lngLat.lat];
    }
  }

  logGeometry() {
    if (this.popupFeature && this.popupFeature.geometry) {
      console.log('Geometry:', this.popupFeature.geometry);
    } else {
      console.log('No geometry found on feature.');
    }
  }

}
