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

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public getResources(): Observable<ResourceList[]> {
    const headers = this.getNoCacheHeaders();
    return this.http.get<ResourceList[]>(`${this.apiUrl}/resource`, { headers });
  }

  private getNoCacheHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  public async requestApi(action: string, method: string = 'GET', datas: any = {}, form?: FormGroup, httpOptions: any = {}): Promise<any> {
    const methodWanted = method.toLowerCase();
    const timestamp = new Date().getTime();
    let route = `${this.apiUrl}${action}`;

    // Ajout du timestamp à l'URL pour éviter le cache
    if (methodWanted === 'get' || methodWanted === 'delete') {
      datas = { ...datas, _t: timestamp };
    }

    let req: Observable<any>;

    // Configuration des headers avec no-cache
    if (!httpOptions.headers) {
      httpOptions.headers = this.getNoCacheHeaders();
    } else {
      // Fusionner avec les headers existants
      httpOptions.headers = httpOptions.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
        .set('Pragma', 'no-cache')
        .set('Expires', '0');
    }

    // Création de la requête en fonction de la méthode
    switch (methodWanted) {
      case 'post':
        req = this.http.post(route, datas, httpOptions);
        break;
      case 'patch':
        req = this.http.patch(route, datas, httpOptions);
        break;
      case 'put':
        req = this.http.put(route, datas, httpOptions);
        break;
      case 'delete':
        route = this.applyQueryParams(route, datas);
        req = this.http.delete(route, httpOptions);
        break;
      default:
        route = this.applyQueryParams(route, datas);
        req = this.http.get(route, httpOptions);
        break;
    }

    // Si le formulaire est passé en paramètre, on le met en pending
    if (form) {
      form.markAsPending();
    }

    // On retourne une promesse
    return new Promise((resolve, reject) => {
      req.subscribe({
        next: (data) => {
          if (form) {
            form.enable();
            if (data.message) {
              this.setFormAlert(form, data.message, 'success');
            }
          }
          console.log(`Données reçues pour ${action}:`, data); // Log pour debug
          resolve(data);
          return data;
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erreur pour ${action}:`, error); // Log d'erreur amélioré
          if (form) {
            form.enable();
            if (error.error.message) {
              this.setFormAlert(form, error.error.message, 'error');

              if (error.error.errors) {
                Object.entries(error.error.errors).forEach(([key, value]: [string, any]) => {
                  const keys = key.split('.');
                  let control: any = form;

                  for (let j = 0; j < keys.length; j++) {
                    control = control.controls[keys[j]];
                  }

                  if (control) {
                    if (typeof value === 'string') {
                      control.setErrors({ serverError: value });
                    } else {
                      for (let i = 0; i < value.length; i++) {
                        control.setErrors({ serverError: value[i] });
                      }
                    }
                  }
                });
              }
            } else if (error.error) {
              if (typeof error.error === 'string') {
                this.setFormAlert(form, error.error, 'error');
              }
            } else {
              this.setFormAlert(form, error.message, 'error');
            }
          }
          reject(error);
          return error;
        }
      });
    });
  }

  applyQueryParams(url: string, datas: Record<string, any>) {
    const params = Object.entries(datas)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]: [string, any]) => `${key}=${encodeURIComponent(value)}`) // Ajout de types explicites ici
      .join('&');
      
    return params ? `${url}?${params}` : url;
  }

  setFormAlert(form: FormGroup, message: string, status: 'success' | 'error' | 'warning' | 'info' = 'success') {
    form.setErrors({
      serverError: {
        status: status,
        message: message
      }
    });
  }

  public updateResource(id: number | undefined, data: Partial<ResourceList>): Observable<ResourceList> {
    if (id === undefined) {
      throw new Error('ID is required for updating resource.');
    }
    
    const headers = this.getNoCacheHeaders();
    return this.http.put<ResourceList>(`${this.apiUrl}/resource/update/${id}`, data, { headers });
  }
}