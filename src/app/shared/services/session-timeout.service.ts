import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service'; // Service d'authentification

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private timeout: any;
  private readonly timeoutDuration = 20 * 60 * 1000; // 30 minutes

  constructor(private apiService: ApiService, private router: Router) {
    this.startTimeout();
  }

  // Redémarre le minuteur d'inactivité
  resetTimeout() {
    clearTimeout(this.timeout);
    this.startTimeout();
  }

  // Démarre le minuteur
  startTimeout() {
    this.timeout = setTimeout(() => {
      this.logout();
    }, this.timeoutDuration);
  }

  // Méthode de déconnexion
  logout() {
    this.apiService.logout();  // Déconnecter l'utilisateur via l'API
    this.router.navigate(['/login']); // Rediriger vers la page de login
  }

  // Écouter les événements utilisateur
  monitorUserActivity() {
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('keydown', () => this.resetTimeout());
  }
}
