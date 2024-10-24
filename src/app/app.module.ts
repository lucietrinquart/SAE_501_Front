import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component'; // Import du provider
import { ReactiveFormsModule } from '@angular/forms';
import { PdfFormComponent } from './pages/pdf-form-component/pdf-form-component.component'; // Ajoutez cette ligne
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    PdfFormComponent,
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