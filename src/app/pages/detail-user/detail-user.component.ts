import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { User } from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';
import { ResourceList } from '../../shared/interfaces/resources';
import { Semester } from '../../shared/interfaces/semester';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

interface ResourceWithWorkload extends ResourceList {
  workload?: UserWorkload;
  semester?: Semester;
}

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrl: './detail-user.component.scss'
})
export class DetailUserComponent implements OnInit {
  users: User[] = [];
  userworkload: UserWorkload[] = [];
  resources: ResourceList[] = [];
  semestre: Semester[] = [];
  resourcesWithWorkload: ResourceWithWorkload[] = [];
  
  currentUser: User | null = null;
  userId: number | null = null;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUserData();
    });
  }

  loadUserData() {
    if (this.userId) {
      Promise.all([
        this.apiService.requestApi(`/user?ts=${new Date().getTime()}`, 'GET', null),
        this.apiService.requestApi(`/user/workload?ts=${new Date().getTime()}`, 'GET', null),
        this.apiService.requestApi(`/resource?ts=${new Date().getTime()}`, 'GET', null),
        this.apiService.requestApi(`/semesters?ts=${new Date().getTime()}`, 'GET', null)
      ]).then(([users, workloads, resources, semesters]: [User[], UserWorkload[], ResourceList[], Semester[]]) => {
        this.users = users;
        this.userworkload = workloads.filter(w => w.user_id === this.userId);
        this.resources = resources;
        this.semestre = semesters;
        this.currentUser = this.users.find(user => user.id === this.userId) || null;
        
        // Combine resources with their workloads and semesters
        this.resourcesWithWorkload = this.resources.map(resource => {
          const workload = this.userworkload.find(w => 
            w.resource_id === resource.id
          );
          const semester = this.semestre.find(s => 
            s.id === resource.semester_id
          );
          return {
            ...resource,
            workload,
            semester
          };
        }).filter(r => r.workload);
      }).catch(error => {
        console.error('Error loading data:', error);
      });
    }
  }

  // Grouper les ressources par semestre
  getResourcesBySemester() {
    const grouped = new Map<number, ResourceWithWorkload[]>();
    
    this.resourcesWithWorkload.forEach(resource => {
      const semesterId = resource.semester_id;
      if (!grouped.has(semesterId)) {
        grouped.set(semesterId, []);
      }
      grouped.get(semesterId)?.push(resource);
    });
    
    return grouped;
  }

  calculateTotalHours(): { cm: number, td: number, tp: number, total: number } {
    const hours = this.userworkload.reduce((acc, workload) => {
      const cm = workload.vol_cm || 0;
      const td = workload.vol_td || 0;
      const tp = workload.vol_tp || 0;
      
      return {
        cm: acc.cm + cm,
        td: acc.td + td,
        tp: acc.tp + tp,
        total: acc.total + cm + td + tp
      };
    }, { cm: 0, td: 0, tp: 0, total: 0 });
  
    return hours;
  }

  // Calculer le total des heures pour un semestre
  calculateSemesterHours(resources: ResourceWithWorkload[]): { cm: number, td: number, tp: number } {
    return resources.reduce((acc, resource) => {
      const workload = resource.workload || { vol_cm: 0, vol_td: 0, vol_tp: 0 };
      return {
        cm: acc.cm + (workload.vol_cm || 0),
        td: acc.td + (workload.vol_td || 0),
        tp: acc.tp + (workload.vol_tp || 0)
      };
    }, { cm: 0, td: 0, tp: 0 });
  }

  getSemesterName(semesterId: number): string {
    const semester = this.semestre.find(s => s.id === semesterId);
    return semester ? `Semestre ${semester.number}` : 'Semestre inconnu';
  }
}