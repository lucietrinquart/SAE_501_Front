import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component';
import { UserWorkloadComponent } from './pages/user-workload/user-workload.component';
import { FormCreateSemesterComponent } from './shared/layouts/form-create-semester/form-create-semester.component';
import { FormCreateResourceComponent } from './shared/layouts/form-create-resource/form-create-resource.component';
import { FormCreateUserComponent } from './shared/layouts/form-create-user/form-create-user.component';
import { FormulaireComponent } from './pages/formulaire/formulaire.component';
import { DetailUserComponent } from './pages/detail-user/detail-user.component';
import { PageVacataireComponent } from './pages/page-vacataire/page-vacataire.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavButtonsComponent } from './shared/nav-buttons/nav-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    UserWorkloadComponent,
    FormCreateSemesterComponent,
    FormCreateResourceComponent,
    FormCreateUserComponent,
    FormulaireComponent,
    DetailUserComponent,
    PageVacataireComponent,
    UnauthorizedComponent,
    NavButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    { provide: 'API_URL', useValue: 'http://localhost:8000/api' } // Fournir l'URL de l'API
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
