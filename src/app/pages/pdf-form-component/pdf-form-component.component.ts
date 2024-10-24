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
      const response = await this.apiService.requestApi(
        '/pdf/generate',
        'POST',
        { name: this.name, email: this.email }
      );
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
    }
  }
  
}