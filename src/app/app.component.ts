// app.component.ts
import { Component } from '@angular/core';
import { ApiService } from "./shared/services/api.service";
import { SessionTimeoutService } from './shared/services/session-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SAE501';

  constructor(
    public apiService: ApiService,
    private sessionTimeoutService: SessionTimeoutService
  ) {
    // Démarrer la surveillance de l'activité de l'utilisateur
    this.sessionTimeoutService.monitorUserActivity();
  }
}