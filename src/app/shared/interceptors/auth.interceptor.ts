// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajoutez l'utilisateur aux headers si connecté
    if (this.authService.isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}` // Si vous utilisez des JWT
        }
      });
    }
    
    return next.handle(request);
  }
}