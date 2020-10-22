import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { CreateFormComponent } from './create-form/create-form.component';
import { SubmitResultComponent } from './submit-result/submit-result.component';
import { DetailsComponent } from './details/details.component';
import { UpdateFormComponent } from './update-form/update-form.component';

const routes: Routes = [
  {
    path: 'profiles',
    canActivate: [AuthorizeGuard],
    canActivateChild: [AuthorizeGuard],
    children: [
      { path: '', redirectTo: '/profiles/details', pathMatch: 'full' },
      { path: 'update', component: UpdateFormComponent },
      { path: 'create', component: CreateFormComponent },
      { path: 'result', component: SubmitResultComponent },
      { path: 'details', component: DetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule { }
