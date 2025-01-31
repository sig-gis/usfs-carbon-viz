import { Component, Input, OnInit } from '@angular/core';
import { Analysis } from 'src/app/service/layers.interface';

@Component({
  selector: 'app-analisis-perizinan',
  templateUrl: './analisis-perizinan.component.html',
  styles: [
  ]
})
export class AnalisisPerizinanComponent implements OnInit {

  @Input() analisis!: Analysis;

  photo1: string;
  photo2: string;

  constructor() { }

  ngOnInit(): void {
    if (this.analisis.output.type === 'perizinan') {
      this.photo1 = this.analisis.output.photo1
      this.photo2 = this.analisis.output.photo2;
    }
  }

}
