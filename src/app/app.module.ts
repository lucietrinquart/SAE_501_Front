import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component'; // Import du provider

import { FormsModule } from '@angular/forms';
import { FormCreateSemesterComponent } from './shared/layouts/form-create-semester/form-create-semester.component';
import { FormCreateResourceComponent } from './shared/layouts/form-create-resource/form-create-resource.component';
import { FormCreateUserComponent } from './shared/layouts/form-create-user/form-create-user.component';


import { ResourceListComponent } from './pages/resource-list/resource-list.component'; // Import du provider
import { ReactiveFormsModule } from '@angular/forms'; // Ajoutez cette ligne



@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    FormCreateSemesterComponent,
    FormCreateResourceComponent,
    FormCreateUserComponent,
    UserListComponent,
    ResourceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }