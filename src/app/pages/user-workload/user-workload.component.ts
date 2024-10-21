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
    this.loadData();
    this.setupAutoRefresh();
  }

  // Fonctions trackBy
  trackByUser(index: number, user: User): number {
    return user.id;
  }

  trackBySemester(index: number, semester: Semester): number {
    return semester.id;
  }

  trackByResource(index: number, resource: ResourceList): number {
    return resource.id;
  }

  trackByWorkload(index: number, workload: UserWorkload): number {
    return workload.id;
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
        console.log('Données brutes des utilisateurs:', users);
        
        if (Array.isArray(users)) {
            users.forEach(user => {
                console.log('Structure utilisateur:', {
                    id: user.id,
                    username: user.username,
                    role: user.role
                });
            });
        } else {
            console.error('Les données utilisateurs ne sont pas un tableau:', users);
        }
        
        this.users = Array.isArray(users) ? users : [];
        this.userworkload = Array.isArray(userworkload) ? userworkload : [];
        this.resources = Array.isArray(resources) ? resources : [];
        this.semestre = Array.isArray(semesters) ? semesters : [];
        
        // Assure-toi que user_id existe dans la réponse de l'API.
        this.userworkload = this.userworkload.map(workload => ({
            ...workload,
        }));
  
        console.log('Utilisateurs après assignation:', this.users);
        console.log('Workloads après assignation:', this.userworkload);
        
        const userIdToFind = 1; // Remplacez par l'ID que vous cherchez
        const username = this.getUsername(userIdToFind);
        console.log('Nom d\'utilisateur récupéré:', username);
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
    });
  }
  

  getUsersForResourceAndSemester(resourceId: number, semesterId: number) {
    const userIds = this.userworkload
      .filter(workload => workload.resource_id === resourceId && workload.semester_id === semesterId)
      .map(workload => workload.user_id);
    
    console.log('User IDs for Resource and Semester:', userIds); // Ajout d'un log pour vérifier les IDs
    return userIds;
  }

  toggleProfessor(professorId: number) {
    this.selectedProfessor = this.selectedProfessor === professorId ? null : professorId;
  }

  selectSemester(semesterId: number) {
    this.selectedSemester = semesterId;
    this.selectedProfessor = null;
  }

  getFilteredResources() {
    // Récupérer les ressources pour le semestre sélectionné
    const filteredResources = this.resources.filter(res => res.semester_id === this.selectedSemester);
  
    // Associer les workloads aux ressources
    return filteredResources.map(resource => {
      return {
        ...resource,
        workloads: this.getWorkloadsForResource(resource.id) // Ajouter les workloads pour cette ressource
      };
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
      workload[field] = value;
      const payload = { [field]: value };

      this.apiService.requestApi(`/user/workload/update/${workloadId}`, 'PUT', payload)
          .then(response => {
              console.log('Workload mis à jour:', response);
              this.loadData();
          })
          .catch(error => {
              console.error('Erreur lors de la mise à jour du workload:', error);
          });
    }
  }

  submitWorkloads() {
    const updatePromises = this.userworkload.map(workload => {
      return this.apiService.requestApi(`/user/workload/update/${workload.id}`, 'PUT', workload);
    });

    Promise.all(updatePromises)
      .then(responses => {
        console.log('Tous les workloads mis à jour:', responses);
        this.loadData();
      })
      .catch(error => {
        console.error('Erreur lors de la soumission des workloads:', error);
      });
  }

  getUsername(userId: number): string {
    // Affiche l'ID de l'utilisateur recherché
    console.log('Recherche utilisateur - ID:', userId);
    
    // Recherche de l'utilisateur dans la liste des utilisateurs
    const user = this.users.find(u => u.id === userId);
    
    // Vérifie si l'utilisateur a été trouvé
    if (!user) {
      console.warn(`Utilisateur non trouvé pour l'ID: ${userId}`);
      return 'Inconnu'; // Retourne 'Inconnu' si l'utilisateur n'est pas trouvé
    }
    
    // Affiche le nom de l'utilisateur trouvé
    console.log('Utilisateur trouvé:', user);
    return user.username; // Retourne le nom d'utilisateur
  }

  getWorkloadsForResource(resourceId: number) {
    console.log('Workloads pour la ressource:', resourceId, this.userworkload);
    return this.userworkload.filter(workload => 
      workload.resource_id === resourceId && 
      workload.semester_id === this.selectedSemester
    );
  }

  private verifyUserData(userData: any): userData is User {
    return (
      userData &&
      typeof userData.id === 'number' &&
      typeof userData.username === 'string'
    );
  }

  calculateDifference(volumeNational: number, resourceId: number): number {
    const totalVolumeReparti = this.getWorkloadsForResource(resourceId).reduce((acc, workload) => {
      return acc + (workload.vol_cm || 0) + (workload.vol_td || 0) + (workload.vol_tp || 0);
    }, 0);
    return volumeNational - totalVolumeReparti;
  }

  calculateDifferenceTP(volumeNationalTP: number, resourceId: number): number {
    const totalVolumeRepartiTP = this.getWorkloadsForResource(resourceId).reduce((acc, workload) => {
      return acc + (workload.vol_tp || 0);
    }, 0);
    return volumeNationalTP - totalVolumeRepartiTP;
  }

  setupAutoRefresh() {
    setInterval(() => {
      this.loadData();
    }, 60000);
  }

  getUserWorkloadsForResource(resourceId: number) {
    return this.userworkload.filter(workload => workload.resource_id === resourceId);
  }
}
