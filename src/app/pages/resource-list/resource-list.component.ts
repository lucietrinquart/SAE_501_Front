import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { ResourceList } from "../../shared/interfaces/resources";
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadResourceTypes();
    this.loadResources();
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
        semester_id: [resource.semester_id],
        vol_nat: [resource.vol_nat],
        vol_nat_tp: [resource.vol_nat_tp],
        vol_e: [resource.vol_e],
        vol_ne: [resource.vol_ne]
      });
    });
  }

  public getResourceTypeName(typeId: number): string {
    const resourceType = this.resourceTypes.find(type => type.id === typeId);
    return resourceType ? resourceType.name : 'Inconnu';
  }

  public filterBySemester(semesterId: number | null): void {
    this.selectedSemester = semesterId;
    
    if (semesterId === null) {
      this.filteredResources = this.resources;
    } else {
      this.filteredResources = this.resources.filter(resource =>
        resource.semester_id === semesterId
      );
    }
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
        this.filterBySemester(this.selectedSemester);
      },
      error => {
        console.error('Error updating resource:', error);
      }
    );
  }
}