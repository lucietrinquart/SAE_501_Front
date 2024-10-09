import { Component } from '@angular/core';
import {ApiService} from "./shared/services/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SAE501';

  constructor(
    public apiService: ApiService,
  ) {
  }
}