import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { ConfigLayer, AppConfig } from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { LngLatBounds } from 'maplibre-gl';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-highlight-layer',
  template: `
    <!-- Load the full GeoJSON as source -->
    <mgl-geojson-source
      id="us-state-boundary"
      [data]="geojsonData"
    ></mgl-geojson-source>

    <!-- Default boundary lines -->
    <mgl-layer
      [id]="id + '-outline' "
      type="line"
      source="us-state-boundary"
      [paint]="{
        'line-color': color,
        'line-width': width
      }"
    ></mgl-layer>

    <!-- Transparent clickable layer -->
    <mgl-layer
      *ngIf="adminModeActive && selectedAdminLevel === 'state'"
      [id]="id + '-clickable'"
      type="fill"
      source="us-state-boundary"
      [paint]="{
        'fill-color': '#000000',
        'fill-opacity': 0
      }"
      (layerClick)="onLayerClick($event)"
    ></mgl-layer>

    <!-- Highlighted selected state -->
    <mgl-geojson-source
      *ngIf="selectedFeature && selectedAdminLevel === 'state'"
      id="selected-feature-source"
      [data]="selectedFeature"
    ></mgl-geojson-source>

    <mgl-layer
      *ngIf="selectedFeature && selectedAdminLevel === 'state'"
      id="selected-feature-fill"
      type="fill"
      source="selected-feature-source"
      [paint]="{
        'fill-color': '#FF0000',
        'fill-opacity': 0.2
      }"
    ></mgl-layer>

    <mgl-layer
      *ngIf="selectedFeature && selectedAdminLevel === 'state'"
      id="selected-feature-outline"
      type="line"
      source="selected-feature-source"
      [paint]="{
        'line-color': '#FF0000',
        'line-width': 2
      }"
    ></mgl-layer>

    <!-- Popup with info -->
    <mgl-popup
      *ngIf="popupCoords"
      [lngLat]="popupCoords"
      (close)="popupCoords = null"
    >
      <div>
        <strong>Properties:</strong>
        <pre>{{ popupFeature?.properties | json }}</pre>
        <button (click)="logGeometry()">Select this admin boundary</button>
      </div>
    </mgl-popup>
  `,
  styles: []
})
export class HighlightLayerComponent implements OnInit, OnChanges {
  @Input() highlightLayer!: ConfigLayer;
  @Input() adminModeActive = false;
  @Input() config!: AppConfig;
  @Input() selectedAdminLevel: string | null = null;

  title!: string;
  id!: string;
  url: any;
  sourceLayer?: string;
  color: string = 'cyan';
  width: number = 0.2;
  before?: string;

  popupCoords: [number, number] | null = null;
  popupFeature: Feature | null = null;
  selectedFeature: FeatureCollection | null = null;
  geojsonData: FeatureCollection | null = null;

  constructor(
    private configService: AppconfigService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.title = this.highlightLayer.title;
    this.id = this.highlightLayer.id;
    this.url = this.highlightLayer.url;
    this.sourceLayer = this.highlightLayer.sourceLayer;
    this.color = this.highlightLayer.style?.color || 'cyan';
    this.width = this.highlightLayer.style?.width || 0.2;
    this.before = '';

    this.loadGeoJson();
  }

  loadGeoJson() {
    this.http.get<FeatureCollection>('/assets/data/us-state-500k-boundary.geojson').subscribe({
      next: (data) => {
        this.geojsonData = data;
      },
      error: (err) => {
        console.error('Failed to load US state boundary:', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adminModeActive']?.currentValue === false) {
      this.selectedFeature = null;
      this.popupCoords = null;
      this.popupFeature = null;
    }
  }

  onLayerClick(event: any) {
    if (!event.features || event.features.length === 0) return;

    const clicked = event.features[0];
    const matchId = clicked.properties?.STATEFP;
    this.popupCoords = [event.lngLat.lng, event.lngLat.lat];

    const fullFeature = this.geojsonData?.features.find(
      (f: Feature) => f.properties?.STATEFP === matchId
    );

    if (fullFeature) {
      this.popupFeature = fullFeature;
      this.selectedFeature = {
        type: 'FeatureCollection',
        features: [JSON.parse(JSON.stringify(fullFeature))]
      };
    } else {
      console.warn('Could not find full geometry for STATEFP:', matchId);
    }
  }

  logGeometry() {
    if (!this.popupFeature?.geometry) {
      console.log('No geometry found.');
      return;
    }

    this.configService.updateSelectedGeometryWithArea(this.popupFeature.geometry);

    const bounds = new LngLatBounds();
    const geom = this.popupFeature.geometry;

    const extendBounds = (coords: [number, number][]) => {
      coords.forEach((coord) => bounds.extend(coord));
    };

    if (geom.type === 'Polygon') {
      (geom.coordinates as [number, number][][]).forEach((ring) => {
        extendBounds(ring as [number, number][]);
      });
    } else if (geom.type === 'MultiPolygon') {
      (geom.coordinates as [number, number][][][]).forEach((poly) => {
        poly.forEach((ring) => {
          extendBounds(ring as [number, number][]);
        });
      });
    }

    const map = this.config?.mapInterface?.map;
    if (map) {
      const mapWidth = map.getCanvas().width;
      map.fitBounds(bounds, {
        padding: 300,
        offset: [mapWidth * 0.05, 0]
      });
    }

    this.popupCoords = null;
  }

}
