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
     
      if (response.file_id) {
        // 
        const pdfResponse = await this.apiService.requestApi(
          `/pdf/${response.file_id}`, 
          'GET'
        );
        
        const blob = new Blob([pdfResponse], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        window.open(url);

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
    }
  }
  
}