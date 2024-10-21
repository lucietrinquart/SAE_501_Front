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

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    UserWorkloadComponent,  // Déclaration ici
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
