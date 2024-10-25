// session-timeout.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private readonly TIMEOUT_DURATION = 30 * 60 * 1000; // 8 heures en millisecondes
  private timeoutId: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  monitorUserActivity() {
    // Initialiser la surveillance
    this.resetTimer();

    // Écouter la fermeture de la fenêtre
    window.addEventListener('beforeunload', () => {
      this.authService.logout();
    });

    // Écouter la visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.authService.logout();
      }
    });

    // Réinitialiser le timer sur les événements utilisateur
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer());
    });
  }

  private resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.id) {
        this.authService.logout();
        this.router.navigate(['']);
      }
    }, this.TIMEOUT_DURATION);
  }

  stopMonitoring() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}