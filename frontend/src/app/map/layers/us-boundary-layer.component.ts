import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { ConfigLayer, AppConfig } from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { HttpClient } from '@angular/common/http';
import { LngLatBounds } from 'maplibre-gl';

@Component({
    selector: 'app-us-boundary-layer',
    template: `
        <mgl-geojson-source
            id="us-boundary"
            [data]="geojsonData"
        ></mgl-geojson-source>

        <mgl-layer
            id="us-boundary-line"
            type="line"
            source="us-boundary"
            [paint]="{
            'line-color': 'cyan',
            'line-width': 1.5
            }"
        ></mgl-layer>

        <mgl-layer
            *ngIf="adminModeActive && selectedAdminLevel === 'country'"
            id="us-boundary-clickable"
            type="fill"
            source="us-boundary"
            [paint]="{
            'fill-color': '#000000',
            'fill-opacity': 0
            }"
            (layerClick)="onLayerClick($event)"
        ></mgl-layer>

        <mgl-geojson-source
        *ngIf="selectedFeatureCountry && selectedAdminLevel === 'country'"
        id="selected-feature-source"
        [data]="selectedFeatureCountry"
        ></mgl-geojson-source>

        <mgl-layer
        *ngIf="selectedFeatureCountry && selectedAdminLevel === 'country'"
        id="selected-feature-outline"
        type="line"
        source="selected-feature-source"
        [paint]="{
            'line-color': '#FF0000',
            'line-width': 2
        }"
        ></mgl-layer>

        <mgl-popup
        *ngIf="popupCoords"
        [lngLat]="popupCoords"
        (close)="popupCoords = null"
        >
        <div>
            <strong>Properties:</strong>
            <pre>{{ popupFeature?.properties | json }}</pre>
            <button (click)="logGeometry()">Select this boundary</button>
        </div>
        </mgl-popup>

  `,
    styles: []
})
export class USBoundaryLayerComponent implements OnInit, OnChanges {
    @Input() adminModeActive: boolean = false;
    @Input() config!: AppConfig;
    @Input() selectedAdminLevel: string | null = null;

    geojsonData: FeatureCollection | null = null;
    popupCoords: [number, number] | null = null;
    popupFeature: any = null;
    selectedFeatureCountry: FeatureCollection | null = null;

    color: string = '#00FFFF';
    width: number = 1.5;

    constructor(
        private configService: AppconfigService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        // Load GeoJSON from assets
        this.http.get<FeatureCollection>('/assets/data/us-boundary-simplify.json').subscribe({
            next: (data) => {
                console.log('US boundary GeoJSON loaded:', data);
                this.geojsonData = data;
            },
            error: (err) => {
                console.error('Failed to load US boundary GeoJSON:', err);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['adminModeActive'] && changes['adminModeActive'].currentValue === false) {
            this.selectedFeatureCountry = null;
            this.popupCoords = null;
            this.popupFeature = null;
        }
    }

    onLayerClick(event: any) {
        if (event.features && event.features.length > 0) {
            this.popupFeature = event.features[0];
            this.popupCoords = [event.lngLat.lng, event.lngLat.lat];
            this.selectedFeatureCountry = {
                type: 'FeatureCollection',
                features: [this.popupFeature]
            };
        }
    }

    logGeometry() {
        if (this.popupFeature?.geometry) {
            this.configService.updateSelectedGeometryWithArea(this.popupFeature.geometry);

            const bounds = new LngLatBounds();
            const coords = this.popupFeature.geometry.coordinates.flat(Infinity);
            for (let i = 0; i < coords.length; i += 2) {
                bounds.extend([coords[i], coords[i + 1]]);
            }

            if (this.config?.mapInterface?.map) {
                const map = this.config.mapInterface.map;
                const mapWidth = map.getCanvas().width;
                const padding = 300;
                const offset: [number, number] = [mapWidth * 0.05, 0];

                map.fitBounds(bounds, {
                    padding: padding,
                    offset: offset
                });
            }

            this.popupCoords = null;
        } else {
            console.warn('No geometry found.');
        }
    }
}
