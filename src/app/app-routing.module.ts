import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import { PdfFormComponent } from './pages/pdf-form-component/pdf-form-component.component';


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
    path: 'pdf',
    component: PdfFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }