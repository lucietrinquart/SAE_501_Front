// formulaire.component.ts
import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Router } from "@angular/router";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss']
})
export class FormulaireComponent {
  loginUser = {
    username: '',
    password: ''
  };
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (!this.loginUser.username || !this.loginUser.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    this.apiService.postApi('/user/login', this.loginUser)
      .then((response: any) => {
        if (response && response.user) {
          // Stocke le token si présent dans la réponse
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // Stocke l'utilisateur dans le service d'auth
          this.authService.setCurrentUser(response.user);
          
          // Redirige selon le rôle
          switch(response.user.role.toLowerCase()) {
            case 'admin':
              this.router.navigate(['/user']);
              break;
            case 'enseignant':
              this.router.navigate(['/user']);
              break;
            case 'vacataire':
              this.router.navigate(['/vacataire']);
              break;
            default:
              this.router.navigate(['/unauthorized']);
          }
        } else {
          this.errorMessage = 'Réponse du serveur invalide';
        }
      })
      .catch(error => {
        this.errorMessage = error.status === 401 
          ? 'Identifiants incorrects' 
          : 'Erreur de connexion';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}