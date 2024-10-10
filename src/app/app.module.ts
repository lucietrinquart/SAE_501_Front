import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component'; // Import du provider

import { FormsModule } from '@angular/forms';
import { FormCreateSemesterComponent } from './shared/layouts/form-create-semester/form-create-semester.component';



@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    FormCreateSemesterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }