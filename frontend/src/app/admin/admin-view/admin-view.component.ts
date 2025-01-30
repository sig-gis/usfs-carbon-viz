import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-admin-view',
  template: `
      <mgl-map
        [style]="'/assets/map_style/style_rbi_v1.json'"
        [zoom]="[10]"
        [center]="[107.4191, -6.9175]">
      
        <mgl-control
          mglNavigation position="top-right">
        </mgl-control>

      </mgl-map>`,
  styles: [`
      mgl-map {
        height: calc(100vh - 70px);
        width: 100%;
      }
  `]
})
export class AdminViewComponent implements OnInit {

  constructor() { }

  @Input() config: any;


  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }

}
