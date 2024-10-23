
import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
import { ResourceWorkload } from '../../shared/interfaces/resource-workload';
import { ResourceList } from '../../shared/interfaces/resources';
import { Semester } from '../../shared/interfaces/semester';
import { ResourceWithUsers } from '../../shared/interfaces/resource-with-users';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resources: ResourceList[] = [];
  semestre: Semester[] = [];

  // Nouvelles propriétés pour l'autocomplétion
  searchTerm: string = '';
  showDropdown: boolean = false;
  filteredUsers: User[] = [];

  selectedSemester: number = 1;
  selectedProfessor: number | null = null;
  expandedResources: { [key: number]: boolean } = {};

  newWorkload: { user_id: number | null, vol_cm: number, vol_td: number, vol_tp: number } = {
    user_id: null,
    vol_cm: 0,
    vol_td: 0,
    vol_tp: 0
  };

  constructor(private apiService: ApiService, private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }

  // Nouvelles méthodes pour l'autocomplétion
  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = [];
    }
  }

  selectUser(user: User) {
    this.newWorkload.user_id = user.id;
    this.searchTerm = user.username;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as Element).closest('.relative')) {
      this.showDropdown = false;
    }
  }

  // Méthodes existantes
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
      this.apiService.requestApi(`/user/workload?ts=${timestamp}`, 'GET', null),
      this.apiService.requestApi(`/resource?ts=${timestamp}`, 'GET', null),
      this.apiService.requestApi(`/semesters?ts=${timestamp}`, 'GET', null)
    ])
      .then(([users, userworkload, resources, semesters]) => {
        this.users = Array.isArray(users) ? users : [];
        this.userworkload = Array.isArray(userworkload) ? userworkload : [];
        this.resources = Array.isArray(resources) ? resources : [];
        this.semestre = Array.isArray(semesters) ? semesters : [];

        this.userworkload = this.userworkload.map(workload => ({
          ...workload,
          vol_cm: workload.vol_cm ?? 0,
          vol_td: workload.vol_td ?? 0,
          vol_tp: workload.vol_tp ?? 0
        }));
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }

  getFilteredUserWorkloads(resourceId: number) {
    if (this.selectedProfessor !== null) {
      return this.userworkload.filter(workload =>
        workload.resource_id === resourceId &&
        workload.semester_id === this.selectedSemester &&
        workload.user_id === this.selectedProfessor
      );
    }

    return this.userworkload.filter(workload =>
      workload.resource_id === resourceId &&
      workload.semester_id === this.selectedSemester
    );
  }

  toggleProfessor(professorId: number) {
    this.selectedProfessor = this.selectedProfessor === professorId ? null : professorId;
  }

  selectSemester(semesterId: number) {
    this.selectedSemester = semesterId;
    this.selectedProfessor = null;
  }

  getFilteredResources() {
    return this.resources.filter(res => res.semester_id === this.selectedSemester);
  }

  toggleResource(resourceId: number) {
    this.expandedResources[resourceId] = !this.expandedResources[resourceId];
  }

  isResourceExpanded(resourceId: number): boolean {
    return this.expandedResources[resourceId] || false;
  }

  updateWorkload(workloadId: number, field: 'vol_cm' | 'vol_td' | 'vol_tp', value: number | null) {
    const workload = this.userworkload.find(w => w.id === workloadId);
    if (workload) {
      const numericValue = value ?? 0;
      workload[field] = numericValue;
      const payload = { [field]: numericValue };

      this.apiService.requestApi(`/user/workload/update/${workloadId}`, 'PUT', payload)
        .then(response => {
          console.log('Workload updated:', response);
          this.loadData();
        })
        .catch(error => {
          console.error('Error updating workload:', error);
        });
    }
  }
  submitWorkloads() {
    const updatePromises = this.userworkload.map(workload => {
      const sanitizedWorkload = {
        ...workload,
        vol_cm: workload.vol_cm ?? 0,
        vol_td: workload.vol_td ?? 0,
        vol_tp: workload.vol_tp ?? 0
      };
      return this.apiService.requestApi(`/user/workload/update/${workload.id}`, 'PUT', sanitizedWorkload);
    });

    Promise.all(updatePromises)
      .then(responses => {
        console.log('All workloads updated:', responses);
        this.loadData();
      })
      .catch(error => {
        console.error('Error submitting workloads:', error);
      });
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  getInputValue(event: Event): number {
    const inputElement = event.target as HTMLInputElement;
    return Number(inputElement.value);
  }

  removeFromWorkload(WorkloadId: number) {
    console.log('WorkloadId:', WorkloadId);

    this.apiService.requestApi(`/user/workload/delete/` + WorkloadId, 'DELETE')
      .then(response => {
        console.log('Workload retiré avec succès', response);
        this.loadData();
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du workload:', error);
      });
  }

  submitNewWorkload(ResourceId: number, SemesterId: number) {
    const payload = {
      user_id: this.newWorkload.user_id,
      semester_id: SemesterId,
      resource_id: ResourceId,
      vol_cm: this.newWorkload.vol_cm || 0,
      vol_td: this.newWorkload.vol_td || 0,
      vol_tp: this.newWorkload.vol_tp || 0
    };

    console.log(payload)

    this.apiService.requestApi('/user/workload/create', 'POST', payload)
      .then(response => {
        console.log('Workload créé avec succès:', response);
        this.loadData();
      })
      .catch(error => {
        console.error('Erreur lors de la création du workload:', error);
      });
  }

  calculateResourceTotals(resourceId: number) {
    const workloads = this.getFilteredUserWorkloads(resourceId);
    const resource = this.resources.find(r => r.id === resourceId);
    
    if (!resource) return null;

    const totals = workloads.reduce((acc, workload) => ({
      vol_cm: acc.vol_cm + (workload.vol_cm ?? 0),
      vol_td: acc.vol_td + (workload.vol_td ?? 0),
      vol_tp: acc.vol_tp + (workload.vol_tp ?? 0)
    }), {
      vol_cm: 0,
      vol_td: 0,
      vol_tp: 0
    });

    const totalVolume = totals.vol_cm + totals.vol_td + totals.vol_tp;
    const difference = resource.vol_nat - totalVolume;

    return {
      totalDifference: difference,
      totals: totals
    };
  }

  getTotalDifference(resourceId: number): number {
    const calculations = this.calculateResourceTotals(resourceId);
    return calculations ? calculations.totalDifference : 0;
  }

  calculateResourceTotalsTP(resourceId: number) {
    const workloads = this.getFilteredUserWorkloads(resourceId);
    const resource = this.resources.find(r => r.id === resourceId);
    
    if (!resource) return null;

    const totals = workloads.reduce((acc, workload) => ({
      vol_tp: acc.vol_tp + (workload.vol_tp ?? 0)
    }), {
      vol_tp: 0
    });

    const totalVolume = totals.vol_tp;
    const difference = resource.vol_nat_tp - totalVolume;

    return {
      totalDifference: difference,
      totals: totals
    };
  }

  getTotalDifferenceTP(resourceId: number): number {
    const calculations = this.calculateResourceTotalsTP(resourceId);
    return calculations ? calculations.totalDifference : 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleAddUserButton = document.getElementById('toggleAddUserButton');
  const addUserDiv = document.getElementById('addUserDiv');

  const toggleCreateResourceButton = document.getElementById('toggleCreateResourceButton');
  const CreateResourceDiv = document.getElementById('CreateResourceDiv');

  const toggleCreateSemesterButton = document.getElementById('toggleCreateSemesterButton');
  const CreateSemesterDiv = document.getElementById('CreateSemesterDiv');

  if (toggleAddUserButton && addUserDiv) {
    toggleAddUserButton.addEventListener('click', () => {
      addUserDiv.classList.toggle('hidden');
    });
  }

  if (toggleCreateResourceButton && CreateResourceDiv) {
    toggleCreateResourceButton.addEventListener('click', () => {
      CreateResourceDiv.classList.toggle('hidden');
    });
  }

  if (toggleCreateSemesterButton && CreateSemesterDiv) {
    toggleCreateSemesterButton.addEventListener('click', () => {
      CreateSemesterDiv.classList.toggle('hidden');
    });
  }
});