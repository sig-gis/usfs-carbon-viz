import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppconfigService } from '../service/appconfig.service';
import { EarthEngineService } from '../service/ee/ee.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../service/layers.interface';

@Component({
  selector: 'app-map',
  template: `
      <ng-container *ngIf="(config$ | async) as config">
        <app-map-menu [config]="config"></app-map-menu>
        <app-map-view [config]="config"></app-map-view>
      </ng-container>
  `,
  styles: [
  ]
})
export class MapComponent implements OnInit {

  public config$: Observable<AppConfig> = new Observable<AppConfig>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private eeService: EarthEngineService
  ) { }

  configService = inject(AppconfigService);

  ngOnInit(): void {

    // const map_code = this.activatedRoute.snapshot.paramMap.get('map_code');
    // this.config$ = this.configService.getConfig(map_code == null ? 'tata_ruang' : map_code);
    //     // FOR DEBUGGING PURPOSE MONITOR DATA STATE
    //     this.config$.subscribe((config) => {
    //       console.log(config);
    //     });
    
    const map_code = this.activatedRoute.snapshot.paramMap.get('map_code');
    this.eeService.authenticate().subscribe({
      next: () => {
        this.config$ = this.configService.getConfig(map_code == null ? 'tata_ruang' : map_code);
        // FOR DEBUGGING PURPOSE MONITOR DATA STATE
        this.config$.subscribe((config) => {
          console.log(config);
        });
      },
      error: (err) => {
        console.error('Earth Engine authentication failed:', err);
      }
    });
  }

  ngAfterViewInit() {

  }
}

