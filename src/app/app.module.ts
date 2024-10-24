import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResourceListComponent } from './pages/resource-list/resource-list.component';
import { UserWorkloadComponent } from './pages/user-workload/user-workload.component'; // Assurez-vous que le chemin est correct

import { FormCreateSemesterComponent } from './shared/layouts/form-create-semester/form-create-semester.component';
import { FormCreateResourceComponent } from './shared/layouts/form-create-resource/form-create-resource.component';
import { FormCreateUserComponent } from './shared/layouts/form-create-user/form-create-user.component';


import { FormulaireComponent } from './pages/formulaire/formulaire.component';
import { DetailUserComponent } from './pages/detail-user/detail-user.component';
import { PageVacataireComponent } from './pages/page-vacataire/page-vacataire.component'; // Ajoutez cette ligne

import { PdfFormComponent } from './pages/pdf-form-component/pdf-form-component.component'; // Ajoutez cette ligne

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserWorkloadComponent,  // Déclaration ici
    FormCreateSemesterComponent,
    FormCreateResourceComponent,
    FormCreateUserComponent,
    ResourceListComponent,
    FormulaireComponent,
    DetailUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }