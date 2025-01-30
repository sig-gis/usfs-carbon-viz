import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { Page404Component } from './components/page404.component';


@NgModule({
  declarations: [Page404Component],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
