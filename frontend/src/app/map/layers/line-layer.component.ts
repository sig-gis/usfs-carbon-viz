import { Component, Input, OnInit } from '@angular/core';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-line-layer',
  template: `
  <mgl-geojson-source
    [id]="id"
    [data]="url">
  </mgl-geojson-source>

  <mgl-layer
    [id]="id"
    type="line"
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
export class LineLayerComponent implements OnInit {

  @Input() layer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: string;
  url!: string;
  color?: string;
  width?: number;
  lineJoin?: "round" | "bevel" | "miter";
  lineCap?: "round" | "butt" | "square";
  //TODO: add more variable support.
  before?: string;

  constructor() { }

  ngOnInit(): void {
    console.log("WMS init");

    this.title = this.layer.title;
    this.id = this.layer.id;
    this.url = this.layer.url[0];
    this.color = this.layer.style?.color || "cyan";
    this.width = this.layer.style?.width || 5;
    this.lineJoin = this.layer.layout?.lineJoin || "round";
    this.lineCap = this.layer.layout?.lineCap || "round";
    this.before = this.layer.placed_before;
  }

  ngAfterViewInit() {

  }

}
