import { Component, Input, OnInit } from '@angular/core';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-vector-layer',
  template: `
  <mgl-vector-source
    [id]="id"
    [tiles]="[]">
  </mgl-vector-source>

  <mgl-layer
      *ngIf="layer"
      [id]="id"
      [type]="type"
      [source]="id"
      [layout]="{
        'line-join': lineJoin,
        'line-cap': lineCap
      }"
      [paint]="{
        'line-color': color,
        'line-width': width
      }"
      [before]="before"
    >
    </mgl-layer>`,
  styles: [
  ]
})
export class VectorLayerComponent implements OnInit {
  // Take the source,
  // Setup the layers based on styles.


  @Input() layer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: "symbol" | "fill" | "line" | "circle" | "heatmap" | "fill-extrusion" | "raster" | "hillshade" | "background";
  url!: string;
  color?: string;
  width?: number;
  lineJoin?: "round" | "bevel" | "miter";
  lineCap?: "round" | "butt" | "square";
  //TODO: add more variable support.
  before?: string;

  constructor() { }

  ngOnInit(): void {
    this.title = this.layer.title;
    this.id = this.layer.id;
    this.url = this.layer.url[0];
    this.color = this.layer.style?.color || "cyan";
    this.width = this.layer.style?.width || 5;
    this.lineJoin = this.layer.layout?.lineJoin || "round";
    this.lineCap = this.layer.layout?.lineCap || "round";
    this.before = this.layer.placed_before;

    this.setLayoutAndPaintProperties();
  }

  setLayoutAndPaintProperties() {
    // Common properties
    // switch (this.type) {
    //   case 'line':
    //     this.layout = this.layer.layout || { 'line-join': 'round', 'line-cap': 'round' };
    //     this.paint = this.layer.style || { 'line-color': 'blue', 'line-width': 2 };
    //     break;
    //   case 'fill':
    //     this.layout = this.layer.layout || {};
    //     this.paint = this.layer.style || { 'fill-color': 'red', 'fill-opacity': 0.6 };
    //     break;
    //   case 'circle':
    //     this.layout = this.layer.layout || {};
    //     this.paint = this.layer.style || { 'circle-radius': 5, 'circle-color': 'yellow' };
    //     break;
    //   case 'fill-extrusion':
    //     this.layout = this.layer.layout || {};
    //     this.paint = this.layer.style || { 'fill-extrusion-color': 'gray', 'fill-extrusion-height': 20 };
    //     break;
    //   // Add more cases for other types as needed
    // }
  }

}
