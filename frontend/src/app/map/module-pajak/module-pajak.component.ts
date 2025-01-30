import { Component, Input, NgZone, OnInit, inject, Pipe, Output, EventEmitter } from '@angular/core';
import { LngLatBounds, LngLatBoundsLike, Map, MapMouseEvent } from 'maplibre-gl';
import { AppConfig, Analysis, ConfigLayer } from 'src/app/service/layers.interface';
import { MapServiceService } from 'src/app/service/map-service/map-service.service';
import { NumberSuffixPipe } from './numberSuffix.pipe';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { Subject, takeUntil } from 'rxjs';

import { EarthEngineService } from 'src/app/service/ee/ee.service';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-module-pajak',
  templateUrl: './module-pajak.component.html',
  styles: [
  ]
})
export class ModulePajakComponent implements OnInit {

  @Input() config!: AppConfig;
  @Output() changeLegend = new EventEmitter<string>();


  gisService = inject(MapServiceService);
  configService = inject(AppconfigService);
  eeService = inject(EarthEngineService);
  ngZone = inject(NgZone);
  numberSuffixPipe = inject(NumberSuffixPipe);

  private destroy$ = new Subject<void>();

  identifyActive: boolean = true;
  mapInterface!: Map | undefined;
  nopValue: string;
  boundHandleClick: any;
  draw!: MapboxDraw;

  pajakTotal: number = 5123450000000;
  pajakTerhutang: number = 21500000;
  pajakTerbayar: number = 3120000000;

  geoJsonData: any;
  highlightLayer: ConfigLayer;

  outputAnalisis: Analysis;
  constructor() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  ngOnInit(): void {
    this.mapInterface = this.config.mapInterface?.map;

    if (this.mapInterface) {
      this.mapInterface.on('click', this.boundHandleClick);
      this.mapInterface.getCanvas().style.cursor = 'pointer';
    }

    this.pajakTotal = this.numberSuffixPipe.transform(this.pajakTotal, 2);
    this.pajakTerbayar = this.numberSuffixPipe.transform(this.pajakTerbayar, 2);
    this.pajakTerhutang = this.numberSuffixPipe.transform(this.pajakTerhutang, 2);
  }

  ngOnDestroy(): void {
    if (this.mapInterface) {
      this.mapInterface.off('click', this.boundHandleClick);
      this.mapInterface.getCanvas().style.cursor = '';
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleClick(evt: MapMouseEvent): void {
    if (this.identifyActive) {
      this.identifyModulePajak(evt);
    }
  }

  changeCurrentLegend(newLegend: string) {
    this.changeLegend.emit(newLegend);
  }

  drawArea(): void {
    // if (this.draw) {
    //   this.draw.changeMode('draw_polygon');
    //   console.log("Draw Area");
    // }
  }

  handleFormSubmit() {
    this.getbynop(this.nopValue);
  }

  getbynop(nop: string) {
    // GET VALUE OF NOP
    // LOAD GEOSJON AND PROPERTIES TO ANALYSIS AND HIGHLIGHT
    // ZOOM IN TO THE GEOJSON FEATURES
    const url: string = "http://38.47.70.195:7000/get_persil_nop";
    this.gisService.identifyNOP(nop, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((geoJsonData: any) => {
        this.ngZone.run(() => {
          if (geoJsonData && geoJsonData.properties) {
            this.geoJsonData = {
              output: {
                type: "pajak",
                id: geoJsonData.properties.id,
                nop: geoJsonData.properties.nop,
                nib: geoJsonData.properties.nib,
                penggunaan: geoJsonData.properties.penggunaan,
                tipeHak: geoJsonData.properties.tipeHak,
                kodeProduk: geoJsonData.properties.kodeProduk,
                tahun: geoJsonData.properties.tahun,
                luas: geoJsonData.properties.luas,
                namaPemilik: geoJsonData.properties.namaPemilik,
                blok: geoJsonData.properties.blok,
                znt: geoJsonData.properties.znt,
                pbb: geoJsonData.properties.pbb,
                nilaiPajak: geoJsonData.properties.nilaiPajak,
                nomorblok: 0,
                statusBayar: geoJsonData.properties.statusBayar,
                kodeProv: geoJsonData.properties.kodeProv,
                kodeKabKot: geoJsonData.properties.kodeKabKot,
                kodeKec: geoJsonData.properties.kodeKec,
                kodeKel: geoJsonData.properties.kodeKel,
                Prov: geoJsonData.properties.Prov,
                KabKot: geoJsonData.properties.KabKot,
                Kec: geoJsonData.properties.Kec,
                Kel: geoJsonData.properties.Kel,
              }
            };
            this.highlightLayer = {
              title: "Layer Terpilih",
              id: "highlightLayer",
              description: "Layer Highlight",
              visible: true,
              type: "highlightLayer",
              url: geoJsonData,
              opacity: 0.9
            }
            this.configService.addHighlight(this.highlightLayer);
            this.configService.updateAnalysis(this.geoJsonData);
            this.gisService.zoomtogeojson(geoJsonData, this.mapInterface);
            this.changeCurrentLegend('Analisis');

          } else {
            this.geoJsonData = null;
            this.configService.addHighlight(this.geoJsonData);
            this.configService.updateAnalysis(this.geoJsonData);
          }
        })
      })
  }

  toggleIdentify(): void {
    this.identifyActive = !this.identifyActive;

    if (this.identifyActive && this.mapInterface) {
      // Set the cursor to a pointer when identify is active
      this.mapInterface.getCanvas().style.cursor = 'pointer';
    } else if (this.mapInterface) {
      // Restore the default cursor when identify is not active
      this.mapInterface.getCanvas().style.cursor = '';
    }
  }

  identifyModulePajak(evt: MapMouseEvent): void {
    const url: string = "http://38.47.70.195:7000/get_features_xy";
    this.gisService.identifyXY(evt, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((geoJsonData: any) => {
        this.ngZone.run(() => {
          if (geoJsonData && geoJsonData.properties) {
            this.geoJsonData = {
              output: {
                type: "pajak",
                id: geoJsonData.properties.id,
                nop: geoJsonData.properties.nop,
                nib: geoJsonData.properties.nib,
                penggunaan: geoJsonData.properties.penggunaan,
                tipeHak: geoJsonData.properties.tipeHak,
                kodeProduk: geoJsonData.properties.kodeProduk,
                tahun: geoJsonData.properties.tahun,
                luas: geoJsonData.properties.luas,
                namaPemilik: geoJsonData.properties.namaPemilik,
                blok: geoJsonData.properties.blok,
                znt: geoJsonData.properties.znt,
                pbb: geoJsonData.properties.pbb,
                nilaiPajak: geoJsonData.properties.nilaiPajak,
                nomorblok: 0,
                statusBayar: geoJsonData.properties.statusBayar,
                kodeProv: geoJsonData.properties.kodeProv,
                kodeKabKot: geoJsonData.properties.kodeKabKot,
                kodeKec: geoJsonData.properties.kodeKec,
                kodeKel: geoJsonData.properties.kodeKel,
                Prov: geoJsonData.properties.Prov,
                KabKot: geoJsonData.properties.KabKot,
                Kec: geoJsonData.properties.Kec,
                Kel: geoJsonData.properties.Kel,
                lat: evt.lngLat.lat,
                lon: evt.lngLat.lng,
              }
            };
            this.highlightLayer = {
              title: "Layer Terpilih",
              id: "highlightLayer",
              description: "Layer Highlight",
              visible: true,
              type: "highlightLayer",
              url: geoJsonData,
              opacity: 0.9
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
      });
  }

  getBoundStat(): void {
    const url: string = "http://38.47.70.195:7000/get_features_by_bbox"
    const bbox: LngLatBounds | undefined = this.mapInterface?.getBounds();
    this.gisService.calcStatformBBOX(bbox, url).then((data: any) => {
      // console.log(data)
      this.pajakTotal = this.numberSuffixPipe.transform(data.total_pbb, 2);
      this.pajakTerbayar = this.numberSuffixPipe.transform(data.sum_pbb_true, 2);
      this.pajakTerhutang = this.numberSuffixPipe.transform(data.sum_pbb_false, 2);
    })
      .catch((error: any) => {
        console.error('Error:', error);
      });
  }

  identifyModulePajakWMS(evt: MapMouseEvent): void {
    // console.log('Map clicked:', evt.lngLat);
    const url: string = "";
  }

  calculateZonalStatistics(): void {
    const assetId = 'USFS/GTAC/TreeMap/v2016/TreeMap2016';
    const band = 'ALSTK';
    const region = ee.Geometry.Polygon([[
      [-124.566244, 42.000325],
      [-124.566244, 46.292035],
      [-116.463262, 46.292035],
      [-116.463262, 42.000325],
      [-124.566244, 42.000325]
    ]]);

    this.eeService.calculateZonalStatistics(assetId, band, region).subscribe({
      next: (result) => {
        console.log('Zonal statistics result:', result);
      },
      error: (error) => {
        console.error('Error calculating zonal statistics:', error);
      }
    });
  }

}
