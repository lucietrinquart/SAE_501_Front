import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { ResourceList } from "../../shared/interfaces/resources";

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss'
})

export class ResourceListComponent {
  resource: ResourceList[] = [];

  constructor(private apiService: ApiService) {
    // Appel API pour récupérer les utilisateurs
    this.apiService.requestApi(`/resource`)
      .then((response: ResourceList[]) => {  // Supposons que l'API retourne un tableau d'utilisateurs
        this.resource = response;
      });

  }
}
