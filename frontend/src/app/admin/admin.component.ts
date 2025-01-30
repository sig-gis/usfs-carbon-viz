import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../service/layers.interface';
import { AppconfigService } from '../service/appconfig.service';

@Component({
  selector: 'app-admin',
  template: `
      <app-admin-menu [config]="config$ | async"></app-admin-menu>
      <app-admin-dashboard [config]="config$ | async"></app-admin-dashboard>
  `,
  styles: [
  ]
})
export class AdminComponent implements OnInit {

  public config$: Observable<AppConfig> = new Observable<AppConfig>();

  constructor() { }

  configService = inject(AppconfigService);

  ngOnInit(): void {
    this.config$ = this.configService.getConfig();

    //FOR DEBUGING PURPOSE MONITOR DATA STATE
    // this.config$.subscribe((config) => {
    //   console.log(config);
    // })

  }

  ngAfterViewInit() {

  }
}

