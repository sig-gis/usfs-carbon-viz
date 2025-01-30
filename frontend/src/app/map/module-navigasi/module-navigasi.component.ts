import { Component, EventEmitter, Input, NgZone, OnInit, Output, inject } from '@angular/core';
import { Map, MapMouseEvent, Marker } from 'maplibre-gl';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { AppConfig, ConfigLayer } from 'src/app/service/layers.interface';
import { MapServiceService } from 'src/app/service/map-service/map-service.service';

@Component({
  selector: 'app-module-navigasi',
  templateUrl: './module-navigasi.component.html',
  styleUrls: ['./module-navigasi.component.css']
})
export class ModuleNavigasiComponent implements OnInit {

  @Input() config!: AppConfig;
  @Output() changeLegend = new EventEmitter<string>();

  gisService = inject(MapServiceService);
  configService = inject(AppconfigService);

  clickMapActive: boolean = false;
  mapInterface!: Map | undefined;
  boundHandleClick: any;

  geoJsonData: any;
  highlightLayer: ConfigLayer;
  start: [number, number] | null = null;
  end: [number, number] | null = null;

  constructor(private ngZone: NgZone) {
    this.boundHandleClick = this.handleClick.bind(this)
  }

  ngOnInit(): void {
    this.mapInterface = this.config.mapInterface?.map;

    if (this.mapInterface) {
      this.mapInterface.on('click', this.boundHandleClick);
      // this.mapInterface.getCanvas().style.cursor = 'pointer';
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
      this.onMapClick(evt);
    }
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

  onMapClick(evt: MapMouseEvent) {
    const coordinates: [number, number] = [evt.lngLat.lng, evt.lngLat.lat];

    if (!this.start) {
      this.setStartPoint(coordinates);
    } else {
      this.setEndPoint(coordinates);
    }
  }

  setStartPoint(coordinates: [number, number]) {
    this.start = coordinates;
    this.createMarker(coordinates, 'Start');
  }

  setEndPoint(coordinates: [number, number]) {
    this.end = coordinates;
    this.createMarker(coordinates, 'End');
    this.setRouteClick();
  }

  createMarker(coordinates: [number, number], label: string) {
    if (this.mapInterface) {
      const marker = new Marker({ color: label === 'Start' ? 'green' : 'red' })
        .setLngLat(coordinates)
        .addTo(this.mapInterface);
      marker.getElement().setAttribute('title', label);
    }
  }

  setRouteClick(): void {
    if (this.start && this.end) {
      this.gisService.getRoute(this.start, this.end).subscribe(
        route => {
          this.ngZone.run(() => {
            console.log('Route:', route);
            const geojson = this.transformToGeoJSON(route);

            if (geojson) {
              this.highlightLayer = {
                title: "Layer Terpilih",
                id: "highlightLayer",
                description: "Layer Highlight",
                visible: true,
                type: "highlightLayer",
                url: geojson,
                opacity: 0.9,
                style: {
                  color: "cyan"
                }
              };

              this.configService.addHighlight(this.highlightLayer);
              // Uncomment the following line if you want to zoom to the geojson
              console.log("Geojson rute: ", geojson);
              this.gisService.zoomtogeojson(geojson, this.mapInterface);
            } else {
              console.error('GeoJSON is undefined');
            }
          });
        },
        error => {
          this.ngZone.run(() => {
            console.error('Error fetching route:', error);
          });
        }
      );
    }
  }

  transformToGeoJSON(response: any): any {
    if (!response || !response.routes || response.routes.length === 0) {
      return null;
    }

    // Extract the first route from the response
    const route = response.routes[0];
    const coordinates = route.geometry.coordinates;

    // Construct a GeoJSON object
    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        },
        properties: {
          distance: route.distance,
          duration: route.duration,
          summary: route.legs[0].summary,
          steps: route.legs[0].steps,
          color: "red"
        }
      }]
    };

    return geojson;
  }

  startLocation: string = '';
  endLocation: string = 'National Monument';
  selectedTransport: string = 'car';
  routes = [
    { time: '25 min', delay: 'incl. 7 min delay', distance: '9.9 km', leaveTime: 'Leave at 3:38 PM' },
    { time: '26 min', delay: 'incl. 8 min delay', distance: '10.3 km', leaveTime: 'Leave at 3:38 PM' },
    { time: '26 min', delay: 'incl. 8 min delay', distance: '10.4 km', leaveTime: 'Leave at 3:38 PM' }
  ];

  selectTransport(transport: string) {
    this.selectedTransport = transport;
  }

  addStop() {
    // Add logic for adding a stop
  }

  share() {
    // Add logic for sharing the route
  }

  save() {
    // Add logic for saving the route
  }

  time: string = '6 min';
  delay: string = 'incl. 1 min delay';
  distance: string = '2.4 km';
  arrivalTime: string = '11:58 AM';
  endLocation2: { name: string, address: string } = { name: 'Medistra', address: 'Medistra, Jalan Jend Gatot Subroto 59, Kuningan Timur Kel., Setia Budi, Jakarta Selatan, 12950, Indonesia' };

  route: Array<{ maneuver: string, instruction: string, distance: string }> = [
    { maneuver: 'Head', instruction: 'toward Jalan Kapten Pierre Tendean on Jalan Kapten Tendean. Go for 86 m.', distance: '86 m' },
    { maneuver: 'Turn left', instruction: 'toward Jalan Kapten Pierre Tendean. Go for 63 m.', distance: '63 m' },
    { maneuver: 'Continue', instruction: 'on Jalan Kapten Pierre Tendean. Go for 223 m.', distance: '223 m' },
    { maneuver: 'Turn left', instruction: 'onto Jalan Kapten Pierre Tendean toward Wr. Buncit/Ragunan. Go for 201 m.', distance: '201 m' },
    { maneuver: 'Make a U-Turn', instruction: 'onto Jalan Kapten Pierre Tendean. Go for 448 m.', distance: '448 m' },
    { maneuver: 'Take ramp', instruction: 'toward Kuningan. Go for 130 m.', distance: '130 m.' },
    { maneuver: 'Keep left', instruction: 'onto Jalan Kapten Pierre Tendean. Go for 69 m.', distance: '69 m.' },
    { maneuver: 'Turn left', instruction: 'onto Jalan Jenderal Gatot Subroto (Nasional2). Go for 205 m.', distance: '205 m' },
    { maneuver: 'Keep left', instruction: 'onto Jalan Jenderal Gatot Subroto (Nasional2) toward Menteng/Mampang/Rasuna Said. Go for 194 m.', distance: '194 m' },
    { maneuver: 'Make a U-Turn', instruction: 'onto Jalan Jenderal Gatot Subroto (Nasional2). Go for 701 m.', distance: '701 m' },
    { maneuver: 'Turn left', instruction: 'onto Jalan Raya Bogor. Go for 44 m.', distance: '44 m' },
    { maneuver: 'Turn right', instruction: 'onto Jalan Dalang I. Go for 13 m.', distance: '13 m' },
    { maneuver: 'Arrive', instruction: 'at your destination.', distance: '' }
  ];

  close() {
    // Logic to close the component
  }


}

// Define the start point and end point parameters set default as empty array.
// If the start point is empty then define the start point. Else if the start point is not empty then update the end point.
// Create marker for start point.
// Function to update the end point.
// Create marker for end point..
// Calculate route based on start point and end point.
// Draw the route as highlight layer.

