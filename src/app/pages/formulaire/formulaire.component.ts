import { Component } from '@angular/core';
import { User } from "../../shared/interfaces/user";
import { ApiService } from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";

// Définissons un type pour un nouvel utilisateur
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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
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
      console.error('Erreur lors de la création de l utilisateur:', error);
    });
  }
}