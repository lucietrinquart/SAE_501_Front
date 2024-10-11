import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from "./pages/user-list/user-list.component";
import {ResourceListComponent} from "./pages/resource-list/resource-list.component";
import {PdfEditorComponent} from "./pages/pdf-editor/pdf-editor.component";


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
    component: PdfEditorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }