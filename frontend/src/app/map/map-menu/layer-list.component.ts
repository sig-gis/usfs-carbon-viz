import { Component, inject, Input, OnInit } from '@angular/core';
import { AppconfigService } from 'src/app/service/appconfig.service';

import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-layer-list',
  template: `
    <div class="form-check form-switch mb-2">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="{{ title }}"
        [checked]="visible"
        (change)="visToggle()"
      />
      <div class="row">
        <div class="col-10">
          <label class="layer-title form-check-label mb-0">
            {{ title }}
          </label>
          <div class="form-text mt-0" style="font-size: 10px">
            {{ desc }}
          </div>
        </div>
        
        <div class="col-2">
          <i class="las la-times-circle" (click)="removeLayer()" title="Remove Layer"></i>
        </div>
      </div>
      <br />
    </div>`,
  styles: [
  ]
})
export class LayerListComponent implements OnInit {

  @Input() layer!: ConfigLayer;

  configService = inject(AppconfigService);

  constructor() { }

  sliderVisible = false;

  id!: string;
  title!: string;
  desc!: string;
  visible!: boolean;
  opacity!: number;
  visibilityCount: number;

  ngOnInit(): void {
    this.id = this.layer.id;
    this.title = this.layer.title;
    this.desc = this.layer.description;
    this.visible = this.layer.visible;
    this.opacity = this.layer.opacity;

    // console.log(this.configService, "THIS configService");
  }

  visToggle() {
    const id = this.id;
    this.configService.updateVisible(id);
    // console.log(this.sliderVisible, "Slider Visibility 1");
  }

  checkVisibility() {

  }

  removeLayer() {
    const id = this.id;
    this.configService.removeLayerById(id);
  }

  toggleSlider() {
    this.sliderVisible = !this.sliderVisible;
    // console.log(this.sliderVisible, "Slider Visibility 2");
  }

  onSliderChange() {
    this.configService.changeOpacity(this.id, this.opacity);
    // console.log(this.sliderVisible, "Slider Visibility 3");
  }


}
