import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AdminService } from 'src/app/service/admin/admin.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styles: [
  ]
})
export class AdminDashboardComponent implements OnInit {

  layer = {
    title: "Grid Sebaran Penduduk per 1km",
    id: "landscan_pop",
    description: "Analysis Buffer 50 meter",
    visible: true,
    type: "wms",
    group: "socio",
    url: ["http://38.47.70.195:8080/geoserver/dmap/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=dmap:idn_dem_landscan_global_1km_2021_r &WIDTH=256&HEIGHT=256&CRS=EPSG:3857&STYLES=&BBOX={bbox-epsg-3857}"]
  }

  @Input() config: any;

  configService = inject(AppconfigService);
  map_app_list: any;

  globalLang = 'id';
  currentTab = 1;
  searchValue: any = "";
  offset: number = 0;
  orderby: string = "";
  ordertype: string = "ASC";
  subSubscribes = new SubSink();


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.loadMapAppList();
  }

  loadMapAppList(): void {
    this.subSubscribes.add(
      this.adminService.getMapApp(this.searchValue, this.offset, 12, this.orderby, this.ordertype).subscribe({
        next: responseData => {
          this.map_app_list = responseData.record.data;
          // console.log(responseData);
          //this.mapCatalogueLoaded = true;
        },
        error: responseError => {

        }
      })
    );
  }

  ngOnDestroy(): void {
    // console.log('shell component ngOnDestroy()');
  }

  ngAfterViewInit(): void {
    // const headElm = this.document.getElementsByTagName('head')[0];
  }

  clickLogout(): void {
    this.subSubscribes.add(
      this.authService.getAuthLogout().subscribe({
        next: responseData => {
          if (responseData.status !== undefined && responseData.status === 'success') {
            this.router.navigate(['/auth/login']);
            // this.authService.removeToken();
            // this.authService.removeIdUser();
            localStorage.clear();
          }

          // this.router.navigate(['/']);
        },
        error: responseError => {
          // this.loadingService.hide();
          console.log('Error SERVER response.');
          console.log(responseError);
        }
      })
    );
  }

}
