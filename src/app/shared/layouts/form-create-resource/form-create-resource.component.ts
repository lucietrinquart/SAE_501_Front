import { Component } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Semester } from '../../interfaces/semester';
import { User } from "../../interfaces/user";
import { UserWorkload } from '../../interfaces/user-workload';
import { ResourceList } from '../../interfaces/resources';

@Component({
  selector: 'app-form-create-resource',
  templateUrl: './form-create-resource.component.html',
  styleUrl: './form-create-resource.component.scss'
})
export class FormCreateResourceComponent {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resource: ResourceList[] = [];
  semestre: Semester[] = [];

  selectedSemester: number = 1;
  selectedProfessor: number | null = null;

  // Ajouter ici la propriété newSemester avec les champs nécessaires
  newResource = {
    name: '',
    semester_id: null,
    description: '',
    type: '',
    course: '',
    vol_nat: 0,
    vol_nat_tp: 0,
    vol_e: 0,
    vol_ne: 0,
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

  onSubmit() {
    console.log("Submitted new resource:", this.newResource);
    this.apiService.requestApi(`/resource/create`, 'POST', this.newResource)
      .then(response => {
        alert('La resource a été ajoutée avec succès !');
        console.log('resource créée', response);
      })
      .catch(error => {
        alert('Une erreur est survenue lors de l\'ajout de la resource.');
        console.error('Erreur lors de la création de la resource', error);
      });
  }
}
