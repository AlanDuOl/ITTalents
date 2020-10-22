import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { PageLoaderModule } from '../page-loader/page-loader.module';
import { ListComponent } from './list/list.component';
import { DetailsByIdComponent } from './detailsById/detailsById.component';


@NgModule({
  declarations: [
    ListComponent,
    DetailsByIdComponent,
  ],
  imports: [
    CommonModule,
    PageLoaderModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
