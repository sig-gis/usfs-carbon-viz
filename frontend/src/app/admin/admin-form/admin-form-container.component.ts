import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/service/layers.interface';
import { AppconfigService } from 'src/app/service/appconfig.service';

@Component({
  selector: 'app-admin',
  template: `
      <app-admin-menu [config]="config$ | async"></app-admin-menu>
      <app-admin-form [config]="config$ | async"></app-admin-form>
  `,
  styles: [
  ]
})
export class AdminFormContainerComponent implements OnInit {

  public config$: Observable<AppConfig> = new Observable<AppConfig>();

  constructor() { }

  configService = inject(AppconfigService);

  ngOnInit(): void {
    this.config$ = this.configService.getConfig();

    //FOR DEBUGING PURPOSE MONITOR DATA STATE
    this.config$.subscribe((config) => {
      console.log(config);
    })

  }

  ngAfterViewInit() {

  }
}

