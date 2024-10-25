import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { ResourceList } from "../../shared/interfaces/resources";
import { User } from "../../shared/interfaces/user";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

interface ResourceType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  public resources: ResourceList[] = [];
  public filteredResources: ResourceList[] = [];
  public selectedSemester: number | null = null;
  public semesters: number[] = [1, 2, 3, 4, 5, 6];
  public resourceForms: { [key: number]: FormGroup } = {};
  public resourceTypes: ResourceType[] = [];
  public expandedResources: { [key: number]: boolean } = {};
  public searchTerm: string = '';
  public isCreateModalOpen: boolean = false;
  public users: User[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filterResources();
      });
  }

  ngOnInit(): void {
    this.loadResourceTypes();
    this.loadResources();
    this.loadUsers();
  }

  private loadUsers(): void {
    this.apiService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  public getReferentTeacherName(teacherId: number | null | undefined): string {
    if (!teacherId) return 'Aucun référent';
    const teacher = this.users.find(user => user.id === teacherId);
    return teacher ? teacher.username : 'Référent inconnu';
  }


  public toggleCreateModal(): void {
    this.isCreateModalOpen = !this.isCreateModalOpen;
  }

  private loadResourceTypes(): void {
    this.apiService.getResourceTypes().subscribe(
      (types: ResourceType[]) => {
        this.resourceTypes = types;
      },
      error => {
        console.error('Error loading resource types:', error);
      }
    );
  }

  private loadResources(): void {
    this.apiService.getResources().subscribe(
      (response: ResourceList[]) => {
        this.resources = response;
        this.filteredResources = response;
        this.initializeForms();
      },
      error => {
        console.error('Error loading resources:', error);
      }
    );
  }

  private initializeForms(): void {
    this.resources.forEach(resource => {
      this.resourceForms[resource.id] = this.fb.group({
        name: [resource.name],
        resource_type_id: [resource.resource_type_id],
        description: [resource.description],
        ref_teacher_id: [resource.ref_teacher_id], // This should correctly bind to the select input
        semester_id: [resource.semester_id],
        course: [resource.course],
        vol_nat: [resource.vol_nat],
        vol_nat_tp: [resource.vol_nat_tp],
        vol_e: [resource.vol_e],
        vol_ne: [resource.vol_ne]
      });
    });
  }

  public onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  private filterResources(): void {
    let filtered = this.resources;

    if (this.selectedSemester !== null) {
      filtered = filtered.filter(resource =>
        resource.semester_id === this.selectedSemester
      );
    }

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(search) ||
        this.resourceForms[resource.id].get('description')?.value?.toLowerCase().includes(search) ||
        (resource.course && resource.course.toLowerCase().includes(search))
      );
    }

    this.filteredResources = filtered;
  }

  public toggleResource(id: number): void {
    this.expandedResources[id] = !this.expandedResources[id];
  }

  public getResourceTypeName(typeId: number): string {
    const resourceType = this.resourceTypes.find(type => type.id === typeId);
    return resourceType ? resourceType.name : 'Inconnu';
  }

  public filterBySemester(semesterId: number | null): void {
    this.selectedSemester = semesterId;
    this.filterResources();
  }

  public saveChanges(resource: ResourceList): void {
    const updatedData = this.resourceForms[resource.id].value;
    this.apiService.updateResource(resource.id, updatedData).subscribe(
      updatedResource => {
        console.log('Resource updated successfully', updatedResource);
        const index = this.resources.findIndex(r => r.id === resource.id);
        if (index !== -1) {
          this.resources[index] = { ...this.resources[index], ...updatedData };
        }
        this.filterResources();
      },
      error => {
        console.error('Error updating resource:', error);
      }
    );
  }

  logout() {
    this.apiService.logout();  // Déconnecter l'utilisateur via l'API
    this.router.navigate(['/login']); // Rediriger vers la page de login
  }

  deleteResource(resourceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      this.apiService.deleteResource(resourceId).subscribe(
        () => {
          // Remove the deleted resource from filteredResources
          this.filteredResources = this.filteredResources.filter(item => item.id !== resourceId);
          window.location.reload();
        },
        error => {
          console.error('Erreur lors de la suppression de la ressource', error);
          // Optionally handle error (show a message to the user)
        }
      );
    }
  }
}