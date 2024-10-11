import { Component } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Semester } from '../../interfaces/semester';
import { User } from "../../interfaces/user";
import { UserWorkload } from '../../interfaces/user-workload';
import { ResourceList } from '../../interfaces/resources';


@Component({
  selector: 'app-form-create-semester',
  templateUrl: './form-create-semester.component.html',
  styleUrl: './form-create-semester.component.scss'
})
export class FormCreateSemesterComponent {

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