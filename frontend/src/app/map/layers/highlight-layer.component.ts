import { Component, Input, OnInit } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import { GeoJSONFeature } from 'maplibre-gl';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-highlight-layer',
  template: `
  <mgl-geojson-source [id]="id" [data]="url"> </mgl-geojson-source>

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
  >
  </mgl-layer>`,
  styles: []
})
export class HighlightLayerComponent implements OnInit {

  @Input() highlightLayer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: string;
  url!: any;
  color?: string;
  width?: number;
  lineJoin?: "round" | "bevel" | "miter";
  lineCap?: "round" | "butt" | "square";
  //TODO: add more variable support.
  before?: string;
  //TODO: do not hardcode this variable.
  //instead get it from the first "symbol" in styles json.

  constructor() { }

  ngOnInit(): void {
    this.title = this.highlightLayer.title;
    this.id = this.highlightLayer.id;
    this.url = this.highlightLayer.url;
    this.color = this.highlightLayer.style?.color || "cyan";
    this.width = this.highlightLayer.style?.width || 5;
    this.lineJoin = this.highlightLayer.layout?.lineJoin || "round";
    this.lineCap = this.highlightLayer.layout?.lineCap || "round";
    this.before = "";
  }

}
