import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResourceListComponent } from './pages/resource-list/resource-list.component';
import { UserWorkloadComponent } from './pages/user-workload/user-workload.component'; // Assurez-vous que le chemin est correct
import { provideHttpClient } from "@angular/common/http";

import { FormCreateSemesterComponent } from './shared/layouts/form-create-semester/form-create-semester.component';
import { FormCreateResourceComponent } from './shared/layouts/form-create-resource/form-create-resource.component';
import { FormCreateUserComponent } from './shared/layouts/form-create-user/form-create-user.component';
import { FormulaireComponent } from './pages/formulaire/formulaire.component';
import { PageVacataireComponent } from './pages/page-vacataire/page-vacataire.component';


import { DetailUserComponent } from './pages/detail-user/detail-user.component';
import { PdfFormComponent } from './pages/pdf-form-component/pdf-form-component.component';
import { SignaturePadComponent } from './shared/signature-pad/signature-pad.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    UserWorkloadComponent, 
    FormCreateSemesterComponent,
    FormCreateResourceComponent,
    FormCreateUserComponent,
    ResourceListComponent,
    FormulaireComponent,
    PageVacataireComponent,
    DetailUserComponent,
    PdfFormComponent,
    SignaturePadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
