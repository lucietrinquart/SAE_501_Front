import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
import { ResourceWorkload } from '../../shared/interfaces/resource-workload';

import { ResourceList } from '../../shared/interfaces/resources';
import { Semester } from '../../shared/interfaces/semester';
import { ResourceWithUsers } from '../../shared/interfaces/resource-with-users';

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
  showAllUsers: boolean = false;
  selectedUserId: number | null = null;
  resourcesWithUsers: ResourceWithUsers[] = [];

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

    this.apiService.requestApi(`/user/workload`).then((response: UserWorkload[]) => {
      this.userworkload = response;
    });

    this.apiService.requestApi(`/resource`).then((response: ResourceList[]) => {
      this.resource = response;
    });

    this.apiService.requestApi(`/semesters`).then((response: Semester[]) => {
      this.semestre = response;
    });
  }

  logWorkloadData(userId: number) {
  }
  
  // Modifiez la méthode selectUser pour inclure le débogage
  selectUser(userId: number) {

    // Si l'utilisateur est déjà sélectionné, on le désélectionne
    if (this.selectedUserId === userId) {
      this.selectedUserId = null;
    } else {
      this.selectedUserId = Number(userId); // Conversion explicite en nombre
    }
    
    this.updateResourcesWithUsers();
  }

  private ensureNumber(value: any): number {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }

  updateResourcesWithUsers() {

  
    this.resourcesWithUsers = this.resource
      .filter(resource => {
        // Filtrage par semestre
        const isInSelectedSemester = resource.semester_id === this.selectedSemester;
        
        // Si un utilisateur est sélectionné
        if (this.selectedUserId !== null) {
          // Trouvons tous les workloads pour cet utilisateur et cette ressource
          const userWorkloads = this.userworkload.filter(workload => {
            const userMatch = Number(workload.user_id) === Number(this.selectedUserId);
            const resourceMatch = Number(workload.resource_id) === Number(resource.id);
            const semesterMatch = Number(workload.semester_id) === Number(this.selectedSemester);
          
            
            return userMatch && resourceMatch && semesterMatch;
          });
          
          return isInSelectedSemester && userWorkloads.length > 0;
        }
        
        return isInSelectedSemester;
      })
      .map(resource => {
        // Pour chaque ressource, on récupère les workloads correspondants
        const relevantWorkloads = this.userworkload.filter(workload => {
          const resourceMatch = Number(workload.resource_id) === Number(resource.id);
          const semesterMatch = Number(workload.semester_id) === Number(this.selectedSemester);
          const userMatch = this.selectedUserId === null || 
                           Number(workload.user_id) === Number(this.selectedUserId);
          
          return resourceMatch && semesterMatch && userMatch;
        });
  
        // On transforme ces workloads en données utilisateur
        const usersForResource = relevantWorkloads.map(workload => {
          const user = this.users.find(u => Number(u.id) === Number(workload.user_id));
          
          return {
            id: workload.user_id,
            username: user?.username || 'Utilisateur inconnu',
            workload: {
              vol_cm: workload.vol_cm || 0,
              vol_td: workload.vol_td || 0,
              vol_tp: workload.vol_tp || 0
            }
          };
        });
  
        return {
          id: resource.id,
          name: resource.name,
          users: usersForResource
        };
      });
  
  }


  selectSemester(semesterId: number) {
    this.selectedSemester = semesterId;
    this.updateResourcesWithUsers();
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUserId === userId;
  }



  getFilteredResources() {
    return this.resource.filter(res => {
      const isCorrectSemester = res.semester_id === this.selectedSemester;



      const hasUserWorkload = this.userworkload.some(workload =>
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
        if (user.id === userworkload.id) {
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
        if (user.id === userworkload.id) {
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


