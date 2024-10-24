import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import {UserWorkloadComponent} from "./pages/user-workload/user-workload.component";
import {FormulaireComponent} from "./pages/formulaire/formulaire.component";
import {DetailUserComponent} from "./pages/detail-user/detail-user.component";
import {PageVacataireComponent} from "./pages/page-vacataire/page-vacataire.component";
import { AuthGuard } from '../app/shared/guards/auth.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';




const routes: Routes = [
  {
    path: '',
    component: FormulaireComponent
  },
  {
    path: 'user',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'enseignant'] }
  },
  {
    path: 'user-detail/:id',
    component: DetailUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'enseignant'] } 
  },
  {
    path: 'resource',
    component: ResourceListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'enseignant']  }
  },
  {
    path: 'vacataire',
    component: PageVacataireComponent,
    canActivate: [AuthGuard],
    data: { role: 'vacataire' }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }