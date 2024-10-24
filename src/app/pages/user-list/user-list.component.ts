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
  selectedProfessor: number | null = null; // C'est bien un nombre ou null

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

  // Sélection du semestre
  selectSemester(semestreId: number) {
    this.selectedSemester = semestreId;
  }

  // Sélection ou désélection du professeur
  // selectProfessor(userId: number) {
  //   // Vérifie si le selectedProfessor est bien un nombre avant de faire la comparaison
  //   if (this.selectedProfessor === userId) {
  //     this.selectedProfessor = null; // Si on clique sur le même professeur, on désélectionne
  //   } else {
  //     this.selectedProfessor = userId; // Sélectionne le professeur
  //   }
  // }

  // // Méthode pour filtrer les ressources
  // filterResources(resource: ResourceList): boolean {
  //   const semesterMatch = +resource.semester_id === this.selectedSemester;

  //   // Si aucun professeur n'est sélectionné, on retourne juste les ressources du semestre
  //   if (this.selectedProfessor === null) {
  //     return semesterMatch;
  //   }

  //   // Vérifie si le professeur sélectionné a une ressource correspondante
  //   const professorMatch = this.userworkload.some(uw => uw.id_user === this.selectedProfessor && uw.id_resource === resource.id
  //   );
    
  //   // Retourne true seulement si les deux conditions sont vérifiées
  //   return semesterMatch && professorMatch;
  // }
}
