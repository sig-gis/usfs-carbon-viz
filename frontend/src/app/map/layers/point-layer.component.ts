import { Component, Input, OnInit } from '@angular/core';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-point-layer',
  template: `
  <mgl-geojson-source
    [id]="id"
    [data]="url">
  </mgl-geojson-source>

  <mgl-layer
    [id]="id"
    [source]="id"
    type="symbol"
    [layout]="{
      'icon-image': ['get', 'icon'],
      'icon-allow-overlap': iconAllowOverlap
    }"
  >
  </mgl-layer>`,

  styles: [
  ]
})
export class PointLayerComponent implements OnInit {

  @Input() layer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: string;
  url!: string;
  color?: string;
  iconImage?: string[];
  iconAllowOverlap?: boolean;
  before?: string;

  constructor() { }

  ngOnInit(): void {
    this.title = this.layer.title;
    this.id = this.layer.id;
    this.url = this.layer.url[0];
    this.color = this.layer.style?.color || "cyan";
    this.iconImage = ['get', 'icon'];
    //TODO: PUT IT IN CONFIG
    this.iconAllowOverlap = this.layer.layout?.iconAllowOverlap || true;
    this.before = this.layer.placed_before;
  }

  ngAfterViewInit() {

  }

}
