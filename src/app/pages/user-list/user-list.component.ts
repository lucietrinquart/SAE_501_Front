import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
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
  resource: ResourceList[] = [];
  semestre: Semester[] = [];

  // Variable pour stocker le semestre sélectionné
  selectedSemester: number = 1;  // Sélectionne le semestre 1 par défaut

  constructor(private apiService: ApiService) {
    // Appel API pour récupérer les utilisateurs
    this.apiService.requestApi(`/user`)
      .then((response: User[]) => {
        this.users = response;
      });

    // Appel API pour récupérer la charge de travail
    this.apiService.requestApi(`/resource/workload`)
      .then((response: UserWorkload[]) => {
        this.userworkload = response;
      });

    // Appel API pour récupérer les ressources
    this.apiService.requestApi(`/resource`)
      .then((response: ResourceList[]) => {
        this.resource = response;
      });

    // Appel API pour récupérer les semestres
    this.apiService.requestApi(`/semesters`)
      .then((response: Semester[]) => {
        this.semestre = response;
      });
  }

  // Méthode pour changer le semestre sélectionné
  selectSemester(semestreId: number) {
    this.selectedSemester = semestreId;
  }
}
