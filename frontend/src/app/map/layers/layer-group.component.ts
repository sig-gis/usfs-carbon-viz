import { Component, Input, OnInit } from '@angular/core';
import { ConfigLayer } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-layer-group',
  template: `
    <ng-container *ngIf="layer.groupLayers">
      <ng-container *ngFor="let groupLayer of layer.groupLayers">
        <ng-container [ngSwitch]="groupLayer.type">
          <ng-container *ngSwitchCase="'wms'">
            <app-wms-layer [layer]="prepareGroupLayer(groupLayer)">
            </app-wms-layer>
          </ng-container>

          <ng-container *ngSwitchCase="'line'">
            <app-line-layer [layer]="prepareGroupLayer(groupLayer)">
            </app-line-layer>
          </ng-container>

          <ng-container *ngSwitchCase="'point'">
            <app-point-layer [layer]="prepareGroupLayer(groupLayer)">
            </app-point-layer>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  styles: [
  ]
})
export class LayerGroupComponent implements OnInit {

  @Input() layer!: ConfigLayer;

  constructor() { }

  ngOnInit(): void {
    console.log("Layer Group Init " + this.layer);
  }

  prepareGroupLayer(groupLayer: ConfigLayer): ConfigLayer {
    return {
      ...groupLayer,
      visible: this.layer.visible && groupLayer.id === this.layer.activeLayerId
    };
  }

}
