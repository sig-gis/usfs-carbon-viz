import { Component, EventEmitter, OnInit, Output, Injectable } from '@angular/core';

@Component({
  selector: 'app-basemap-control',
  templateUrl: './basemap-control.component.html',
  styles: [
  ]
})

@Injectable({
  providedIn: 'root'
})
export class BasemapControlComponent implements OnInit {
  @Output() styleSelected = new EventEmitter<string>();

  selectedStyle: string = 'Rupabumi';

  constructor() { }

  ngOnInit(): void {
  }

  onStyleChange(style: string) {
    this.selectedStyle = style;
    this.styleSelected.emit(style);
  }

  changeMap(style: string) {
    if (style == 'Rupabumi') {
      const radioStyle = <HTMLInputElement>document.querySelector("#rupabumiRadio");
      radioStyle.click();
    } else if (style == 'Rupabumi2') {
      const radioStyle = <HTMLInputElement>document.querySelector("#rupabumiRadio2");
      radioStyle.click();
    } else if (style == 'Citra Satelit') {
      const radioStyle = <HTMLInputElement>document.querySelector("#citraRadio");
      radioStyle.click();
    } else if (style == 'Bright Style') {
      const radioStyle = <HTMLInputElement>document.querySelector("#brightRadio");
      radioStyle.click();
    } else if (style == 'Mapfan') {
      const radioStyle = <HTMLInputElement>document.querySelector("#mapfanRadio");
      radioStyle.click();
    }
    this.onStyleChange(style);
  }

}
