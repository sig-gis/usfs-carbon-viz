import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-perizinan-list',
  template: `
  <div class="card mb-2" [class.active-card]="isSelected" (click)="onCardClick()">
    <div class="card-body p-2">
        <div class="row">
            <div class="col-4 pr-0">
                <img [src]="img" class="card-img" alt="...">
            </div>
            <div class="col-8">
                <div class="d-flex justify-content-between mb-2">
                    <div>
                        <h5 class="card-title font-small mb-1">NOP:</h5>
                        <h5 class="card-title font-small mb-1">{{ nop }}</h5>
                    </div>
                    <div class="d-flex align-items-start">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                            <label class="form-check-label" for="flexCheckChecked"></label>
                        </div>
                    </div>
                </div>
                <small class="font-small d-block">Izin IMB | {{ pengajuanIzin }}</small>
                <div class="mt-2 font-small">
                    Dibuat: {{ createDate }}<br>
                    Updated: {{ updateDate }}<br>
                </div>
                <div class="row mt-2">
                    <div class="col-12 font-small">
                        {{ source }}
                    </div>
                    <div class="col-4"></div>
                    <div class="col-8">
                        <div class="row">
                            <div class="col-4">
                                <i class="las la-globe"></i>
                            </div>
                            <div class="col-4">
                                <i class="las la-star-half-alt"></i>
                            </div>
                            <div class="col-4">
                                <i class="las la-ellipsis-h"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

`,
  styles: [
    `
    .active-card {
      background-color: #e0e0e0; /* Light gray for illustration purposes */
      border: 2px solid #333;    /* Dark border for illustration purposes */
      cursor: pointer;           /* Change cursor to hand pointer on hover */
    }
    .font-small {
      font-size: 11px;
    }
    `
  ]
})
export class PerizinanListComponent implements OnInit {

  @Input() izin: any;
  @Input() isSelected: boolean = false;
  @Output() cardClicked = new EventEmitter<void>();

  isActive: boolean = false;

  nop: number;
  NIB: string;
  noOSS: number;
  createDate: string;
  updateDate: string;
  source: string;
  pengajuanIzin: string;
  img: string;

  constructor() { }

  ngOnInit(): void {
    if (this.izin) {
      this.nop = this.izin.nop;
      this.NIB = this.izin.NIB;
      this.noOSS = this.izin.noOSS;
      this.updateDate = this.izin.updateDate;
      this.source = this.izin.source;
      this.pengajuanIzin = this.izin.pengajuanIzin;
      this.img = this.izin.img;
    }

  }

  onCardClick(): void {
    this.cardClicked.emit();
  }

}
