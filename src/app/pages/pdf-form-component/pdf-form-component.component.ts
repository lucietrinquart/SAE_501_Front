import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-pdf-form',
  templateUrl: './pdf-form-component.component.html',
  styleUrls: ['./pdf-form-component.component.scss']
})
export class PdfFormComponent {
  name: string = '';
  email: string = '';

  constructor(private apiService: ApiService) {}

  async onSubmit() {
    try {
      const response = await this.apiService.requestApi('/generate-pdf', 'POST', { name: this.name, email: this.email }, undefined, {}, 'blob');
      
      // Supposons que la réponse est un Blob (PDF)
      const file = new Blob([response], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      // Ouvrir le fichier PDF dans une nouvelle fenêtre
      window.open(fileURL);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
    }
  }
  
}