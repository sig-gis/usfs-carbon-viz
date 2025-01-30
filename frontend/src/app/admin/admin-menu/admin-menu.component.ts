import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styles: [
  ]
})
export class AdminMenuComponent implements OnInit {
  

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

  globalLang = 'id';
  currentTab = 1;
  currentSearch = 'one';
  subSubscribes = new SubSink();
  public href: string = "";
  url: string = "asdf";

  layerForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    type: new UntypedFormControl('', [Validators.required]),
    langitude: new UntypedFormControl('', [Validators.required]),
    longitude: new UntypedFormControl('', [Validators.required])
  });

  get getLayerForm() {
    return this.layerForm.controls;
  }

  roleForm = new UntypedFormGroup({
    user: new UntypedFormControl('', [Validators.required]),
    role: new UntypedFormControl('', [Validators.required])
  });

  get getRoleForm() {
    return this.roleForm.controls;
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.href = this.router.url;
    console.log(this.router.url);
  }

  ngOnDestroy(): void {
    console.log('shell component ngOnDestroy()');
  }

  ngAfterViewInit(): void {
    // const headElm = this.document.getElementsByTagName('head')[0];
  }

  addLayer() {
    let layer: any;
    layer = this.layer;
    // const config = this.configService.getConfig();

    this.configService.addLayer(layer);
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
