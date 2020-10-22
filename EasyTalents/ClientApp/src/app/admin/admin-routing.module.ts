import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { ListComponent } from './list/list.component';
import { DetailsByIdComponent } from './detailsById/detailsById.component';
import { requiredRole } from '../constants';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthorizeGuard],
    canActivateChild: [AuthorizeGuard],
    data: {
      allowedRoles: [requiredRole]
    },
    children: [
      { path: '', redirectTo: 'profiles', pathMatch: 'full' },
      { path: 'details/:id', component: DetailsByIdComponent },
      { path: 'profiles', component: ListComponent },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
