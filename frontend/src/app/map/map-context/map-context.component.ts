import { Component, Inject, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppConfig, ConfigLayer, LegendItem } from 'src/app/service/layers.interface';
import { BasemapControlComponent } from '../basemap-control/basemap-control.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { Map } from 'maplibre-gl';

@Component({
  selector: 'app-map-context',
  templateUrl: './map-context.component.html',
  styleUrls: ['./map-context.component.scss']
})
export class MapContextComponent implements OnInit, OnChanges {

  @Input() config!: AppConfig;
  @Input() currentTab: number;
  @Input() currentLegend: string;
  @Input() legendVisible: boolean;

  configService = inject(AppconfigService);
  mapInterface!: Map | undefined;


  visibleLayersCount: number;
  visibleLayerIds: string[];

  aboveBuilding: string[];
  underBuilding: string[];

  allAboveBuilding: ConfigLayer[];
  allUnderBuilding: ConfigLayer[];

  accordionState = false;
  currentMapStyle: string = 'Rupabumi';

  constructor(@Inject(BasemapControlComponent) private baseMapControlComponent: BasemapControlComponent) { }

  ngOnInit() {
    if (this.config.mapInterface?.map) {
      this.setupLayers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.config && changes.config.currentValue) {
      this.setupLayers();
    }
  }

  private getVisibleLayers() {
    return this.config.layers.filter(layer => layer.visible);
  }

  private setupLayers() {

    this.mapInterface = this.config.mapInterface?.map;

    const visibleLayers = this.getVisibleLayers();
    this.visibleLayersCount = visibleLayers.length;

    const aboveBuildingVisible = [];
    const underBuildingVisible = [];
    const allAboveBuilding: ConfigLayer[] = [];
    const allUnderBuilding: ConfigLayer[] = [];

    let isBuildingEncountered = false;
    for (const item of this.config.layers) {
      if (item.placed_before === 'building') {
        isBuildingEncountered = true;
      }

      if (isBuildingEncountered) {
        allUnderBuilding.push(item);
        if (item.visible) {
          underBuildingVisible.push(item.id);
        }
      } else {
        allAboveBuilding.push(item);
        if (item.visible) {
          aboveBuildingVisible.push(item.id);
        }
      }
    }

    this.aboveBuilding = aboveBuildingVisible;
    this.underBuilding = underBuildingVisible;
    this.allAboveBuilding = allAboveBuilding;
    this.allUnderBuilding = allUnderBuilding;
  }

  splitLayers(): { above: any[], under: any[] } {
    // Find the index of the first layer with placed_before === 'building'
    const buildingIndex = this.config.layers.findIndex(layer => layer.placed_before === 'building');

    // Split the array based on the found index
    const above = this.config.layers.slice(0, buildingIndex);
    const under = this.config.layers.slice(buildingIndex);

    return { above, under };
  }

  handleSameContainerEvent(event: any) {
    switch (event.container.id) {
      case 'aboveBuilding':
        this.handleAboveBuildingSameContainer(event);
        break;
      case 'underBuilding':
        this.handleUnderBuildingSameContainer(event);
        break;
      default:
        console.error("Invalid container ID");
        break;
    }
  }

  handleDifferentContainerEvent(event: any) {
    switch (event.container.id) {
      case 'aboveBuilding':
        this.handleAboveBuildingDifferentContainer(event);
        console.log("Move to Above Building Triggered")
        break;
      case 'underBuilding':
        this.handleUnderBuildingDifferentContainer(event);
        break;
      default:
        console.error("Invalid container ID");
        break;
    }
  }

  handleAboveBuildingSameContainer(event: CdkDragDrop<string[]>) {

    const movedLayerId = this.aboveBuilding[event.previousIndex];
    const droppedLayerId = this.aboveBuilding[event.currentIndex];
    const beforecurId = this.aboveBuilding[event.currentIndex - 1];


    const allUnderBuildingFirstId = this.allUnderBuilding?.[0]?.id;
    const setTop = event.previousContainer.data[0] === allUnderBuildingFirstId
    ? this.allAboveBuilding[1]?.id
    : this.allAboveBuilding[0]?.id;

    // Check early exit conditions
    if (event.previousIndex === event.currentIndex) return;

    // Logic specific to aboveBuilding
    if (event.previousIndex === 0) {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, droppedLayerId, "", false, setTop);
    } else if (event.currentIndex === 0) {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, "");
    } else if (event.previousIndex < event.currentIndex) {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, droppedLayerId);
    } else {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, beforecurId);
    }
  }

  handleUnderBuildingSameContainer(event: CdkDragDrop<string[]>) {

    const movedLayerId = this.underBuilding[event.previousIndex];
    const droppedLayerId = this.underBuilding[event.currentIndex];
    const beforecurId = this.underBuilding[event.currentIndex - 1];
    const setBuilding = event.previousContainer.data[0] === this.allUnderBuilding[0].id
      ? this.allUnderBuilding[1].id
      : this.allUnderBuilding[0].id;

    if (event.previousIndex === event.currentIndex) return;

    if (event.currentIndex === 0) {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, "building");
    } else if (event.previousIndex < event.currentIndex) {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, droppedLayerId, setBuilding);
    } else {
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, beforecurId);
    }
  }

  handleAboveBuildingDifferentContainer(event: CdkDragDrop<string[]>) {
    console.log("A Part Triggered")

    const movedLayerId = event.previousContainer.data[event.previousIndex];
    const droppedLayerId = event.container.data[event.currentIndex]
      ? event.container.data[event.currentIndex]
      : event.previousContainer.data[0];
    const beforecurId = event.container.data[event.currentIndex - 1];
    const setBuilding = event.previousContainer.data[0] === this.allUnderBuilding[0].id
      ? this.allUnderBuilding[1].id
      : this.allUnderBuilding[0].id;
    const topUnderBuilding = this.allUnderBuilding[0].id;
    const handleEmptyAboveBuilding: boolean = this.allAboveBuilding.length === 0;
    const handleNonVisibleOnTop: boolean = event.previousContainer.data[0] !== this.allUnderBuilding[0].id;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    if (event.currentIndex === 0) {
      console.log(handleNonVisibleOnTop);
      console.log(event.previousIndex);
      if (handleNonVisibleOnTop && handleEmptyAboveBuilding && event.previousIndex === 0) {
        console.log("handleEmptyAboveBuilding")
        console.log("handleNonVisibleOnTop")
        this.configService.reorderLayers(this.mapInterface!, droppedLayerId, topUnderBuilding, movedLayerId, "", topUnderBuilding, true);
      } else if (handleNonVisibleOnTop && handleEmptyAboveBuilding) {
        console.log("handle2ndStep")
        this.configService.reorderLayers(this.mapInterface!, topUnderBuilding, movedLayerId, movedLayerId, "", topUnderBuilding, true);
      } else if (handleEmptyAboveBuilding && event.previousIndex > 0) {
        console.log("handle2ndStep")
        this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, "", topUnderBuilding, true);
      } else {
        console.log("handle+1Indexke0")
        this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, "", setBuilding, true);
      }
    } else if (handleNonVisibleOnTop && event.container.data[event.container.data.length - 1] === droppedLayerId) {
      console.log(event.container.data)

      console.log("G Part Triggered")
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, beforecurId, "", true);
    } else if (handleNonVisibleOnTop) {
      console.log(event.container.data)

      console.log("H Part Triggered")
      this.configService.reorderLayers(this.mapInterface!, topUnderBuilding, movedLayerId, movedLayerId, "", topUnderBuilding, true);
    } else if (event.previousIndex === 0) {
      console.log("E Part Triggered")
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, beforecurId, setBuilding, true);
    } else {
      console.log("F Part Triggered")
      this.configService.reorderLayers(this.mapInterface!, droppedLayerId, movedLayerId, movedLayerId, beforecurId, "", true);
    }

    return;
  }

  handleUnderBuildingDifferentContainer(event: CdkDragDrop<string[]>) {
    const movedLayerId = event.previousContainer.data[event.previousIndex];
    const beforecurId = event.container.data[event.currentIndex - 1];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    if (event.currentIndex === 0) {
      this.configService.reorderLayers(this.mapInterface!, this.allUnderBuilding[0].id, movedLayerId, movedLayerId, "building", "", true);
      return;
    }

    this.configService.reorderLayers(this.mapInterface!, beforecurId, movedLayerId, movedLayerId, beforecurId, "", true);
    return;

  }

  drop(event: CdkDragDrop<string[]>): void {
    if (!this.mapInterface) return;

    if (event.previousContainer === event.container) {
      this.handleSameContainerEvent(event);
    } else {
      this.handleDifferentContainerEvent(event);
      console.log(this.aboveBuilding);
      console.log(this.underBuilding);
    }
  }

  clickAccordion(): void {
    this.accordionState = !this.accordionState;
  }

  clickRupabumi(): void {
    this.currentMapStyle = 'Rupabumi';
    this.baseMapControlComponent.changeMap(this.currentMapStyle);
  }

  clickMapfan(): void {
    this.currentMapStyle = 'Mapfan';
    this.baseMapControlComponent.changeMap(this.currentMapStyle);
  }

  clickRupabumi2(): void {
    this.currentMapStyle = 'Rupabumi2';
    this.baseMapControlComponent.changeMap(this.currentMapStyle);
  }

  clickCitra(): void {
    this.currentMapStyle = 'Citra Satelit';
    this.baseMapControlComponent.changeMap(this.currentMapStyle);
  }

  clickBright(): void {
    this.currentMapStyle = 'Bright Style';
    this.baseMapControlComponent.changeMap(this.currentMapStyle);
  }


}
