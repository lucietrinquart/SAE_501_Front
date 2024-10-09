import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component'; // Import du provider

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }