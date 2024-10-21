import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResourceList} from '../interfaces/resources';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  postApi(endpoint: string, data: any): Promise<any> {
    return this.http.post(`${this.apiUrl}${endpoint}`, data).toPromise();
  }

  public getResources(): Observable<ResourceList[]> {
    return this.http.get<ResourceList[]>(`${this.apiUrl}/resource`);
  }

  public getResourceTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resource/types`);
  }

  public async requestApi(action: string, method: string = 'GET', datas: any = {}, form?: FormGroup, httpOptions: any = {}): Promise<any> {
    const methodWanted = method.toLowerCase();
    let route = environment.apiUrl + action;

    var req: Observable<any>;

    if (httpOptions.headers === undefined) {
      httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }

    switch (methodWanted) {
      case 'post':
        req = this.http.post(route, datas, httpOptions);
        break;
      case 'patch':
        req = this.http.post(route, datas, httpOptions);
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

    if(form){
      form.markAsPending();
    }

    return new Promise((resolve, reject) => {
      req.subscribe({
        next: (data) => {
          if (form){
            form.enable();
            if(data.message){
              this.setFormAlert(form, data.message, 'success');
            }
          }
          resolve(data);
          return data;
        },
        error : (error: HttpErrorResponse) => {
          console.log('Http Error : ', error);
          if(form){
            form.enable();
            if (error.error.message) {
              this.setFormAlert(form, error.error.message, 'error');

              if(error.error.errors){
                Object.entries(error.error.errors).forEach((entry: [string, any]) => {
                  const [key, value] = entry;
                  const keys = key.split('.');
                  let control: any = form;

                  for (let j = 0; j < keys.length; j++) {
                    control = control.controls[keys[j]];
                  }

                  if(control) {
                    if(typeof value === 'string'){
                      control.setErrors({serverError: value});
                    }else{
                      for (let i = 0; i < value.length; i++) {
                        control.setErrors({serverError: value[i]});
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
      })
    });
  }

  applyQueryParams(url: string, datas: any){
    return url + '?' + Object.keys(datas).map((key) => {
      return key + '=' + datas[key];
    }).join('&');
  }

  setFormAlert(form: FormGroup, message: string, status: 'success' | 'error' | 'warning' | 'info' = 'success'){
    form.setErrors({
      serverError : {
        status: status,
        message: message
      }
    })
  }

  public updateResource(id: number, data: Partial<ResourceList>): Observable<ResourceList> {
    return this.http.put<ResourceList>(`${this.apiUrl}/resource/update/${id}`, data);
  }
}