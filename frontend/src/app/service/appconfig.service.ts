import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { AppConfig, ConfigLayer, MapConfig, Analysis } from './layers.interface';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Map } from 'maplibre-gl';
import { EarthEngineService } from './ee/ee.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {
  layerconfig: AppConfig = {
    highlight: [],
    analysis: [],
    mapConfig: {
      style: "https://api.maptiler.com/maps/winter-v2/style.json?key=TUeJmK9d5lh6wwNUyq6u",
      cursor: "crosshair",
      zoom: [6],
      center: [40.034319079065874, -98.63567370723634],
    },
    layers: []
  };

  constructor(private httpClient: HttpClient, private eeService: EarthEngineService) { }

  private config$ = new BehaviorSubject<AppConfig>(this.layerconfig);

  public getConfig(map_code: any = ""): Observable<AppConfig> {
    const staticConfig: AppConfig = {
      highlight: [],
      analysis: [],
      mapConfig: {
        style: "https://api.maptiler.com/maps/winter-v2/style.json?key=TUeJmK9d5lh6wwNUyq6u",
        cursor: "crosshair",
        zoom: [6],
        center: [40.034319079065874, -98.63567370723634],
      },
      layers: [
        {
          id: "fire_instensity_level_1",
          title: "Fire Intensity Level 1 (<2 feet)",
          description: "Area with fire intensity level 1 (<2 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP1"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 1 (<2 feet)", color: "#ffb3b3"}
          ],
          placed_before: "",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', 'ffb3b3']
          }
        },
        {
          id: "fire_instensity_level_2",
          title: "Fire Intensity Level 2 (2-4 feet)",
          description: "Area with fire intensity level 2 (2-4 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP2"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 2 (2-4 feet)", color: "#ff8080"}
          ],
          placed_before: "fire_instensity_level_1",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', 'ff8080']
          }
        },
        {
          id: "fire_instensity_level_3",
          title: "Fire Intensity Level 3 (4-6 feet)",
          description: "Area with fire intensity level 3 (4-6 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP3"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 3 (4-6 feet)", color: "#ff4d4d"}
          ],
          placed_before: "fire_instensity_level_2",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', 'ff4d4d']
          }
        },
        {
          id: "fire_instensity_level_4",
          title: "Fire Intensity Level 4 (6-8 feet)",
          description: "Area with fire intensity level 4 (6-8 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP4"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 4 (6-8 feet)", color: "#ff1a1a"}
          ],
          placed_before: "fire_instensity_level_3",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', 'ff1a1a']
          }
        },
        {
          id: "fire_instensity_level_5",
          title: "Fire Intensity Level 5 (8-12 feet)",
          description: "Area with fire intensity level 5 (8-12 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP5"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 5 (8-12 feet)", color: "#cc0000"}
          ],
          placed_before: "fire_instensity_level_3",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', 'cc0000']
          }
        },
        {
          id: "fire_instensity_level_6",
          title: "Fire Intensity Level 6 (>12 feet)",
          description: "Area with fire intensity level 6 (>12 feet)",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Climate_Change_FSIM/Fire_Intensity_Level/CC_FLP6"
          ],
          visible: false,
          group: "atr",
          opacity: 0.9,
          legend: [
            { value: "Fire Intensity Level 6 (8-12 feet)", color: "#800000"}
          ],
          placed_before: "fire_instensity_level_5",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 1,
            "palette": ['FFFFFFFF', '800000']
          }
        },
        {
          id: "carbon_emissions_byfl",
          title: "Carbon Emissions by Flame Length",
          description: "Conditional carbon emissions by flame length",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"
          ],
          visible: true,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#ffffcc" },
            { value: "Legend Item 2", color: "#e48751" },
            { value: "Legend Item 3", color: "#1a1a01" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 25,
            "palette": ['ffffcc','fbec9a','f4cc68','eca855','e48751','d2624d','a54742','73382f','422818','1a1a01']
          }
        },
        {
          id: "expected_annual_carbon_emissions",
          title: "Expected Annual Carbon Emissions",
          description: "Expected annual carbon emissions",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Carbon/Emissions/TM2014_Carbon_Emissions"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#ffffcc" },
            { value: "Legend Item 2", color: "#e48751" },
            { value: "Legend Item 3", color: "#1a1a01" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "carbon_emissions_byfl",
          eeVisParams: {
            "bands": ['b7'],
            "min": 0,
            "max": 0.2,
            "palette": ['ffffcc','fbec9a','f4cc68','eca855','e48751','d2624d','a54742','73382f','422818','1a1a01']
          }
        },{
          id: "carbon_remaining_byfl",
          title: "Carbon Remaining by Flame Length",
          description: "Conditional carbon remaining by flame length",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#c4ea67" },
            { value: "Legend Item 2", color: "#60927b" },
            { value: "Legend Item 3", color: "#1a33b3" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "expected_annual_carbon_emissions",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 200,
            "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
          }
        },{
          id: "expected_carbon_remaining",
          title: "Expected Annual Carbon Remaining",
          description: "Expected annual conditional carbon remaining",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Carbon/Remaining/TM2014_Carbon_Remaining"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#c4ea67" },
            { value: "Legend Item 2", color: "#60927b" },
            { value: "Legend Item 3", color: "#1a33b3" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "carbon_remaining_byfl",
          eeVisParams: {
            "bands": ['b7'],
            "min": 0,
            "max": 200,
            "palette": ['c4ea67', '98cb6d', '7bae74', '60927b', '497b85', '396b94', '2e599f', '1a33b3']
          }
        },
        {
          id: "rangeland_expected_carbon_loss",
          title: "Rangeland Expected Carbon Loss",
          description: "Expected annual rangeland carbon loss",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_annual_expected_carbon_loss"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#c4ea67" },
            { value: "Legend Item 2", color: "#60927b" },
            { value: "Legend Item 3", color: "#1a33b3" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "expected_carbon_remaining",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 0.1,
            "palette": ['006400', '32a852', 'f5e663', 'ff8000', 'ff4000', '8b0000']
          }
        },
        {
          id: "rangeland_total_carbon_preburn",
          title: "Rangeland Total Carbon Pre-Burn",
          description: "Total carbon rangeland pre-burn",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_total_c_preburn"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#c4ea67" },
            { value: "Legend Item 2", color: "#60927b" },
            { value: "Legend Item 3", color: "#1a33b3" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "rangeland_expected_carbon_loss",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 0.5,
            "palette": ['ccffcc', '99e699', '66b266', '338033', '1a661a', '004d00']
          }
        },
        {
          id: "rangeland_total_carbon_postburn",
          title: "Rangeland Total Carbon Post Burn",
          description: "Total carbon rangeland post burn",
          type: "eeTiles",
          url: [
            "projects/usfs-carbon-viz-test/assets/Rangeland/rangeland_total_c_postburn"
          ],
          visible: false,
          group: "dataAset",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#c4ea67" },
            { value: "Legend Item 2", color: "#60927b" },
            { value: "Legend Item 3", color: "#1a33b3" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "rangeland_total_carbon_preburn",
          eeVisParams: {
            "bands": ['b1'],
            "min": 0,
            "max": 0.5,
            "palette": ['ccffcc', '99e699', '66b266', '338033', '1a661a', '004d00']
          }
        },
        {
          id: "ALSTK",
          title: "All Tree Stock",
          description: "Analysis Buffer 50 meter",
          type: "eeTiles",
          url: [
            "USFS/GTAC/TreeMap/v2016/TreeMap2016"
          ],
          visible: false,
          group: "utility",
          opacity: 0.9,
          legend: [
            { value: "Legend Item 1", color: "#ffe599" },
            { value: "Legend Item 2", color: "#e7cd68" },
            { value: "Legend Item 3", color: "#c5ae32" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "expected_annual_carbon_emissions",
          eeVisParams: {
            "bands": ['ALSTK'],
            "min": 0,
            "max": 100,
            "palette": ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d'] // Example palette
          }
        }, {
          id: "treemap_id",
          title: "TreeMap ID",
          description: "Analysis Buffer 50 meter",
          type: "eeTiles",
          url: [
            "USFS/GTAC/TreeMap/v2016/TreeMap2016"
          ],
          visible: false,
          group: "utility",
          opacity: 0.9,
          legend: [
            { value: "Legend Item1", color: "#4ad7f0" },
            { value: "Legend Item2", color: "#e34a33" },
            { value: "Legend Item3", color: "#fdcc8a" }
          ],
          placed_before: "ALSTK",
          eeVisParams: {
            "bands": ['Value'],
            "min": 0,
            "max": 1000,
            "palette": ['00404d', '134b42', '265737', '3a652a', '52741c', '71870b', '969206', 'c5ae32', 'e7cd68', 'ffe599'] // Example palette
          }
        }, {
          id: "BALIVE",
          title: "Live Tree Basal Area",
          description: "Live Tree Basal Area (ft²)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          legend: [
            { value: "Legend Item 1", color: "#ffe599" },
            { value: "Legend Item 2", color: "#e7cd68" },
            { value: "Legend Item 3", color: "#c5ae32" },
            { value: "Legend Item 4", color: "#969206" },
            { value: "Legend Item 5", color: "#71870b" },
            { value: "Legend Item 6", color: "#52741c" },
            { value: "Legend Item 7", color: "#3a652a" },
            { value: "Legend Item 8", color: "#265737" },
            { value: "Legend Item 9", color: "#134b42" },
            { value: "Legend Item 10", color: "#00404d" }
          ],
          placed_before: "treemap_id",
          eeVisParams: {
            bands: ['BALIVE'],
            min: 24,
            max: 217,
            palette: ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d']
          }
        },
        {
          id: "CARBON_D",
          title: "Carbon, Standing Dead",
          description: "Carbon, Standing Dead (tons/acre)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          legend: [
            { value: "Legend Item 1", color: "#ffffcc" },
            { value: "Legend Item 2", color: "#fbec9a" },
            { value: "Legend Item 3", color: "#f4cc68" },
            { value: "Legend Item 4", color: "#eca855" },
            { value: "Legend Item 5", color: "#e48751" },
            { value: "Legend Item 6", color: "#d2624d" },
            { value: "Legend Item 7", color: "#a54742" },
            { value: "Legend Item 8", color: "#73382f" },
            { value: "Legend Item 9", color: "#422818" },
            { value: "Legend Item 10", color: "#1a1a01" }
          ],
          placed_before: "BALIVE",
          eeVisParams: {
            bands: ['CARBON_D'],
            min: 0,
            max: 9,
            palette: ['1a1a01', '422818', '73382f', 'a54742', 'd2624d', 'e48751', 'eca855', 'f4cc68', 'fbec9a', 'ffffcc']
          }
        }, {
          id: "CARBON_DWN",
          title: "Carbon, Down Dead",
          description: "Carbon, Down Dead (tons/acre)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "CARBON_D",
          eeVisParams: {
            bands: ['CARBON_DWN'],
            min: 0,
            max: 7,
            palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
          }
        },
        {
          id: "CARBON_L",
          title: "Carbon, Live Above Ground",
          description: "Carbon, Live Above Ground (tons/acre)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "CARBON_DWN",
          eeVisParams: {
            bands: ['CARBON_L'],
            min: 2,
            max: 59,
            palette: ['1a1a01', '422818', '73382f', 'a54742', 'd2624d', 'e48751', 'eca855', 'f4cc68', 'fbec9a', 'ffffcc']
          }
        },
        {
          id: "DRYBIO_D",
          title: "Dry Standing Dead Tree Biomass",
          description: "Dry Standing Dead Tree Biomass, Above Ground (tons/acre)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "CARBON_L",
          eeVisParams: {
            bands: ['DRYBIO_D'],
            min: 0,
            max: 10,
            palette: ['ffffcc', 'fbec9a', 'f4cc68', 'eca855', 'e48751', 'd2624d', 'a54742', '73382f', '422818', '1a1a01']
          }
        },
        {
          id: "DRYBIO_L",
          title: "Dry Live Tree Biomass",
          description: "Dry Live Tree Biomass, Above Ground (tons/acre)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "DRYBIO_D",
          eeVisParams: {
            bands: ['DRYBIO_L'],
            min: 4,
            max: 118,
            palette: ['1a1a01', '422818', '73382f', 'a54742', 'd2624d', 'e48751', 'eca855', 'f4cc68', 'fbec9a', 'ffffcc']
          }
        },
        {
          id: "GSSTK",
          title: "Growing-Stock Stocking",
          description: "Growing-Stock Stocking (percent)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "DRYBIO_L",
          eeVisParams: {
            bands: ['GSSTK'],
            min: 0,
            max: 100,
            palette: ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d']
          }
        },
        {
          id: "QMD_RMRS",
          title: "Stand Quadratic Mean Diameter",
          description: "Stand Quadratic Mean Diameter (in)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "GSSTK",
          eeVisParams: {
            bands: ['QMD_RMRS'],
            min: 2,
            max: 25,
            palette: ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d']
          }
        },
        {
          id: "SDIPCT_RMRS",
          title: "Stand Density Index",
          description: "Stand Density Index (percent of maximum)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "QMD_RMRS",
          eeVisParams: {
            bands: ['SDIPCT_RMRS'],
            min: 6,
            max: 99,
            palette: ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d']
          }
        },
        {
          id: "STANDHT",
          title: "Height of Dominant Trees",
          description: "Height of Dominant Trees (ft)",
          type: "eeTiles",
          url: ["USFS/GTAC/TreeMap/v2016/TreeMap2016"],
          visible: false,
          group: "utility",
          opacity: 1.0,
          placed_before: "SDIPCT_RMRS",
          eeVisParams: {
            bands: ['STANDHT'],
            min: 23,
            max: 194,
            palette: ['ffe599', 'e7cd68', 'c5ae32', '969206', '71870b', '52741c', '3a652a', '265737', '134b42', '00404d']
          }
        }
        // ...other layers...
      ]
    };

    this.config$.next(staticConfig);

    return this.config$;
  }


  convertEETilesToWMS(layers: ConfigLayer[]): Observable<ConfigLayer[]> {
    const updates = layers.map(layer => {
      if (layer.type === 'eeTiles' && layer.eeVisParams) {
        return this.eeService.getXyzUrl(layer.url[0], layer.eeVisParams).pipe(
          map(xyzUrl => ({
            ...layer,
            url: [xyzUrl],
            type: 'wms'
          }))
        );
      }
      return of(layer);
    });

    return forkJoin(updates);
  }


  getLayerList(): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + '/layers');
  }

  setMap(map: Map): void {
    const currentConfig = this.config$.value;

    this.convertEETilesToWMS(currentConfig.layers).subscribe({
      next: (updatedLayers) => {
        const updatedConfig: AppConfig = {
          ...currentConfig,
          layers: updatedLayers,
          mapInterface: updatedMap,
        };
        this.config$.next(updatedConfig);
      },
      error: (err) => console.error('Error converting EE tiles:', err)
    });

    const updatedMap = { ...currentConfig.mapInterface, map: map }

    const updatedConfig: AppConfig = {
      ...currentConfig,
      mapInterface: updatedMap,
    };

    this.config$.next(updatedConfig);
  }

  public updateConfig(newConfig: AppConfig): void {
    this.config$.next(newConfig);
  }

  public getUpdatedConfig(): Observable<any> {
    return this.config$;
  }

  public updateVisible(layerId: string): void {
    const currentConfig = this.config$.value;

    const updatedLayers = currentConfig.layers.map((layer, index, array) => {
      // Check if the current layer id matches the provided layerId
      if (layer.id === layerId) {
        // Initialize with the current layer's placed_before value
        let newPlacedBefore = layer.placed_before;

        // Check if there's a layer with placed_before = building whose id is not the current layer's id
        const hasLayerWithBuilding = array.some((item, itemIndex) => item.placed_before === 'building' && itemIndex < index);

        const hasLayerTop = array.some((item, itemIndex) => item.placed_before === "" && itemIndex < index);

        // If there's such a layer and the current layer's placed_before is neither 'building' nor an empty string, update newPlacedBefore
        if ((hasLayerTop && layer.placed_before !== 'building') || hasLayerWithBuilding || (layer.placed_before !== 'building' && layer.placed_before !== '')) {
          // Update the placed_before value to the id of the previous layer if it exists
          if (index > 0) {
            newPlacedBefore = array[index - 1].id;
          }
        }

        return { ...layer, visible: !layer.visible, placed_before: newPlacedBefore };
      }
      return layer;
    });

    const updatedConfig: AppConfig = {
      ...currentConfig,
      layers: updatedLayers,
    };

    this.config$.next(updatedConfig);
  }

  public updateVisible2(layerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer) => {
      if (layer.id === layerId) {
        return { ...layer, visible: !layer.visible };
      }
      return layer;
    });

    const updatedConfig: AppConfig = {
      ...currentConfig,
      layers: updatedLayers,
    };

    this.config$.next(updatedConfig);
  }

  public addHighlight(highlight: ConfigLayer | null): void {
    const currentConfig = this.config$.value;

    // Ensure that analysis is initialized as an empty array if it's undefined
    const highlightArray = currentConfig.highlight || [];

    if (highlight === null) {
      // Clear the array if the highlight is null
      highlightArray.length = 0;
    } else if (highlightArray.length > 0) {
      highlightArray[0] = highlight;
    } else {
      highlightArray.push(highlight);
    }

    const updatedConfig: AppConfig = { ...currentConfig, highlight: highlightArray };
    this.config$.next(updatedConfig);
  }

  public addLayer(layer: ConfigLayer): void {
    const currentConfig = this.config$.value;
    const updatedLayers = [...currentConfig.layers, layer];
    const updatedConfig: AppConfig = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public reorderLayers(map: Map, currentIndex: string, previousIndex: string, movedLayerId: string, beforeLayerid?: string, setBuilding?: string, moveItem?: boolean, setTop?: string): void {
    this

    map.moveLayer(movedLayerId, beforeLayerid);

    // console.log("currentIndex:", currentIndex, "previousIndex:", previousIndex, " movedLayerId:", movedLayerId, " beforeLayerid:", beforeLayerid, "setBuilding", setBuilding, "setTop:", setTop);

    const currentConfig = this.config$.value;
    const prevIndex = currentConfig.layers.findIndex(layer => layer.id === previousIndex);
    const currIndex = currentConfig.layers.findIndex(layer => layer.id === currentIndex);

    // Clone the current layers array to make changes
    const updatedLayers = [...currentConfig.layers];

    // Update the 'placed_before' attribute
    const layerToUpdate = updatedLayers.find(layer => layer.id === movedLayerId);
    if (layerToUpdate) {
      layerToUpdate.placed_before = beforeLayerid;
    }

    if (setBuilding) {
      const newUnderBuilding = updatedLayers.find(layer => layer.id === setBuilding);
      if (newUnderBuilding) {
        newUnderBuilding.placed_before = "building";
      }
    }

    if (setTop) {
      const newTop = updatedLayers.find(layer => layer.id === setBuilding);
      if (newTop) {
        newTop.placed_before = "";
      }
    }

    if (moveItem) {
      if (beforeLayerid == "building") {
        moveItemInArray(updatedLayers, prevIndex, currIndex - 1);
      }
      else {
        moveItemInArray(updatedLayers, prevIndex, currIndex);
      }
    } else {
      moveItemInArray(updatedLayers, prevIndex, currIndex);
    }

    const updatedConfig: AppConfig = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public removeLayerById(layerId: string): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.filter((layer: { id: string; }) => layer.id !== layerId);
    const updatedConfig: any = { ...currentConfig, layers: updatedLayers };
    this.config$.next(updatedConfig);
  }

  public changeOpacity(layerId: string, value: number): void {
    const currentConfig = this.config$.value;
    const updatedLayers = currentConfig.layers.map((layer) => {
      if (layer.id === layerId) {
        return { ...layer, opacity: value };
      }
      return layer;
    });

    const updatedConfig: AppConfig = {
      ...currentConfig,
      layers: updatedLayers,
    };

    this.config$.next(updatedConfig);
  }

  public updateStyle(newStyle: string): void {
    const currentConfig = this.config$.value;
    const updatedMapConfig: MapConfig = {
      ...currentConfig.mapConfig,
      style: newStyle,
    };

    // console.log(currentConfig, "Current Config");

    const updatedConfig: AppConfig = {
      ...currentConfig,
      mapConfig: updatedMapConfig,
    };

    this.config$.next(updatedConfig);
  }

  public updateAnalysis(output: Analysis | null): void {
    const currentConfig = this.config$.value;

    // Ensure that analysis is initialized as an empty array if it's undefined
    const analysisArray = currentConfig.analysis || [];

    if (output === null) {
      // Clear the array if the output is null
      analysisArray.length = 0;
    } else if (analysisArray.length > 0) {
      analysisArray[0] = output;
    } else {
      analysisArray.push(output);
    }

    const updatedConfig: AppConfig = { ...currentConfig, analysis: analysisArray };

    this.config$.next(updatedConfig);
  }

}
