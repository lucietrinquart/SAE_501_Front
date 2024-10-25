// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Vérifie la validité de la session au démarrage
    this.checkSession();
  }

  // Récupérer l'utilisateur du localStorage
  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Vérifier la validité de la session
  private checkSession() {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const currentTime = new Date().getTime();
      const loginTime = parseInt(loginTimestamp);
      
      if (currentTime - loginTime > 8 * 60 * 60 * 1000) {
        this.logout();
      }
    }
  }

  // Définir l'utilisateur courant
  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loginTimestamp', new Date().getTime().toString());
    this.currentUserSubject.next(user);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === role;
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    this.currentUserSubject.next(null);
  }
}