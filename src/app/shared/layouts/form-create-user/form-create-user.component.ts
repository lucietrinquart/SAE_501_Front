import { Component } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { User } from "../../interfaces/user";

@Component({
  selector: 'app-form-create-user',
  templateUrl: './form-create-user.component.html',
  styleUrl: './form-create-user.component.scss'
})
export class FormCreateUserComponent {
  users: User[] = [];

  newUser: User = {
    id: 0, // Un id par défaut ou à gérer selon votre logique
    email: '',
    username: '',
    password: '',
    role: 'vacataire',  // valeur par défaut
    max_hour_vol: new Float32Array([0]) // Assignez un tableau avec la valeur 0
  };


  constructor(private apiService: ApiService) {
    this.apiService.requestApi(`/user`)
      .then((response: User[]) => {
        this.users = response;
      });
  }

  onSubmit() {
    console.log("Submitted new semester:", this.newUser);
    this.apiService.requestApi(`/user/create`, 'POST', this.newUser)
      .then(response => {
        alert('Utilisateur a été ajouté avec succès !');
        console.log('Utilisateur créé', response);
      })
      .catch(error => {
        alert('Une erreur est survenue lors de l\'ajout d Utilisateur.');
        console.error('Erreur lors de la création de Utilisateur', error);
      });
  }

}
