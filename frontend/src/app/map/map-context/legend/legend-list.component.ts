import { Component, inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ConfigLayer, LegendItem } from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';

@Component({
  selector: 'app-legend-list',
  templateUrl: './legend-list.component.html',
  styles: [
  ]
})
export class LegendListComponent implements OnInit {

  @Input() layer!: ConfigLayer;
  @Output() legendOrderChanged = new EventEmitter<LegendItem[]>();

  constructor(
    private appconfigService: AppconfigService
  ) { }

  id!: string;
  title!: string;
  desc!: string;
  color!: string;
  legends?: LegendItem[];
  visible!: boolean;
  opacity!: number;
  sliderVisible = false;
  tooltipVisible = false;


  configService = inject(AppconfigService);

  ngOnInit(): void {
    this.id = this.layer.id;
    this.title = this.layer.title;
    this.desc = this.layer.description;
    this.legends = this.layer.legend;
    this.visible = this.layer.visible;
    this.opacity = this.layer.opacity;
  }

  toggleSlider() {
    this.sliderVisible = !this.sliderVisible;
  }

  toggleTooltip() {
    this.tooltipVisible = !this.tooltipVisible;
  }

  onSliderChange(event: any) {
    this.configService.changeOpacity(this.id, this.opacity);
  }

  closeLayer() {
    this.configService.updateVisible(this.id);
  }
}
