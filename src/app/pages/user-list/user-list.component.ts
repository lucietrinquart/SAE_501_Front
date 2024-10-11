import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
import { ResourceWorkload } from '../../shared/interfaces/resource-workload';

import { ResourceList } from '../../shared/interfaces/resources';
import { Semester } from '../../shared/interfaces/semester';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resourceworkload: ResourceWorkload[] = [];
  resource: ResourceList[] = [];
  semestre: Semester[] = [];

  selectedSemester: number = 1;
  selectedUserId: number | null = null;

  // Ajouter ici la propriété newSemester avec les champs nécessaires
  newSemester: any = {
    number: null,
    name: '',
    nb_td: null,
    nb_tp: null,
  };

  constructor(private apiService: ApiService) {
    this.apiService.requestApi(`/user`)
      .then((response: User[]) => {
        this.users = response;
      });

    this.apiService.requestApi(`/user/workload`)
      .then((response: UserWorkload[]) => {
        this.userworkload = response;
      });

    this.apiService.requestApi(`/resource/workload`)
      .then((response: ResourceWorkload[]) => {
        this.resourceworkload = response;
      });

    this.apiService.requestApi(`/resource`)
      .then((response: ResourceList[]) => {
        this.resource = response;
      });

    this.apiService.requestApi(`/semesters`)
      .then((response: Semester[]) => {
        this.semestre = response;
      });
  }

  selectSemester(semestreId: number) {
    this.selectedSemester = semestreId;
  }

  selectUser(userId: number) {
    // Toggle la sélection de l'utilisateur
    if (this.selectedUserId === userId) {
      this.selectedUserId = null; // Désélectionner
    } else {
      this.selectedUserId = userId; // Sélectionner l'utilisateur
    }
  }

}
