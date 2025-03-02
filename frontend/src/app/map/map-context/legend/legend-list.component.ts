import { Component, inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ConfigLayer, Legend, LegendItem, ContinuousSymbol, GraduatedSymbol } from 'src/app/service/layers.interface';
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
  legend?: Legend;
  visible!: boolean;
  opacity!: number;
  sliderVisible = false;
  tooltipVisible = false;


  configService = inject(AppconfigService);

  ngOnInit(): void {
    this.id = this.layer.id;
    this.title = this.layer.title;
    this.desc = this.layer.description;
    this.legend = this.layer.legend;
    this.visible = this.layer.visible;
    this.opacity = this.layer.opacity;
  }

  isContinuousSymbol(symbols: GraduatedSymbol[] | ContinuousSymbol): symbols is ContinuousSymbol {
    return symbols && 'palette' in symbols;
  }

  getContinuousGradient(palette: string[]): string {
    if (!Array.isArray(palette) || palette.length === 0) return '';

    // Add hex # if missing
    const formattedColors = palette.map(color =>
      color.startsWith('#') ? color : `#${color}`
    );

    // Create gradient stops
    const stops = formattedColors.map((color, index) => {
      const percent = (index / (formattedColors.length - 1)) * 100;
      return `${color} ${percent}%`;
    });

    return `linear-gradient(to right, ${stops.join(', ')})`;
  }

  onGroupLayerSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    if (this.layer.type === 'layerGroup') {
      this.configService.updateActiveGroupLayer(this.layer.id, selectedId);
    }
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
