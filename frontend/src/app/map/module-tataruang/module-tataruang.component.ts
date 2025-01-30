import { Component, EventEmitter, Input, NgZone, OnInit, Output, inject } from '@angular/core';
import { Map, MapMouseEvent } from 'maplibre-gl';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { AppConfig, ConfigLayer } from 'src/app/service/layers.interface';
import { MapServiceService } from 'src/app/service/map-service/map-service.service';

@Component({
  selector: 'app-module-tataruang',
  templateUrl: './module-tataruang.component.html',
  styles: [
  ]
})
export class ModuleTataruangComponent implements OnInit {

  @Input() config!: AppConfig;
  @Output() changeLegend = new EventEmitter<string>();

  gisService = inject(MapServiceService)
  configService = inject(AppconfigService)

  clickMapActive: boolean = true;
  mapInterface!: Map | undefined;
  boundHandleClick: any;

  geoJsonData: any;
  highlightLayer: ConfigLayer;

  constructor(private ngZone: NgZone) {
    this.boundHandleClick = this.handleClick.bind(this)
  }

  ngOnInit(): void {
    this.mapInterface = this.config.mapInterface?.map;

    if (this.mapInterface) {
      this.mapInterface.on('click', this.boundHandleClick);
      this.mapInterface.getCanvas().style.cursor = 'pointer';
    }
    this.mapInterface?.fitBounds
  }

  ngOnDestroy(): void {
    // console.log("DESTROYED")
    if (this.mapInterface) {
      this.mapInterface.off('click', this.boundHandleClick);
      this.mapInterface.getCanvas().style.cursor = '';
    }
  }

  private handleClick(evt: MapMouseEvent): void {
    if (this.clickMapActive) {
      this.identifyModuleTataruang(evt);
    }
  }

  changeCurrentLegend(newLegend: string) {
    this.changeLegend.emit(newLegend);
  }

  toggleIdentify(): void {
    this.clickMapActive = !this.clickMapActive;

    if (this.clickMapActive && this.mapInterface) {
      // Set the cursor to a pointer when identify is active
      this.mapInterface.getCanvas().style.cursor = 'pointer';
    } else if (this.mapInterface) {
      // Restore the default cursor when identify is not active
      this.mapInterface.getCanvas().style.cursor = '';
    }
  }

  identifyModuleTataruang(evt: MapMouseEvent): void {
    const url: string = "http://38.47.70.195:7000/get_validate_itbx_xy";
    this.gisService.identifyXY(evt, url).subscribe((geoJsonData: any) => {
      this.ngZone.run(() => {
        if (geoJsonData && geoJsonData.properties) {
          this.geoJsonData = {
            output: {
              type: 'tataruang',
              id: geoJsonData.properties.id,
              landuse: geoJsonData.properties.landuse,
              namaobj: geoJsonData.properties.namaobj,
              fcode_polaruang: geoJsonData.properties.fcode_polaruang,
              polaruang: geoJsonData.properties.polaruang,
              kategori: geoJsonData.properties.kategori,
              rules_from_itbx: geoJsonData.properties.rules_from_itbx,
              lat: evt.lngLat.lat,
              lon: evt.lngLat.lng,
            }
          };

          console.log(geoJsonData)

          this.highlightLayer = {
            title: "Layer Terpilih",
            id: "highlightLayer",
            description: "Layer Highlight",
            visible: true,
            type: "highlightLayer",
            url: geoJsonData,
            opacity: 0.9,
            style: {
              color: geoJsonData.properties.color
            }
          }
          this.configService.addHighlight(this.highlightLayer);
          this.configService.updateAnalysis(this.geoJsonData);
          this.changeCurrentLegend('Analisis');
        } else {
          this.geoJsonData = null;
          this.configService.addHighlight(this.geoJsonData);
          this.configService.updateAnalysis(this.geoJsonData);
        }
      })
    })
  }

}
