import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import {UserWorkloadComponent} from "./pages/user-workload/user-workload.component";
import {FormulaireComponent} from "./pages/formulaire/formulaire.component";



const routes: Routes = [
  {
    path: '',
    component: FormulaireComponent
  },
  {
    path: 'user',
    component: UserListComponent
  },
  {
    path: 'resource',
    component: ResourceListComponent,
  },
  {
    path: 'user-workload',
    component: UserWorkloadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }