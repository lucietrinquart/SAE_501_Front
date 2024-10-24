import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import { PdfFormComponent } from './pages/pdf-form-component/pdf-form-component.component';
import {UserWorkloadComponent} from "./pages/user-workload/user-workload.component";
import {FormulaireComponent} from "./pages/formulaire/formulaire.component";
import {DetailUserComponent} from "./pages/detail-user/detail-user.component";
import {PageVacataireComponent} from "./pages/page-vacataire/page-vacataire.component";




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
    path: 'pdf',
    component: PdfFormComponent,
  },
  {
    path: 'user-workload',
    component: UserWorkloadComponent,
  },
  {
    path: 'vacataire',
    component: PageVacataireComponent,
  },
  { path: 'user-detail/:id', 
    component: DetailUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }