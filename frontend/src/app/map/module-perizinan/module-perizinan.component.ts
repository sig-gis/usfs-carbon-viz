import { Component, Input, NgZone, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { Map } from 'maplibre-gl';
import { Subject, takeUntil } from 'rxjs';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { Analysis, AppConfig, ConfigLayer } from 'src/app/service/layers.interface';
import { MapServiceService } from 'src/app/service/map-service/map-service.service';

@Component({
  selector: 'app-module-perizinan',
  templateUrl: './module-perizinan.component.html',
  styles: [
  ]
})
export class ModulePerizinanComponent implements OnInit {

  @Input() config!: AppConfig;
  @Output() changeLegend = new EventEmitter<string>();

  gisService = inject(MapServiceService);
  ngZone = inject(NgZone);
  configService = inject(AppconfigService);

  selectedCard: string | null = null;
  mapInterface!: Map | undefined;

  geoJsonData: any;
  highlightLayer: ConfigLayer;
  outputAnalisis: Analysis;

  private destroy$ = new Subject<void>();

  listIzin: any;

  constructor() { }

  ngOnInit(): void {
    this.mapInterface = this.config.mapInterface?.map;

    this.listIzin = [
      {
        nop: "327319000210420907",
        NIB: 0o2067,
        noOSS: 41239,
        createDate: 123,
        updateDate: 123,
        source: "Sistem OSS",
        pengajuanIzin: "",
        img: "/assets/images/perizinan/Izin1.png",
        photo1: "/assets/images/perizinan/Izin1_1.png",
        photo2: "/assets/images/perizinan/Izin1_2.png",
      },
      {
        nop: "327317000310221607",
        NIB: 0o2067,
        noOSS: 41240,
        createDate: 123,
        updateDate: 123,
        source: "Sistem OSS",
        pengajuanIzin: "",
        img: "/assets/images/perizinan/Izin2.png",
        photo1: "/assets/images/perizinan/Izin2_1.png",
        photo2: "/assets/images/perizinan/Izin2_2.png",
      },
      {
        nop: "327307000310421447",
        NIB: 0o2067,
        noOSS: 41241,
        createDate: 123,
        updateDate: 123,
        source: "Sistem OSS",
        pengajuanIzin: "",
        img: "/assets/images/perizinan/Izin3.png",
        photo1: "/assets/images/perizinan/Izin3_1.png",
        photo2: "/assets/images/perizinan/Izin3_2.png",
      },
      {
        nop: "327315000610721157",
        NIB: 0o2067,
        noOSS: 41242,
        createDate: 123,
        updateDate: 123,
        source: "Sistem OSS",
        pengajuanIzin: "",
        img: "/assets/images/perizinan/Izin4.png",
        photo1: "/assets/images/perizinan/Izin4_1.png",
        photo2: "/assets/images/perizinan/Izin4_2.png",
      },
      {
        nop: "327321000510422347",
        NIB: 0o2062,
        noOSS: 41242,
        createDate: 123,
        updateDate: 123,
        source: "Sistem OSS",
        pengajuanIzin: "",
        img: "/assets/images/perizinan/Izin5.png",
        photo1: "/assets/images/perizinan/Izin5_1.png",
        photo2: "/assets/images/perizinan/Izin5_2.png",
      },
    ]
  }

  changeCurrentLegend(newLegend: string) {
    this.changeLegend.emit(newLegend);
  }

  selectCard(izin: any): void {
    //GET MORE DATA FROM HERE
    // console.log(izin);
    this.selectedCard = izin.nop;
    (this.selectCard);
    this.getbynop(izin)
  }

  getbynop(izin: any) {
    const url: string = "http://38.47.70.195:7000/get_persil_nop";
    this.gisService.identifyNOP(izin.nop, url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((geoJsonData: any) => {
        this.ngZone.run(() => {
          if (geoJsonData && geoJsonData.properties) {
            console.log(geoJsonData);
            this.geoJsonData = {
              output: {
                type: "perizinan",
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
                photo1: izin.photo1,
                photo2: izin.photo2,
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
}
