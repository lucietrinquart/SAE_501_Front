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
    public apiService: ApiService, // Injection d'ApiService
    private sessionTimeoutService: SessionTimeoutService // Injection de SessionTimeoutService
  ) {
    // Démarrer la surveillance de l'activité de l'utilisateur pour la session
    this.sessionTimeoutService.monitorUserActivity();
  }
}
