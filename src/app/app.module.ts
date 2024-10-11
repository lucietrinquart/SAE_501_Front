import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import { UserListComponent } from './pages/user-list/user-list.component';
import { ResourceListComponent } from './pages/resource-list/resource-list.component'; // Import du provider
import { ReactiveFormsModule } from '@angular/forms';
import { PdfEditorComponent } from './pages/pdf-editor/pdf-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ResourceListComponent,
    PdfEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PdfViewerModule,
  ],
  providers: [
    provideHttpClient(), // Ajout du provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }