import { Component } from '@angular/core';
import { User } from "../../shared/interfaces/user";
import { ApiService } from "../../shared/services/api.service";
import { Router } from "@angular/router";

type NewUser = Omit<User, 'id'> & { id?: number };

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.scss'
})
export class FormulaireComponent {
  users: User[] = [];
  newUser: NewUser = {
    username: '',
    role: '',
    email: '',
    password: ''
  };
  loginUser = {
    username: '',
    role: '',
    email: '',
    password: ''
  };
  isLoginMode = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  register() {
    this.apiService.postApi('/user/create', this.newUser).then((response: User) => {
      console.log('Nouvel utilisateur créé:', response);
      this.users.push(response);
      this.newUser = {
        username: '',
        role: '',
        email: '',
        password: ''
      };
    }).catch(error => {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    });
  }

  login() {
    this.apiService.postApi('/user/login', this.loginUser).then((response: any) => {
      if (response && response.user) {
        console.log('Connexion réussie:', response.user);
        this.router.navigate(['/user']);  // Redirige vers la page utilisateur
      } else {
        console.error('Erreur de connexion:', response.message);
      }
    }).catch(error => {
      console.error('Erreur de connexion:', error);
    });
  }
  }