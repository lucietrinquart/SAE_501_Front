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

  selectedSemester: number = 1;
  selectedProfessor: number | null = null;

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

    this.apiService.requestApi(`/resource/workload`)
      .then((response: UserWorkload[]) => {
        this.userworkload = response;
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

  // Méthode pour soumettre le formulaire du nouveau semestre
  onSubmit() {
    console.log("Submitted new semester:", this.newSemester);
    this.apiService.requestApi(`/semesters/create`, 'POST', this.newSemester)
      .then(response => {
        alert('Le semestre a été ajouté avec succès !');
        console.log('Semestre créé', response);
      })
      .catch(error => {
        alert('Une erreur est survenue lors de l\'ajout du semestre.');
        console.error('Erreur lors de la création du semestre', error);
      });
  }
}
