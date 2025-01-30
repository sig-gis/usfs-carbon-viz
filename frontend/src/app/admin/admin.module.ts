import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminDashboardContainerComponent } from './admin-dashboard/admin-dashboard-container.component';

import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminFormContainerComponent } from './admin-form/admin-form-container.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminMenuComponent,
    AdminViewComponent,
    AdminDashboardComponent,
    AdminDashboardContainerComponent,
    AdminFormComponent,
    AdminFormContainerComponent
  ],
  imports: [
    CommonModule,
    NgxMapLibreGLModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
