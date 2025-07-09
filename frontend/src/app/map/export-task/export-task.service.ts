import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ExportTask {
  fileId: string;
  band: string;
  title: string;
  status: 'pending' | 'ready' | 'error' | 'deleted';
  downloadUrl?: string;
  taskId: string; 
  geometryType: string;
}

@Injectable({ providedIn: 'root' })
export class ExportTaskService {
  private tasksSubject = new BehaviorSubject<ExportTask[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  addTask(task: ExportTask) {
    const current = this.tasksSubject.value;
    this.tasksSubject.next([...current, task]);
  }

  updateTask(fileId: string, updates: Partial<ExportTask>) {
    const updated = this.tasksSubject.value.map(task =>
      task.fileId === fileId ? { ...task, ...updates } : task
    );
    this.tasksSubject.next(updated);
  }
  getCurrentTasks(): ExportTask[] {
    return this.tasksSubject.value.filter(t => t.status !== 'deleted');
  }

  clearTasks(): void {
    this.tasksSubject.next([]);
  }
  
  removeTask(fileId: string): void {
    const filtered = this.tasksSubject.value.filter(task => task.fileId !== fileId);
    this.tasksSubject.next(filtered);
  }
  
}