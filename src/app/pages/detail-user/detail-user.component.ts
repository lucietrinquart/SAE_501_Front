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

interface PdfData {
  userData: {
    user: User | null;
    totalHours: {
      cm: number;
      td: number;
      tp: number;
      total: number;
    };
  };
  semesterData: {
    [key: string]: {
      name: string;
      resources: ResourceWithWorkload[];
      hours: {
        cm: number;
        td: number;
        tp: number;
      };
    };
  };
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

  // PFP purpose
  pdfFileId: string | null = null;
  isGenerating: boolean = false;
  errorMessage: string | null = null;

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

  preparePdfData(): PdfData {
    const groupedResources = this.getResourcesBySemester();
    const totalHours = this.calculateTotalHours();
    
    const semesterData: PdfData['semesterData'] = {};
    
    groupedResources.forEach((resources, semesterId) => {
      const semesterName = this.getSemesterName(semesterId);
      const hours = this.calculateSemesterHours(resources);
      
      semesterData[semesterId] = {
        name: semesterName,
        resources: resources,
        hours: hours
      };
    });

    return {
      userData: {
        user: this.currentUser,
        totalHours: totalHours
      },
      semesterData: semesterData
    };
  }

  async onSubmit() {
    try {
      this.isGenerating = true;
      this.errorMessage = null;
      this.pdfFileId = null;

      const pdfData = this.preparePdfData();
      
      const response = await this.apiService.requestApi(
        '/pdf/generate',
        'POST',
        pdfData
      );
      
      if (response && response.file_id) {
        this.pdfFileId = response.file_id;
        console.log('PDF généré avec succès', response);
      } else {
        throw new Error('Identifiant du PDF non reçu');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
      this.errorMessage = "Une erreur est survenue lors de la génération du PDF";
    } finally {
      this.isGenerating = false;
    }
  }

  getPdfUrl(): string {
    return `${this.apiService.getBaseUrl()}/pdf/${this.pdfFileId}`;
  }

  async downloadPdf() {
    if (!this.pdfFileId) return;

    try {
      // Faire une requête vers l'API pour obtenir le PDF
      const response = await fetch(this.getPdfUrl());
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du PDF');
      }

      // Obtenir le blob du PDF
      const blob = await response.blob();
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire et déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `service_${this.currentUser?.username || 'user'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF', error);
      this.errorMessage = "Erreur lors du téléchargement du PDF";
    }
  }

  async viewPdf() {
    if (!this.pdfFileId) return;
    
    try {
      // Ouvrir le PDF dans un nouvel onglet via l'API
      window.open(this.getPdfUrl(), '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du PDF', error);
      this.errorMessage = "Erreur lors de l'ouverture du PDF";
    }
  }
}