import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { UserWorkload } from "../../shared/interfaces/user-workload";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-workload',
  templateUrl: './user-workload.component.html',
  styleUrl: './user-workload.component.scss'
})
export class UserWorkloadComponent implements OnInit {
  public userWorkloads: UserWorkload[] = [];
  public filteredWorkloads: UserWorkload[] = [];
  public selectedSemester: number | null = null;
  public workloadForms: { [key: number]: FormGroup } = {};

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUserWorkloads();
  }

  private loadUserWorkloads(): void {
    this.apiService.getUserWorkloads().subscribe(
      (response: UserWorkload[]) => {
        this.userWorkloads = response;
        this.filteredWorkloads = response;
        this.initializeForms();
      },
      error => {
        console.error('Error loading user workloads:', error);
      }
    );
  }

  private initializeForms(): void {
    this.userWorkloads.forEach(workload => {
      this.workloadForms[workload.id] = this.fb.group({
        user_id: [workload.id_user[0].id],
        semester_id: [workload.id_semester[0].id],
        vol_cm: [workload.vol_cm],
        vol_td: [workload.vol_td],
        vol_tp: [workload.vol_tp]
      });
    });
  }

  public filterBySemester(semesterId: number | null): void {
    this.selectedSemester = semesterId;
    
    if (semesterId === null) {
      this.filteredWorkloads = this.userWorkloads;
    } else {
      this.filteredWorkloads = this.userWorkloads.filter(workload =>
        workload.id_semester.some(semester => semester.id === semesterId)
      );
    }
  }

  public saveChanges(workload: UserWorkload): void {
    const updatedData = this.workloadForms[workload.id].value;
    this.apiService.updateUserWorkload(workload.id, updatedData).subscribe(
      response => {
        console.log(response.message);
        // Update the workload in the local array
        const index = this.userWorkloads.findIndex(w => w.id === workload.id);
        if (index !== -1) {
          this.userWorkloads[index] = response.user_workload;
          // Update the filtered workloads as well
          const filteredIndex = this.filteredWorkloads.findIndex(w => w.id === workload.id);
          if (filteredIndex !== -1) {
            this.filteredWorkloads[filteredIndex] = response.user_workload;
          }
        }
        // Reinitialize the form for this workload
        this.initializeForm(response.user_workload);
      },
      error => {
        console.error('Error updating user workload:', error);
        // Handle the error (e.g., display a message to the user)
      }
    );
  }

  private initializeForm(workload: UserWorkload): void {
    this.workloadForms[workload.id] = this.fb.group({
      user_id: [workload.id_user[0].id],
      semester_id: [workload.id_semester[0].id],
      vol_cm: [workload.vol_cm],
      vol_td: [workload.vol_td],
      vol_tp: [workload.vol_tp]
    });
  }
}