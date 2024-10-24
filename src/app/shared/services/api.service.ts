import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResourceList } from '../interfaces/resources';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  public getBaseUrl(): string {
    return 'http://localhost:8000/api';
  }

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public postApi(endpoint: string, data: any): Promise<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, data).toPromise();
  }

  public getResources(): Observable<ResourceList[]> {
    const headers = this.getNoCacheHeaders();
    return this.http.get<ResourceList[]>(`${this.apiUrl}/resource`, { headers });
  }

  public getResourceTypes(): Observable<any[]> {
    const headers = this.getNoCacheHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/resource/types`, { headers });
  }

  public updateResource(id: number | undefined, data: Partial<ResourceList>): Observable<ResourceList> {
    if (id === undefined) {
      throw new Error('ID is required for updating resource.');
    }

    const headers = this.getNoCacheHeaders();
    return this.http.put<ResourceList>(`${this.apiUrl}/resource/update/${id}`, data, { headers });
  }

  public async requestApi(
    action: string,
    method: string = 'GET',
    data: Record<string, any> | null = null, // Accepte null
    form?: FormGroup,
    httpOptions: any = {}
  ): Promise<any> {
    const methodWanted = method.toLowerCase();
    const timestamp = new Date().getTime();
    let route = `${this.apiUrl}${action}`;
  
    // Créez un objet vide si data est null pour éviter les erreurs plus tard
    const requestData: Record<string, any> = data ?? {};
  
    // Ajout du timestamp pour éviter le cache sur GET et DELETE
    if (methodWanted === 'get' || methodWanted === 'delete') {
      (requestData as any)._t = timestamp;  // Utilisation d'une assertion de type
    }
  
    // Configuration des headers
    if (!httpOptions.headers) {
      httpOptions.headers = this.getNoCacheHeaders();
    } else {
      httpOptions.headers = httpOptions.headers
        .set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
        .set('Pragma', 'no-cache')
        .set('Expires', '0');
    }
  
    let req: Observable<any>;
  
    // Création de la requête selon la méthode
    switch (methodWanted) {
      case 'post':
        req = this.http.post(route, requestData, httpOptions);
        break;
      case 'patch':
        req = this.http.patch(route, requestData, httpOptions);
        break;
      case 'put':
        req = this.http.put(route, requestData, httpOptions);
        break;
      case 'delete':
        route = this.applyQueryParams(route, requestData);
        req = this.http.delete(route, httpOptions);
        break;
      default: // GET
        route = this.applyQueryParams(route, requestData);
        req = this.http.get(route, httpOptions);
        break;
    }
  
    // Gestion du formulaire si présent
    if (form) {
      form.markAsPending();
    }
  
    // Retour de la promesse avec gestion des erreurs
    return new Promise((resolve, reject) => {
      req.subscribe({
        next: (response) => {
          if (form) {
            form.enable();
            if (response.message) {
              this.setFormAlert(form, response.message, 'success');
            }
          }
          resolve(response);
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erreur pour ${action}:`, error);
          
          if (form) {
            form.enable();
            
            if (error.error.message) {
              this.setFormAlert(form, error.error.message, 'error');
            }
  
            if (error.error.errors) {
              Object.entries(error.error.errors).forEach(([key, value]: [string, any]) => {
                const keys = key.split('.');
                let control: any = form;
  
                for (const k of keys) {
                  control = control.controls[k];
                }
  
                if (control) {
                  if (typeof value === 'string') {
                    control.setErrors({ serverError: value });
                  } else if (Array.isArray(value)) {
                    control.setErrors({ serverError: value[0] });
                  }
                }
              });
            }
          }
          reject(error);
        }
      });
    });
  }
  

  private getNoCacheHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  private applyQueryParams(url: string, params: Record<string, any>): string {
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
      
    return queryParams ? `${url}?${queryParams}` : url;
  }

  private setFormAlert(
    form: FormGroup, 
    message: string, 
    status: 'success' | 'error' | 'warning' | 'info' = 'success'
  ): void {
    form.setErrors({
      serverError: {
        status,
        message
      }
    });
  }
}
