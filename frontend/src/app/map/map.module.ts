import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MapComponent } from './map.component';
import { MapMenuComponent } from './map-menu/map-menu.component';
import { MapViewComponent } from './map-view/map-view.component';
import { MapStoreComponent } from './map-store/map-store.component';
import { WmsLayerComponent } from './layers/wms-layer.component';
import { LineLayerComponent } from './layers/line-layer.component';
import { PointLayerComponent } from './layers/point-layer.component';
import { LayerListComponent } from './map-menu/layer-list.component';
import { LegendListComponent } from './map-context/legend/legend-list.component';
import { MapStoreListComponent } from './map-store/map-store-list.component';
import { BasemapControlComponent } from './basemap-control/basemap-control.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModulePajakComponent } from './module-pajak/module-pajak.component';
import { AnalisisPajakComponent } from './module-pajak/analisis-pajak/analisis-pajak.component';
import { HighlightLayerComponent } from './layers/highlight-layer.component';
import { ModuleTataruangComponent } from './module-tataruang/module-tataruang.component';
import { AnalisisTataruangComponent } from './module-tataruang/analisis-tataruang/analisis-tataruang.component';
import { ModulePerizinanComponent } from './module-perizinan/module-perizinan.component';
import { PerizinanListComponent } from './module-perizinan/perizinan-list.component';
import { AnalisisPerizinanComponent } from './module-perizinan/analisis-perizinan/analisis-perizinan.component';
import { MapContextComponent } from './map-context/map-context.component';
import { VectorLayerComponent } from './layers/vector-layer.component';
import { ModuleNavigasiComponent } from './module-navigasi/module-navigasi.component';

@NgModule({
  declarations: [
    MapComponent,
    MapViewComponent,
    MapStoreComponent,
    WmsLayerComponent,
    LineLayerComponent,
    PointLayerComponent,
    VectorLayerComponent,
    MapMenuComponent,
    LayerListComponent,
    LegendListComponent,
    MapStoreListComponent,
    BasemapControlComponent,
    ModulePajakComponent,
    AnalisisPajakComponent,
    HighlightLayerComponent,
    ModuleTataruangComponent,
    AnalisisTataruangComponent,
    ModulePerizinanComponent,
    PerizinanListComponent,
    AnalisisPerizinanComponent,
    MapContextComponent,
    ModuleNavigasiComponent,
  ],
  imports: [
    CommonModule,
    NgxMapLibreGLModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DragDropModule,
    //MapComponent
  ]
})
export class MapModule { }
