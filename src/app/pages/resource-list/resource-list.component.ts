import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { ResourceList } from "../../shared/interfaces/resources";

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss'
})
export class ResourceListComponent {
  public resources: ResourceList[] = [];
  public filteredResources: ResourceList[] = [];
  public selectedSemester: number | null = null;
  public semesters: number[] = [1, 2, 3, 4, 5, 6];

  constructor(private apiService: ApiService) {
    this.loadResources();
  }

  private loadResources(): void {
    this.apiService.requestApi(`/resource`)
      .then((response: ResourceList[]) => {
        console.log('API Response:', response);
        this.resources = response;
        this.filteredResources = response;
      })
      .catch(error => {
        console.error('Error loading resources:', error);
      });
  }

  public filterBySemester(semesterId: number | null): void {
    console.log('Filtering by semester:', semesterId);
    this.selectedSemester = semesterId;
    
    if (semesterId === null) {
      this.filteredResources = this.resources;
    } else {
      this.filteredResources = this.resources.filter(resource => 
        resource.semester_id === semesterId
      );
    }
    console.log('Filtered resources:', this.filteredResources);
  }
}