import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pdf-editor',
  template: `
    <pdf-viewer [src]="pdfSrc" [render-text]="true"></pdf-viewer>
    <form (ngSubmit)="onSubmit()">
      <!-- Ajoutez ici les champs de formulaire nécessaires -->
      <button type="submit">Télécharger PDF</button>
    </form>
  `
})
export class PdfEditorComponent implements OnInit {
  pdfSrc: string = '';

  constructor(private http: HttpClient) {
    
  }

  ngOnInit() {
    this.http.get('/api/get-pdf-template', { responseType: 'blob' })
      .subscribe(res => {
        this.pdfSrc = URL.createObjectURL(res);
      });
  }

  onSubmit() {
    // Récupérez les données du formulaire
    const formData = new FormData();
    // Ajoutez les données du formulaire à formData

    this.http.post('/api/generate-pdf', formData, { responseType: 'blob' })
      .subscribe(res => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document_modifie.pdf';
        link.click();
      });
  }
}