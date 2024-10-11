import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component'; // Import du provider
import { ReactiveFormsModule } from '@angular/forms';
import { UserWorkloadComponent } from './pages/user-workload/user-workload.component'; // Ajoutez cette ligne

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    UserWorkloadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }