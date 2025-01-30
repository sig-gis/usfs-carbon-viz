import { Component, inject, Input, OnInit } from '@angular/core';
import { OpacityState } from 'maplibre-gl';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { ConfigLayer } from 'src/app/service/layers.interface';
import { MapStoreComponent } from '../map-store/map-store.component';

@Component({
  selector: 'app-map-store-list',
  template: `
    <div class="card">
      <div class="card-body p-0">
        <img class="full-width-image" [src]="image" />
        <br />
        <div class="row p-2">
          <span class="map-store-title"> {{ title }} </span>
          <span> {{ source }} </span>
          <div class="col-6">
            <span>
              <i class="las la-map-marker"></i> &nbsp;
              <i class="las la-map-marked"></i>
            </span>
          </div>
          <div class="col-6">
            <button (click)=addLayer() class="btn btn-danger btn-sm btn-right">
              <i class="las la-plus-square"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>`,
  styles: [
  ]
})
export class MapStoreListComponent implements OnInit {

  configService = inject(AppconfigService);
  mapStore = inject(MapStoreComponent);

  @Input() catalog!: any;

  id!: string;
  title!: string;
  image!: string;
  source!: string;

  constructor() { }

  ngOnInit(): void {
    this.id = this.catalog.id;
    this.title = this.catalog.title;
    this.image = this.catalog.image;
    this.source = this.catalog.source;
  }

  addLayer() {
    let layer: ConfigLayer;

    layer = {
      title: this.catalog.title,
      id: this.catalog.id,
      description: this.catalog.description,
      visible: true,
      type: this.catalog.type,
      group: this.catalog.group,
      url: this.catalog.url,
      legend: this.catalog.legend,
      opacity: 0.9
    }

    this.mapStore.addLayer(layer);

    //this.configService.addLayer(layer);
  }

}
