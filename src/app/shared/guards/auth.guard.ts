import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Récupérer l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Vérifier si l'utilisateur est connecté
    if (!user?.id) {
      this.router.navigate(['']);  // Redirection vers la page de login
      return false;
    }

    // Vérifier les rôles
    const requiredRole = route.data['role'];
    const requiredRoles = route.data['roles'];

    // Si la route nécessite un rôle spécifique
    if (requiredRole && user.role !== requiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Si la route accepte plusieurs rôles
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}