//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Inject, Input, inject, HostListener, ViewChild } from '@angular/core';
import { AppConfig, ConfigLayer } from 'src/app/service/layers.interface';
import { SubSink } from 'subsink';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapCatalogueService } from '../../service/map-catalogue/map-catalogue.service';
import { MapComponent } from '../map.component';
import { MapMenuComponent } from '../map-menu/map-menu.component';
import { AppconfigService } from 'src/app/service/appconfig.service';


@Component({
  selector: 'app-map-store',
  templateUrl: './map-store.component.html',
  styles: [
  ]
})
export class MapStoreComponent implements OnInit {

  currentSearch = 'one';

  @Input() config!: AppConfig;

  offset: number = 0;
  orderby: string = "";
  ordertype: string = "ASC";
  total: number = 0;
  catalogList: any[] = [];
  mapConfig = inject(MapComponent);
  configService = inject(AppconfigService);
  param_id: string = '';
  catalogue: any[] = [];
  numberpagination: any = [];
  maxpage: number = 1;
  page: number = 1;
  catalogListLoaded = false;

  searchValue: any = "";
  searchForm = new FormGroup({
    search: new FormControl('')
  });
  subSubscribes = new SubSink();
  selected_map = this.mapConfig.config$;

  constructor(
    private MapCatalogueService: MapCatalogueService,
    private mapMenuComponent: MapMenuComponent
  ) { }

  ngOnInit(): void {
    this.selected_map.subscribe((map) => {
      this.catalogue = map.layers;
    })
    this.loadListMapCatalogue();

    setTimeout(() => {
      this.catalogListLoaded = true;
    }, 2000);
  }

  closeStore(): void {

  }

  loadListMapCatalogue(): void {
    for (const key in this.catalogue) {
      if (this.catalogue.hasOwnProperty(key)) {
        const value = this.catalogue[key].id;
        this.param_id += value + ',';
      }
    }

    // console.log(this.param_id, "param id");

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          // console.log(responseData, "data");
          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          while (i <= this.maxpage) {
            this.numberpagination.push(
              { id: i, name: i },
            )
            i++;
          }

          // console.log(this.maxpage, "maxpage");
          // console.log(this.numberpagination, "numpage");
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  doSearch(): void {
    //this.currentTab = 4;
    this.page = 1;
    this.searchValue = this.searchForm.controls['search'].value;
    this.offset = 0;
    this.numberpagination = [];

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          while (i <= this.maxpage) {
            this.numberpagination.push(
              { id: i, name: i },
            )
            i++;
          }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  onNext(): void {
    //this.currentTab = 4;
    this.searchValue = this.searchForm.controls['search'].value;
    this.offset += 9;
    ++this.page;

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          // while(i <= this.maxpage){
          // this.numberpagination.push(
          //           {id: i,name: i},
          //         )
          //         i++;
          //       }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  onLast(): void {
    //this.currentTab = 4;
    this.searchValue = this.searchForm.controls['search'].value;
    this.page = this.maxpage;
    this.offset = this.maxpage * 9 - 9;

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          // while(i <= this.maxpage){
          // this.numberpagination.push(
          //           {id: i,name: i},
          //         )
          //         i++;
          //       }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  onPrev(): void {
    //this.currentTab = 4;
    this.searchValue = this.searchForm.controls['search'].value;
    this.offset -= 9;
    --this.page;

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          // while(i <= this.maxpage){
          // this.numberpagination.push(
          //           {id: i,name: i},
          //         )
          //         i++;
          //       }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  onFirst(): void {
    //this.currentTab = 4;
    this.searchValue = this.searchForm.controls['search'].value;
    this.offset = 0;
    this.page = 1;

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          // while(i <= this.maxpage){
          // this.numberpagination.push(
          //           {id: i,name: i},
          //         )
          //         i++;
          //       }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  loadNumberofPagination(event: any) {

    this.offset = event * 9 - 9;
    this.page = event;
    // console.log(event, "offset");

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {
          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
        },
        error: (responseError: any) => {
        }
      })
    );

  }

  addLayer(layer: any) {

    //console.log(layer.id,'aku disini');
    this.configService.addLayer(layer);
    //this.page = 1;
    this.searchValue = this.searchForm.controls['search'].value;
    //this.offset = 0;
    this.numberpagination = [];

    this.param_id += layer.id + ',';

    this.subSubscribes.add(
      this.MapCatalogueService.getMapCatalogue(this.searchValue, this.offset, 9, this.orderby, this.ordertype, this.param_id).subscribe({
        next: (responseData: any) => {

          this.total = responseData.record.total;
          this.catalogList = responseData.record.data;
          this.maxpage = Math.ceil(this.total / 9);
          let i: number = 1;
          while (i <= this.maxpage) {
            this.numberpagination.push(
              { id: i, name: i },
            )
            i++;
          }
        },
        error: (responseError: any) => {
        }
      })
    );
  }

  removeLayer(id: any) {

    // console.log(id, 'iddddddddd');
    return;

    this.configService.removeLayerById(id);
  }


  closeModal(): void {
    this.mapMenuComponent.hideMapStore();
  }
}
