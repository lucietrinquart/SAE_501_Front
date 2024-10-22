import { Component, OnInit } from '@angular/core';
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
export class UserListComponent implements OnInit {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resourceworkload: ResourceWorkload[] = [];
  resource: ResourceList[] = [];
  semestre: Semester[] = [];

  selectedSemester: number = 1;
  selectedProfessor: number | null = null;
  showAllUsers: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  getVisibleUsers() {
    return this.showAllUsers ? this.users.slice(0, 2) : this.users;
  }

  loadData() {
    this.apiService.requestApi(`/user`).then((response: User[]) => {
      this.users = response;
    });

    this.apiService.requestApi(`/resource/workload`).then((response: UserWorkload[]) => {
      this.userworkload = response;
    });

    this.apiService.requestApi(`/resource`).then((response: ResourceList[]) => {
      this.resource = response;
    });

    this.apiService.requestApi(`/semesters`).then((response: Semester[]) => {
      this.semestre = response;
    });
  }

  selectSemester(semestreId: number) {
    this.selectedSemester = semestreId;
    this.selectedProfessor = null;
  }

  toggleProfessor(professorId: number) {
    if (this.selectedProfessor === professorId) {
      this.selectedProfessor = null;
    } else {
      this.selectedProfessor = professorId;
    }
  }


  getFilteredResources() {
    return this.resource.filter(res => {
      const isCorrectSemester = res.semester_id === this.selectedSemester;

      if (!this.selectedProfessor) {
        return isCorrectSemester;
      }

      const hasUserWorkload = this.userworkload.some(workload =>
        workload.user_id === this.selectedProfessor &&
        workload.resource_id === res.id &&
        workload.semester_id === this.selectedSemester
      );

      return isCorrectSemester && hasUserWorkload;
    });
  }

  // Fonction pour calculer la somme des workloads pour un utilisateur donné
  calculateWorkloadSum(userworkloads: any) {
    return userworkloads.vol_cm + userworkloads.vol_td + userworkloads.vol_tp;
  }

  expandedResources: { [key: number]: boolean } = {};

  toggleResource(resourceId: number) {
    if (!this.expandedResources[resourceId]) {
      this.expandedResources[resourceId] = false;
    }
    this.expandedResources[resourceId] = !this.expandedResources[resourceId];
  }
  isResourceExpanded(resourceId: number): boolean {
    return this.expandedResources[resourceId] || false;
  }


  calculateTotalWorkloadSum() {
    let totalSum = 0;
    // Parcourir uniquement les utilisateurs visibles selon l'état de showAllUsers
    for (const user of this.getVisibleUsers()) {
      for (const userworkload of this.userworkload) {
        if (user.id === userworkload.user_id) {
          totalSum += this.calculateWorkloadSum(userworkload);
        }
      }
    }
    return totalSum;
  }

  calculateDifference(vol_nat: number) {
    const totalSum = this.calculateTotalWorkloadSum();

    const validTotalSum = totalSum !== undefined ? totalSum : 0;

    return vol_nat - validTotalSum;
  }

  getVolTpSum(userworkloads: any) {
    return userworkloads.vol_tp;
  }

  getVolTpTotalSum() {
    let totalSum = 0;
    // Parcourir uniquement les utilisateurs visibles selon l'état de showAllUsers
    for (const user of this.getVisibleUsers()) {
      for (const userworkload of this.userworkload) {
        if (user.id === userworkload.user_id) {
          totalSum += this.getVolTpSum(userworkload);
        }
      }
    }
    return totalSum;
  }

  calculateDifferenceTP(vol_nat_tp: number) {
    const totalSum = this.getVolTpTotalSum();

    const validTotalSum = totalSum !== undefined ? totalSum : 0;

    return vol_nat_tp - validTotalSum;
  }




}

document.addEventListener('DOMContentLoaded', () => {
  // Sélectionner le bouton et la div par leur ID
  const toggleAddUserButton = document.getElementById('toggleAddUserButton');
  const addUserDiv = document.getElementById('addUserDiv');

  const toggleCreateResourceButton = document.getElementById('toggleCreateResourceButton');
  const CreateResourceDiv = document.getElementById('CreateResourceDiv');

  const toggleCreateSemesterButton = document.getElementById('toggleCreateSemesterButton');
  const CreateSemesterDiv = document.getElementById('CreateSemesterDiv');

  if (toggleAddUserButton && addUserDiv) {
    toggleAddUserButton.addEventListener('click', () => {
      // Basculer la classe 'hidden' pour afficher ou masquer la div
      addUserDiv.classList.toggle('hidden');
    });
  }

  if (toggleCreateResourceButton && CreateResourceDiv) {
    toggleCreateResourceButton.addEventListener('click', () => {
      // Basculer la classe 'hidden' pour afficher ou masquer la div
      CreateResourceDiv.classList.toggle('hidden');
    });
  }

  if (toggleCreateSemesterButton && CreateSemesterDiv) {
    toggleCreateSemesterButton.addEventListener('click', () => {
      // Basculer la classe 'hidden' pour afficher ou masquer la div
      CreateSemesterDiv.classList.toggle('hidden');
    });
  }

});

