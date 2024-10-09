import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']  // Correction de "styleUrl" en "styleUrls"
})
export class UserListComponent {
  users: User[] = [];  // Modifié en tableau de User
  userworkload: UserWorkload[] = [];

  constructor(private apiService: ApiService) {
    // Appel API pour récupérer les utilisateurs
    this.apiService.requestApi(`/prof`)
      .then((response: User[]) => {  // Supposons que l'API retourne un tableau d'utilisateurs
        this.users = response;
      });

    // Appel API pour récupérer la charge de travail de l'utilisateur
    this.apiService.requestApi(`/user_workload`)
      .then((response: UserWorkload[]) => {
        this.userworkload = response;
      });
  }
}
