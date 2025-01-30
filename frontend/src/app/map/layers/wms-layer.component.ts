import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-wms-layer',
  template: `
  <mgl-raster-source
    [id]="id"
    [tiles]="url"
    [tileSize]="256">
  </mgl-raster-source>
  <mgl-layer
    [id]="id"
    type="raster"
    [source]="id"
    [layout]="{
      'visibility': vis
    }"
    [paint]="{
      'raster-opacity': opacity
    }"
    [before]="before">
  </mgl-layer>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WmsLayerComponent implements OnInit {

  @Input() layer!: ConfigLayer;

  title!: string;
  id!: string;
  type!: string;
  vis!: "visible" | "none";
  opacity!: number;
  url!: string[];
  before?: string;

  constructor() { }

  ngOnInit(): void {
    console.log("WMS Layers Init " + this.layer.title);
    this.title = this.layer.title;
    this.id = this.layer.id;
    this.vis = this.layer.visible ? "visible" : "none";
    this.opacity = this.layer.opacity;
    this.url = this.layer.url;
    this.before = this.layer.placed_before;
  }

  ngAfterViewInit() { }

}
