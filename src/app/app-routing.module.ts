import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import { UserWorkloadComponent } from './pages/user-workload/user-workload.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserListComponent
  },
  {
    path: 'resource',
    component: ResourceListComponent,
  },
  {
    path: 'user_workload',
    component: UserWorkloadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }