import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output, inject } from '@angular/core';
import { AppconfigService } from 'src/app/service/appconfig.service';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { AppConfig } from 'src/app/service/layers.interface';
@Component({
  selector: 'app-map-menu',
  templateUrl: './map-menu.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.Default

})

export class MapMenuComponent implements OnInit {

  @Input() config!: AppConfig;
  @Output() styleSelected = new EventEmitter<string>();

  configService = inject(AppconfigService);

  currentTab = 0;

  globalLang = 'id';
  sub = new SubSink();
  showMapStore = false;
  legendVisible = true;
  currentLegend = 'Legenda';
  currentSearch = 'one';
  isLoading = true;


  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
  }

  onLegendChange(newLegend: string) {
    this.currentLegend = newLegend;
  }

  showmapstore() {
    this.showMapStore = true;
    this.legendVisible = false;
  }

  hideMapStore() {
    if (this.showMapStore) {
      this.showMapStore = false;
      this.legendVisible = true;
    }
  }

  clickMenu(tabNumber: number): void {
    if (this.currentTab == tabNumber) {
      this.currentTab = 0;
    } else {
      this.currentTab = tabNumber;
    }
  }

  clickLogout(): void {
    this.sub.add(
      this.authService.getAuthLogout().subscribe({
        next: responseData => {
          if (responseData.status !== undefined && responseData.status === 'success') {
            this.router.navigate(['/auth/login']);
            // this.authService.removeToken();
            // this.authService.removeIdUser();
            localStorage.clear();
          }

          // this.router.navigate(['/']);
        },
        error: responseError => {
          // this.loadingService.hide();
          console.log('Error SERVER response.');
          console.log(responseError);
        }
      })
    );
  }

}
