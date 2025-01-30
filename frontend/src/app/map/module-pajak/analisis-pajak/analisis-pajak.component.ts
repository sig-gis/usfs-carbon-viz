import { Component, Input, OnInit } from '@angular/core';
import { Analysis } from 'src/app/service/layers.interface';
@Component({
  selector: 'app-analisis-pajak',
  templateUrl: './analisis-pajak.component.html',
  styles: [
  ]
})
export class AnalisisPajakComponent implements OnInit {

  @Input() analisis!: Analysis;

  id: number;
  nop: number;
  nib: string;
  penggunaan: string;
  tipeHak: string;
  kodeProduk: number;
  tahun: number;
  luas: number;
  namaPemilik: string;
  blok: number;
  pbb: number;
  znt: string;
  nilaiPajak: number;
  nomorBlok: number
  kodeProv: number;
  kodeKabKot: number;
  kodeKec: number;
  kodeKel: number;
  Prov: number;
  KabKot: number;
  Kec: number;
  Kel: number;
  lat: number;
  lon: number;

  ngOnInit(): void {
    if (this.analisis.output.type === 'pajak') {
      this.id = this.analisis.output.id;
      this.nop = this.analisis.output.nop;
      this.penggunaan = this.analisis.output.penggunaan;
      this.tipeHak = this.analisis.output.tipeHak;
      this.kodeProduk = this.analisis.output.kodeProduk;
      this.tahun = this.analisis.output.tahun;
      this.luas = this.analisis.output.luas;
      this.namaPemilik = this.analisis.output.namaPemilik;
      this.blok = this.analisis.output.blok;
      this.pbb = this.analisis.output.pbb;
      this.znt = this.analisis.output.znt;
      this.nilaiPajak = this.analisis.output.nilaiPajak;
      this.nomorBlok = this.analisis.output.nomorBlok;
      this.kodeProv = this.analisis.output.kodeProv;
      this.kodeKabKot = this.analisis.output.kodeKabKot;
      this.kodeKec = this.analisis.output.kodeKec;
      this.kodeKel = this.analisis.output.kodeKel;
      this.Prov = this.analisis.output.Prov;
      this.KabKot = this.analisis.output.KabKot;
      this.Kec = this.analisis.output.Kec;
      this.Kel = this.analisis.output.Kel;
      this.lat = this.analisis.output.lat;
      this.lon = this.analisis.output.lon;
    }
  }

}