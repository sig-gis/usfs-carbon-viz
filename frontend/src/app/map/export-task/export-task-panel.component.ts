import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportTask, ExportTaskService } from './export-task.service';
import { AppConfig } from 'src/app/service/layers.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-export-task-panel',
    templateUrl: './export-task-panel.component.html',
    styleUrls: ['./export-task-panel.component.scss']
})
export class ExportTaskPanelComponent {
    @Input() tasks: ExportTask[] = [];
    @Input() config!: AppConfig;

    constructor(
        private http: HttpClient,
        private exportTaskService: ExportTaskService
    ) { }

    handleDownload(task: ExportTask) {
        if (!task.downloadUrl) return;

        // Trigger the download via a hidden anchor
        const link = document.createElement('a');
        link.href = task.downloadUrl;
        link.target = '_blank';
        link.download = '';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Wait briefly, then call DELETE
        setTimeout(() => {
            this.http.delete(`${environment.gee_backend_baseurl}/export-delete/${task.fileId}`).subscribe({
                next: () => {
                    this.exportTaskService.updateTask(task.fileId, { status: 'deleted' });
                    this.exportTaskService.removeTask(task.fileId);
                },
                error: err => {
                    console.error('Delete failed:', err);
                }
            });
        }, 3000); // wait 3s after triggering download
    }

    handleCancel(task: ExportTask) {
        this.http.delete(`${environment.gee_backend_baseurl}/export-delete/${task.fileId}`).subscribe();
        this.http.get(`${environment.gee_backend_baseurl}/export-cancel/${task.taskId}`, {}).subscribe();
        //   this.exportTaskService.updateTask(task.fileId, { status: 'deleted' });
        this.exportTaskService.removeTask(task.fileId);
    }



}
