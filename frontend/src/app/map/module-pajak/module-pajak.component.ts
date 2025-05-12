import { Component, Input, NgZone, OnInit, inject, Pipe, Output, EventEmitter } from '@angular/core';
import { LngLatBounds, Map, MapMouseEvent } from 'maplibre-gl';
import { AppConfig, Analysis, ConfigLayer, ZonalResult } from 'src/app/service/layers.interface';
import { MapServiceService } from 'src/app/service/map-service/map-service.service';
import { NumberSuffixPipe } from './numberSuffix.pipe';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { EarthEngineService } from 'src/app/service/ee/ee.service';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as toGeoJSON from '@tmcw/togeojson';
import { Geometry } from 'geojson';
import shp from 'shpjs';
import { staticConfig } from 'src/app/service/static-config';

@Component({
  selector: 'app-module-pajak',
  templateUrl: './module-pajak.component.html',
  styles: []
})
export class ModulePajakComponent implements OnInit {
  @Input() config!: AppConfig;
  @Output() changeLegend = new EventEmitter<string>();

  selectedGeometryAreaHa: number | null = null;
  private configSub!: Subscription;

  gisService = inject(MapServiceService);
  configService = inject(AppconfigService);
  eeService = inject(EarthEngineService);
  ngZone = inject(NgZone);
  numberSuffixPipe = inject(NumberSuffixPipe);

  private destroy$ = new Subject<void>();

  identifyActive = true;
  mapInterface?: Map;
  nopValue!: string;
  boundHandleClick: any;
  draw?: MapboxDraw;
  eeLayers = staticConfig.layers;

  pajakTotal = 5123450000000;
  pajakTerhutang = 21500000;
  pajakTerbayar = 3120000000;

  geoJsonData: any;
  highlightLayer!: ConfigLayer;
  outputAnalisis!: Analysis;

  private readonly uploadSourceId = 'uploaded-geojson';
  private readonly uploadFillLayerId = 'uploaded-fill';
  private readonly uploadLineLayerId = 'uploaded-outline';
  public zonalResults: { id: string, title: string, description: string, min: number | string, max: number | string, avg: number | string, pixelval: number | string, assetId: string, band: string }[] = [];
  drawAreaHa = 0;
  regionGeometry: any;
  selectedGeometry: Geometry | null = null;
  drawModeActive = false;
  adminModeActive = false;
  uploadModeActive = false;
  drawPointActive = false;
  drawPolygonActive = false;
  analysisButtonActive = true;
  clickedPoint: { lng: number; lat: number } | null = null;
  uploadedFileName: string | null = null;

  constructor() {
    this.boundHandleClick = this.handleClick.bind(this);
  }

  ngOnInit(): void {
    this.mapInterface = this.config.mapInterface?.map;
    const draw = this.configService.getDrawControl();

    if (!draw) {
      console.error('Draw control is not initialized.');
      return;
    }
    // draw a point or polygon
    this.draw = draw;
    if (this.mapInterface) {
      this.mapInterface.on('draw.create', (e) => {
        if (!this.draw) return;
        this.draw.deleteAll();
        const feature = e.features[0];
        if (feature) {
          this.draw.add(feature);

          // Reset cursor
          if (this.mapInterface) {
            this.mapInterface.getCanvas().style.cursor = '';
          }

          const geometry = feature.geometry;
          if (geometry.type === 'Point') {
            const [lng, lat] = geometry.coordinates;
            this.clickedPoint = { lng, lat }; // Add this.clickedPoint as a property in your class
            this.configService.updateSelectedGeometryWithArea(geometry);
            console.log('Clicked Point:', this.clickedPoint);
          } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            this.configService.updateSelectedGeometryWithArea(geometry);
          }
        }
        this.drawPointActive = false;
        this.drawPolygonActive = false;
        this.drawModeActive = true;
      });
    }

    // if geom is changed, update the area
    this.configService.config$
      .pipe(
        map((config) => ({
          area: config.selectedGeometryAreaHa ?? null,
          geom: config.selectedGeometry ?? null
        })),
        distinctUntilChanged((a, b) => a.area === b.area && JSON.stringify(a.geom) === JSON.stringify(b.geom)),
        takeUntil(this.destroy$)
      )
      .subscribe(({ area, geom }) => {
        this.selectedGeometryAreaHa = area;
        this.selectedGeometry = geom;
        if ((area && geom)) {
          this.analysisButtonActive = true;
        }
      });

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
    if (this.configSub) this.configSub.unsubscribe();
  }

  private handleClick(evt: MapMouseEvent): void {
    if (this.identifyActive) {
      this.identifyModulePajak(evt);
    }
  }

  changeCurrentLegend(newLegend: string) {
    this.changeLegend.emit(newLegend);
  }

  handleFormSubmit() {
    // this.getbynop(this.nopValue);
    this.runZonalOrPixelAnalysis();
  }

  getbynop(nop: string) {
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
            if (this.mapInterface) {
              this.gisService.zoomtogeojson(geoJsonData, this.mapInterface);
            }
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

    if (this.mapInterface) {
      this.mapInterface.getCanvas().style.cursor = this.identifyActive ? 'pointer' : '';
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
    if (bbox) {
      this.gisService.calcStatformBBOX(bbox, url).then((data: any) => {
        this.pajakTotal = this.numberSuffixPipe.transform(data.total_pbb, 2);
        this.pajakTerbayar = this.numberSuffixPipe.transform(data.sum_pbb_true, 2);
        this.pajakTerhutang = this.numberSuffixPipe.transform(data.sum_pbb_false, 2);
      })
        .catch((error: any) => {
          console.error('Error:', error);
        });
    }
  }

  identifyModulePajakWMS(evt: MapMouseEvent): void {
    // console.log('Map clicked:', evt.lngLat);
    const url: string = "";
  }

  getLayerUrlById(layers: any[], id: string): string | null {
    for (const layer of layers) {
      if (layer.id === id && layer.url?.length > 0) {
        return layer.url[0]; // return first URL
      }
      if (layer.type === 'layerGroup' && Array.isArray(layer.groupLayers)) {
        const found = layer.groupLayers.find((subLayer: any) => subLayer.id === id);
        if (found && found.url?.length > 0) {
          return found.url[0];
        }
      }
    }
    return null;
  }

  runZonalOrPixelAnalysis(): void {
    const visibleLayers = this.configService.getVisibleLayersWithBands();
    const results: ZonalResult[] = [];
    let completed = 0;
    const total = visibleLayers.length;

    let region: any;
    let mode: 'polygon' | 'point';

    // Detect geometry type
    if (this.selectedGeometry?.type === 'Point') {
      mode = 'point';
      const coords = (this.selectedGeometry.coordinates as [number, number]);
      region = ee.Geometry.Point(coords);
    } else if (
      this.selectedGeometry &&
      (this.selectedGeometry.type === 'Polygon' || this.selectedGeometry.type === 'MultiPolygon')
    ) {
      mode = 'polygon';
      region = ee.Geometry(this.selectedGeometry);
    } else {
      console.warn('Invalid or missing geometry for analysis.');
      return;
    }

    visibleLayers.forEach((layer: any) => {
      const assetId = this.getLayerUrlById(this.eeLayers, layer.id);
      if (!assetId) return;
      const band = layer.bands[0];

      const service$ =
        mode === 'polygon'
          ? this.eeService.calculateZonalStatistics(assetId, band, region)
          : this.eeService.getPixelValueAtPoint(assetId, band, region);

      service$.subscribe({
        next: (res) => {
          if (mode === 'polygon') {
            const stats = res.stats;
            results.push({
              id: layer.id,
              title: layer.title || 'UNDIFINED',
              description: layer.description || 'UNDIFINED',
              min: stats['min'] !== null && stats['min'] !== undefined ? Number(stats['min'].toFixed(2)) : 'masked',
              max: stats['max'] !== null && stats['max'] !== undefined ? Number(stats['max'].toFixed(2)) : 'masked',
              avg: stats['mean'] !== null && stats['mean'] !== undefined ? Number(stats['mean'].toFixed(2)) : 'masked',
              pixelval: 0,
              assetId: assetId,
              band: band
            });
          } else {
            const val = res?.[band];
            results.push({
              id: layer.id,
              title: layer.title || 'UNDIFINED',
              description: layer.description || 'UNDIFINED',
              min: 0,
              max: 0,
              avg: 0,
              pixelval: val !== null && val !== undefined ? Number(val.toFixed(2)) : 'masked',
              assetId: assetId,
              band: band
            });
          }

          completed++;
          if (completed === total) {
            this.configService.updateZonalResults(results);
          }
        },
        error: (err) => {
          console.error(`Failed to get stats for ${layer.id}`, err);
          completed++;
          if (completed === total) {
            this.configService.updateZonalResults(results);
          }
        }
      });
    });
  }

  private removeUploadFeatures(): void {
    if (!this.mapInterface) return;

    if (this.mapInterface.getLayer(this.uploadFillLayerId)) {
      this.mapInterface.removeLayer(this.uploadFillLayerId);
    }
    if (this.mapInterface.getLayer(this.uploadLineLayerId)) {
      this.mapInterface.removeLayer(this.uploadLineLayerId);
    }
    if (this.mapInterface.getSource(this.uploadSourceId)) {
      this.mapInterface.removeSource(this.uploadSourceId);
    }
  }

  private removeDrawFeatures(): void {
    if (!this.mapInterface || !this.draw) return;
    this.draw.deleteAll(); // Clear draw features
  }

  //  Move draw layers to the top after they're added
  private moveSelectedArea(): void {
    setTimeout(() => {
      const drawLayerIds = [
        "gl-draw-polygon-fill.cold",
        "gl-draw-polygon-stroke-active.cold",
        "gl-draw-polygon-stroke-inactive.cold",
        "gl-draw-line-inactive.cold",
        "gl-draw-line-active.cold",
        "gl-draw-point-point-stroke-inactive.cold",
        "gl-draw-point-point-stroke-active.cold",
        "gl-draw-polygon-fill.hot",
        "gl-draw-polygon-stroke-active.hot",
        "gl-draw-polygon-stroke-inactive.hot",
        "gl-draw-line-inactive.hot",
        "gl-draw-line-active.hot",
        "gl-draw-point-point-stroke-inactive.hot",
        "gl-draw-point-point-stroke-active.hot",
        'US_States',
      ];
      if (!this.mapInterface) return;
      for (const layerId of drawLayerIds) {
        if ((this.mapInterface as any).getLayer(layerId)) {
          (this.mapInterface as any).moveLayer(layerId);
        }
      }
    }, 100);
  }

  activateDrawMode(): void {
    this.moveSelectedArea();
    this.drawAreaHa = 0;
    this.selectedGeometry = null;
    this.configService.updateSelectedGeometryWithArea(null);
    this.configService.updateZonalResults(null);
    this.drawModeActive = !this.drawModeActive;
    this.clickedPoint = null;
    if (this.drawModeActive) {
      this.adminModeActive = false;
      this.uploadModeActive = false
      this.configService.updateAdminModeActive(false);
      // remove uploaded features when entering draw mode
      this.removeUploadFeatures();
    }
  }

  activateUploadMode(): void {
    this.moveSelectedArea();
    this.drawAreaHa = 0;
    this.selectedGeometry = null;
    this.configService.updateSelectedGeometryWithArea(null);
    this.configService.updateZonalResults(null);
    this.uploadModeActive = !this.uploadModeActive;
    if (this.uploadModeActive) {
      this.adminModeActive = false;
      this.drawModeActive = false;
      this.clickedPoint = null;
      this.configService.updateAdminModeActive(false);
    }
  }

  activateAdminMode(): void {
    this.moveSelectedArea();
    this.drawAreaHa = 0;
    this.selectedGeometry = null;
    this.adminModeActive = !this.adminModeActive;
    this.configService.updateSelectedGeometryWithArea(null);
    this.configService.updateAdminModeActive(this.adminModeActive);
    this.configService.updateZonalResults(null);
    if (this.adminModeActive) {
      this.drawModeActive = false;
      this.uploadModeActive = false;
      this.clickedPoint = null;
      // remove both uploaded and drawn features when entering admin mode
      this.removeUploadFeatures();
      this.removeDrawFeatures();
    }
  }

  startDraw(mode: 'point' | 'polygon'): void {
    if (!this.draw || !this.mapInterface) return;
    this.configService.updateZonalResults(null);
    this.drawModeActive = true;
    if (mode === 'point') {
      this.drawPointActive = true;
      this.drawPolygonActive = false;
    } else if (mode === 'polygon') {
      this.drawPointActive = false;
      this.drawPolygonActive = true;
      this.clickedPoint = null;
    }

    // Clear existing features
    const allFeatures = this.draw.getAll();
    if (allFeatures.features.length > 0) {
      this.draw.deleteAll();
    }

    // Activate drawing mode
    this.draw.changeMode(`draw_${mode}`);
    // Set cursor for drawing
    if (this.mapInterface) {
      this.mapInterface.getCanvas().style.cursor = 'crosshair';
    }
  }

  removeSelectedGeometry(): void {
    this.drawAreaHa = 0;
    this.selectedGeometry = null;
    this.drawModeActive = false;
    this.uploadModeActive = false;
    this.adminModeActive = false;
    this.clickedPoint = null;
    this.configService.updateAdminModeActive(false);
    this.removeUploadFeatures();
    this.removeDrawFeatures();
    this.configService.updateSelectedGeometryWithArea(null);
    this.configService.updateZonalResults(null);
  }


  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.uploadedFileName = file.name;

    // Handle ZIP (assumed to contain Shapefile)
    if (file.name.endsWith('.zip')) {
      this.handleShapefileUpload(file);
      return;
    }


    // Fallback for KML / GeoJSON
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;

      if (file.name.endsWith('.kml')) {
        const kmlDoc = new DOMParser().parseFromString(content, 'text/xml');
        const geojson = toGeoJSON.kml(kmlDoc);
        this.processGeoJSON(geojson);
      } else if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        const geojson = JSON.parse(content);
        this.processGeoJSON(geojson);
      } else {
        alert('Unsupported file type.');
      }
    };
    reader.readAsText(file);
  }

  async handleShapefileUpload(file: File): Promise<void> {
    try {
      // Check if it's a ZIP file
      if (!file.name.endsWith('.zip')) {
        throw new Error('Shapefile must be uploaded as a ZIP archive containing .shp, .dbf, etc.');
      }

      const buffer = await this.readFileAsArrayBuffer(file);
      const geojson = await shp(buffer); // shpjs can handle ZIP files directly
      this.processGeoJSON(geojson);
    } catch (error) {
      console.error('Error processing Shapefile:', error);
      alert(`Error processing Shapefile: ${error}`);
    }
  }

  readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  processGeoJSON(geojson: any): void {
    if (!geojson || !geojson.features || geojson.features.length === 0) {
      alert('No valid features found in file.');
      return;
    }

    const geometry: Geometry = geojson.features[0].geometry;
    this.selectedGeometry = geometry;
    console.log('Uploaded geometry:', geometry);
    this.configService.updateSelectedGeometryWithArea(geometry);

    // Add uploaded GeoJSON to the map
    if (this.mapInterface) {
      const sourceId = 'uploaded-geojson';

      if (this.mapInterface.getSource(sourceId)) {
        // Update existing source
        const source = this.mapInterface.getSource(sourceId) as any;
        source.setData(geojson);
      } else {
        // Add source and layer
        this.mapInterface.addSource(sourceId, {
          type: 'geojson',
          data: geojson
        });

        this.mapInterface.addLayer({
          id: 'uploaded-fill',
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#D20C0C',
            'fill-opacity': 0.1
          }
        });

        this.mapInterface.addLayer({
          id: 'uploaded-outline',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#D20C0C',
            'line-width': 2
          }
        });
      }

      // Zoom to geometry
      const bounds = new LngLatBounds();
      geojson.features.forEach((feature: any) => {
        const coords = feature.geometry.coordinates.flat(Infinity);
        for (let i = 0; i < coords.length; i += 2) {
          bounds.extend([coords[i], coords[i + 1]]);
        }
      });
      this.mapInterface.fitBounds(bounds, { padding: 20 });
    }
  }

  downloadGeoJSON(): void {
    if (!this.selectedGeometry) {
      console.warn('No geometry selected');
      return;
    }

    const feature = {
      type: 'Feature',
      geometry: this.selectedGeometry,
      properties: {}  // add properties if needed
    };

    const geojson = {
      type: 'FeatureCollection',
      features: [feature]
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'usfs-selected-geometry.geojson';
    a.click();

    URL.revokeObjectURL(url);
  }
}