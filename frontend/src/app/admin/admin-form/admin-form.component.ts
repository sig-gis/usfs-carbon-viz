import { Component, OnInit, Inject, Input, inject } from '@angular/core';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { LayersService } from 'src/app/service/layers/layers.service'; 
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/service/admin/admin.service'; 
import { param } from 'jquery';


@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styles: [
  ]
})
export class AdminFormComponent implements OnInit {

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

  offset: number = 0;
  orderby: string = "";
  ordertype: string = "ASC";
  searchValue: any = "";
  globalLang = 'id';
  currentTab = 1;
  subSubscribes = new SubSink();
  isAdd = false;
  isEdit = false;
  selectedType = '';
  layerList: any;
  url: any; //Angular 11, for stricter type
	msg = "";
  mapCatalogueLoaded : boolean = false;

  layerForm = new UntypedFormGroup({
    type: new UntypedFormControl('', [Validators.required]),
    name: new UntypedFormControl('', [Validators.required]),
    id: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl(''),
    url: new UntypedFormControl('', [Validators.required]),
    opacity: new UntypedFormControl('', [Validators.required]),
    image:  new UntypedFormControl(''),
    group:  new UntypedFormControl('')
  });

  editLayerForm = new UntypedFormGroup({
    uuid: new UntypedFormControl(''),
    type: new UntypedFormControl('', [Validators.required]),
    name: new UntypedFormControl('', [Validators.required]),
    id: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl(''),
    url: new UntypedFormControl('', [Validators.required]),
    opacity: new UntypedFormControl('', [Validators.required]),
    image:  new UntypedFormControl(''),
    group:  new UntypedFormControl('')
  });

  get getLayerForm(){
    return this.layerForm.controls;
  }


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService,
    private layersService: LayersService,
    private activatedRoute : ActivatedRoute,
    private adminService : AdminService
  ) { 
  
  }

  ngOnInit() {
  
    this.loadListMapCatalogue();

  }

  ngOnDestroy(): void {
    console.log('shell component ngOnDestroy()');
  }

  ngAfterViewInit(): void {
    // const headElm = this.document.getElementsByTagName('head')[0];
  }

  addLayerForm(): void{
    this.isAdd = true;
    this.isEdit = false;
    this.selectedType = '';
  }

  editLayer(obj:any): void{
    console.log(obj,"edit");
    this.isEdit = true;
    this.isAdd = false;
    this.url = obj.image;
    this.selectedType = obj.type;
    this.editLayerForm.get('uuid')?.setValue(obj.uuid);
    this.editLayerForm.get('type')?.setValue(obj.type);
    this.editLayerForm.get('name')?.setValue(obj.title);
    this.editLayerForm.get('id')?.setValue(obj.id);
    this.editLayerForm.get('description')?.setValue(obj.description);
    this.editLayerForm.get('url')?.setValue(obj.url);
    this.editLayerForm.get('opacity')?.setValue(obj.opacity);
    this.editLayerForm.get('group')?.setValue(obj.group);
  }

  cancelForm(): void{
    this.isAdd = false;
    this.isEdit = false;
    this.layerForm.reset();
    this.editLayerForm.reset();
    this.layerForm.get('type')?.setValue('');
  }

  onChangeType(event: any): void{
    this.selectedType = event.target.value;
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


  loadListMapCatalogue(): void {
    
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.subSubscribes.add(
      this.adminService.getMapAppLayerlist(this.searchValue, this.offset, 9, this.orderby, this.ordertype, uuid).subscribe({
        next: (responseData: any) => {
          console.log(responseData, "data");
          // this.total = responseData.record.total;
          this.mapCatalogueLoaded = true;
          this.layerList = responseData.record.data;
          // this.maxpage = Math.ceil(this.total / 9);
          // let i: number = 1;
          // while (i <= this.maxpage) {
          //   this.numberpagination.push(
          //     { id: i, name: i },
          //   )
          //   i++;
          // }

        },
        error: (responseError: any) => {
        }
      })
    );
  }




  selectFile(event: any) { 
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		var mimeType = event.target.files[0].type;
    
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
      this.url = '';
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
		}

    console.log(event.target.files[0],"reader");


	}

  saveForm(): void{
    

    let formBody = {
      "map_app_uuid" : this.activatedRoute.snapshot.paramMap.get('uuid'),
      "type": this.layerForm.value.type,
      "name":  this.layerForm.value.name,
      "id":  this.layerForm.value.id,
      "description":  this.layerForm.value.description,
      "url":  this.layerForm.value.url,
      "opacity":  this.layerForm.value.opacity,
      "image" :  this.layerForm.value.image,
      "group" : this.layerForm.value.group
    }
  
    this.mapCatalogueLoaded = false;
    this.subSubscribes.add(
      this.adminService.postLayerList(formBody).subscribe({
        next: responseData => {
          // this.layerList = responseData.layers;
          this.loadListMapCatalogue();
          this.isAdd = false;
        },
        error: responseError => {
          
        }
      })
    );

    console.log(formBody,"aaa");
  
  }

  saveEditForm(): void{
    
    let formBody = {
      "uuid": this.editLayerForm.value.uuid,
      "type": this.editLayerForm.value.type,
      "name":  this.editLayerForm.value.name,
      "id":  this.editLayerForm.value.id,
      "description":  this.editLayerForm.value.description,
      "url":  this.editLayerForm.value.url,
      "opacity":  this.editLayerForm.value.opacity,
      "image" :  this.editLayerForm.value.image,
      "group" : this.editLayerForm.value.group
    }
    this.mapCatalogueLoaded = false;
    this.subSubscribes.add(
      this.adminService.updateLayerList(formBody).subscribe({
        next: responseData => {
          // this.layerList = responseData.layers;
          this.loadListMapCatalogue();
          this.isEdit = false;
        },
        error: responseError => {
          
        }
      })
    );

   
  
  }

}
