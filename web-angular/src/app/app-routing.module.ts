import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessesComponent } from './businesses/businesses.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'businesses', component: BusinessesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
