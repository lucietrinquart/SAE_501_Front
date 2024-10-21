import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
import { ResourceList } from '../../shared/interfaces/resources';
import { Semester } from '../../shared/interfaces/semester';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-workload',
  templateUrl: './user-workload.component.html',
  styleUrls: ['./user-workload.component.scss']
})
export class UserWorkloadComponent implements OnInit {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resources: ResourceList[] = [];
  semestre: Semester[] = [];

  selectedSemester: number = 1;
  selectedProfessor: number | null = null;
  expandedResources: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService, private http: HttpClient) {}

  ngOnInit() {
    this.loadData(); // Charge les données à l'initialisation
    this.setupAutoRefresh(); // Optionnel : met en place un rafraîchissement automatique
  }

  loadData() {
    const timestamp = new Date().getTime();
    
    Promise.all([
        this.apiService.requestApi(`/user?ts=${timestamp}`, 'GET', null),
        this.apiService.requestApi(`/resource/workload?ts=${timestamp}`, 'GET', null),
        this.apiService.requestApi(`/resource?ts=${timestamp}`, 'GET', null),
        this.apiService.requestApi(`/semesters?ts=${timestamp}`, 'GET', null)
    ])
    .then(([users, userworkload, resources, semesters]) => {
        console.log('Utilisateurs:', users);
        console.log('Charge de travail utilisateur:', userworkload);
        console.log('Ressources:', resources);
        console.log('Semestres:', semesters);
        
        this.users = users;
        this.userworkload = userworkload;
        this.resources = resources;
        this.semestre = semesters;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
    });
  }

  getVisibleUsers() {
    return this.selectedProfessor 
      ? this.users.filter(user => user.id === this.selectedProfessor)
      : this.users;
  }

  toggleProfessor(professorId: number) {
    this.selectedProfessor = this.selectedProfessor === professorId ? null : professorId;
    // Retiré : this.loadData(); 
  }

  selectSemester(semesterId: number) {
    this.selectedSemester = semesterId;
    this.selectedProfessor = null;
    // Retiré : this.loadData(); 
  }

  getFilteredResources() {
    return this.resources.filter(res => {
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

  toggleResource(resourceId: number) {
    this.expandedResources[resourceId] = !this.expandedResources[resourceId];
  }

  isResourceExpanded(resourceId: number): boolean {
    return this.expandedResources[resourceId] || false;
  }

  updateWorkload(workloadId: number, field: 'vol_cm' | 'vol_td' | 'vol_tp', value: number) {
    const workload = this.userworkload.find(w => w.id === workloadId);
    if (workload) {
        workload[field] = value; // Met à jour localement avant de soumettre
        const payload = { [field]: value };

        this.apiService.requestApi(`/user/workload/update/${workloadId}`, 'PUT', payload)
            .then(response => {
                console.log('Workload mis à jour:', response);
                // Recharger les données après la mise à jour
                this.loadData();
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du workload:', error);
            });
    }
}

  submitWorkloads() {
    const updatePromises = this.userworkload.map(workload => {
      return this.apiService.requestApi(`/user/workload/update/${workload.id}`, 'PUT', {
        vol_cm: workload.vol_cm,
        vol_td: workload.vol_td,
        vol_tp: workload.vol_tp,
      });
    });

    Promise.all(updatePromises)
      .then(responses => {
        console.log('Tous les workloads ont été mis à jour:', responses);
        // Recharger immédiatement les données après toutes les mises à jour
        this.loadData();
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour des workloads:', error);
      });
  }

  calculateDifference(vol_nat: number) {
    const totalSum = this.getVisibleUsers().reduce((sum, user) => {
      const userWorkload = this.userworkload.find(workload => workload.id === user.id);
      return sum + ((userWorkload?.vol_cm ?? 0) + (userWorkload?.vol_td ?? 0) + (userWorkload?.vol_tp ?? 0));
    }, 0);
    return vol_nat - totalSum;
  }

  calculateDifferenceTP(vol_nat_tp: number) {
    const totalSum = this.getVisibleUsers().reduce((sum, user) => {
      const userWorkload = this.userworkload.find(workload => workload.id === user.id);
      return sum + (userWorkload?.vol_tp ?? 0);
    }, 0);
    return vol_nat_tp - totalSum;
  }
  setupAutoRefresh() {
    // Par exemple, recharger les données toutes les 10 secondes
    setInterval(() => {
        this.loadData(); // Recharger les données à intervalles réguliers
    }, 10000);
}
}