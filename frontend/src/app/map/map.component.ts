import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../service/layers.interface';
import { AppconfigService } from '../service/appconfig.service';
import { EarthEngineService } from '../service/ee/ee.service';
import { ExportTaskService, ExportTask } from './export-task/export-task.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  template: `
    <ng-container *ngIf="(config$ | async) as config">
      <app-map-menu [config]="config"></app-map-menu>
      <app-map-view [config]="config"></app-map-view>
    </ng-container>
  `,
  styles: []
})
export class MapComponent implements OnInit, OnDestroy {

  public config$: Observable<AppConfig> = new Observable<AppConfig>();
  configService = inject(AppconfigService);
  pendingTasks: ExportTask[] = [];
  visibilityTriggered = false;

  private authRenewalSubscription?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eeService: EarthEngineService,
    private exportTaskService: ExportTaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const map_code = this.activatedRoute.snapshot.paramMap.get('map_code');

    this.eeService.authenticate().subscribe({
      next: () => {
        this.config$ = this.configService.getConfig(map_code ?? 'tata_ruang');

        // Set up auto-renew authentication every 15 minutes (3000000 ms)
        this.authRenewalSubscription = interval(900000).subscribe(() => {
          this.eeService.authenticate().subscribe({
            next: () => console.log('Earth Engine token renewed'),
            error: err => console.error('Token renewal failed:', err)
          });
        });
      },
      error: err => {
        console.error('Earth Engine authentication failed:', err);
      }
    });

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleUnload);
    this.authRenewalSubscription?.unsubscribe();
  }

  handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      const tasks = this.exportTaskService.getCurrentTasks();
      if (tasks.length > 0) {
        this.pendingTasks = tasks;
        this.visibilityTriggered = true;
      }
    }
  };

  handleUnload = (event: BeforeUnloadEvent): void => {
    const tasks = this.exportTaskService.getCurrentTasks();
    this.pendingTasks = tasks;
    this.pendingTasks.forEach(task => {
      this.http.delete(`${environment.gee_backend_baseurl}/export-delete/${task.fileId}`).subscribe();
      this.http.get(`${environment.gee_backend_baseurl}/export-cancel/${task.taskId}`, {}).subscribe();
    });
    this.exportTaskService.clearTasks();
  };

  handleExitDecision(confirmed: boolean) {
    if (confirmed) {
      this.pendingTasks.forEach(task => {
        this.http.delete(`${environment.gee_backend_baseurl}/export-delete/${task.fileId}`).subscribe();
        this.http.get(`${environment.gee_backend_baseurl}/export-cancel/${task.taskId}`, {}).subscribe();
      });
      this.exportTaskService.clearTasks();
      this.visibilityTriggered = false;
    } else {
      this.visibilityTriggered = false;
    }
  }
}
