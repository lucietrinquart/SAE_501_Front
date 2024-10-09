import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public async requestApi(action: string, method: string = 'GET', datas: any = {}, form?: FormGroup, httpOptions: any = {}): Promise<any> {

    const methodWanted = method.toLowerCase();
    let route = environment.apiUrl + action;

    //définition de la variable de requête
    var req: Observable<any>;

    //ajout du header si il n'existe pas, on demande du json
    if (httpOptions.headers === undefined) {
      httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }

    // création de la requête en fonction de la méthode
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

    //si le formulaire est passé en paramètre on le met en pending
    if(form){
      form.markAsPending();
    }

    //on retourne une promesse
    return new Promise((resolve, reject) => {
      req.subscribe({
        //si la requête est un succès
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
        //si la requête est un échec
        error : (error: HttpErrorResponse) => {

          console.log('Http Error : ', error);
          if(form){
            form.enable();
            if (error.error.message) {
              this.setFormAlert(form, error.error.message, 'error');

              if(error.error.errors){
                // On parcourt les erreurs pour les affecter aux champs du formulaire concernés
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

  //fonction pour ajouter les paramètres à une url
  applyQueryParams(url: string, datas: any){
    return url + '?' + Object.keys(datas).map((key) => {
      return key + '=' + datas[key];
    }).join('&');
  }

  //fonction pour afficher une alerte sur un formulaire
  setFormAlert(form: FormGroup, message: string, status: 'success' | 'error' | 'warning' | 'info' = 'success'){
    form.setErrors({
      serverError : {
        status: status,
        message: message
      }
    })
  }
}