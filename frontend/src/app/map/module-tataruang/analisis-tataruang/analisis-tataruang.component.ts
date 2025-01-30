import { Component, Input, OnInit } from '@angular/core';
import { Analysis } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-analisis-tataruang',
  templateUrl: './analisis-tataruang.component.html',
  styles: [
  ]
})
export class AnalisisTataruangComponent implements OnInit {

  @Input() analisis!: Analysis;

  id: number;
  landuse: string;
  namaobj: string;
  fcode_polaruang: string;
  polaruang: string;
  kategori: string;
  rules_from_itbx: string;
  lat: number;
  lon: number;

  constructor() { }

  ngOnInit(): void {
    if (this.analisis.output.type === 'tataruang') {
      this.id = this.analisis.output.id;
      this.landuse = this.analisis.output.landuse;
      this.namaobj = this.analisis.output.namaobj;
      this.fcode_polaruang = this.analisis.output.fcode_polaruang;
      this.polaruang = this.analisis.output.polaruang;
      this.kategori = this.analisis.output.kategori;
      this.rules_from_itbx = this.analisis.output.rules_from_itbx;
      this.lat = this.analisis.output.lat;
      this.lon = this.analisis.output.lon;
    }
  }

}
