import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserWorkload } from '../interfaces/user-workload';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public getUserWorkloads(): Observable<UserWorkload[]> {
    return this.http.get<UserWorkload[]>(`${this.apiUrl}/user_workloads`);
  }

  public updateUserWorkload(id: number, data: Partial<UserWorkload>): Observable<{message: string, user_workload: UserWorkload}> {
    return this.http.put<{message: string, user_workload: UserWorkload}>(`${this.apiUrl}/workload/update/${id}`, data);
  }

  // ... other methods ...
}