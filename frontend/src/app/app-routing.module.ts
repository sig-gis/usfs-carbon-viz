import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

// load components
import { MapComponent } from './map/map.component';
import { AdminDashboardContainerComponent } from './admin/admin-dashboard/admin-dashboard-container.component';
import { AdminFormContainerComponent } from './admin/admin-form/admin-form-container.component';

import { LoginComponent } from './auth/components/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // CUSTOMER PAGE
  {
    path: 'auth',
    component: LoginComponent,
    loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule),
  },
  {
    path: 'home',
    component: MapComponent,
    canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    loadChildren: () => import('./map/map.module').then(mod => mod.MapModule),
  },
  {
    path: 'home/:map_code',
    component: MapComponent,
    canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    loadChildren: () => import('./map/map.module').then(mod => mod.MapModule),
  },
  // ADMIN PAGE
  {
    path: 'admin',
    component: AdminDashboardContainerComponent,
    canActivate: [RoleGuard], canActivateChild: [RoleGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
  },
  {
    path: 'admin/map_app',
    component: AdminFormContainerComponent,
    canActivate: [RoleGuard], canActivateChild: [RoleGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
  },
  {
    path: 'admin/map_app/:uuid',
    component: AdminFormContainerComponent,
    canActivate: [RoleGuard], canActivateChild: [RoleGuard],
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
  },

  {
    path: 'page',
    loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
  },
  { path: '**', redirectTo: '/page/404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Tell the router to use the hash instead of HTML5 pushstate.
    // useHash: !environment.production,
    useHash: environment.router_hash
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
