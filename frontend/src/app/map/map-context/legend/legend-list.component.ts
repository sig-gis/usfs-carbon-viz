import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';
import {
  AppConfig,
  ConfigLayer,
  Legend,
  LegendItem,
  ContinuousSymbol,
  GraduatedSymbol
} from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { Map } from 'maplibre-gl';

@Component({
  selector: 'app-legend-list',
  templateUrl: './legend-list.component.html',
  styles: []
})
export class LegendListComponent implements OnChanges {
  @Input() layer!: ConfigLayer;
  @Input() config!: AppConfig;
  @Output() legendOrderChanged = new EventEmitter<LegendItem[]>();

  id!: string;
  activeLayerId!: string;
  title!: string;
  desc!: string;
  legend?: Legend;
  visible!: boolean;
  opacity!: number;
  sliderVisible = false;
  tooltipVisible = false;
  mapInterface!: Map | undefined;
  configService = inject(AppconfigService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layer'] && this.layer) {
      this.id = this.layer.id;
      this.title = this.layer.title;
      this.desc = this.layer.description;
      this.legend = this.layer.legend;
      this.visible = this.layer.visible;
      this.opacity = Math.round(this.layer.opacity * 100); // normalize 0–1 to 0–100
      this.activeLayerId = this.layer.activeLayerId || this.layer.id;
    }
  }

  isContinuousSymbol(symbols: GraduatedSymbol[] | ContinuousSymbol): symbols is ContinuousSymbol {
    return symbols && 'palette' in symbols;
  }

  getContinuousGradient(palette: string[]): string {
    if (!Array.isArray(palette) || palette.length === 0) return '';

    const formattedColors = palette.map(color =>
      color.startsWith('#') ? color : `#${color}`
    );

    const stops = formattedColors.map((color, index) => {
      const percent = (index / (formattedColors.length - 1)) * 100;
      return `${color} ${percent}%`;
    });

    return `linear-gradient(to right, ${stops.join(', ')})`;
  }

  onGroupLayerSelect(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;

    if (this.layer.type === 'layerGroup') {
      this.configService.updateActiveGroupLayer(this.layer.id, selectedId);
    }
  }

  toggleSlider(): void {
    this.sliderVisible = !this.sliderVisible;
  }

  toggleTooltip(): void {
    this.tooltipVisible = !this.tooltipVisible;
  }

  onSliderChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.opacity = value;
    const map = this.config?.mapInterface?.map;

    if (map) {
      const style = map.getStyle();
      const layerIds = style?.layers?.map(layer => layer.id) || [];
      this.configService.setLayerOpacity(map, this.activeLayerId, value / 100); 

    } else {
      console.warn("Map or getStyle function is not available.");
    }
  }

  closeLayer(): void {
    this.configService.updateVisible(this.id);
  }
}
