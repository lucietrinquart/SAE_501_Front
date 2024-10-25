import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-nav-buttons',
  templateUrl: './nav-buttons.component.html',
  styleUrls: ['./nav-buttons.component.scss']  // Corrected styleUrls
})
export class NavButtonsComponent {

  constructor(private apiService: ApiService, private router: Router) { }  // Inject ApiService and Router

  logout() {
    this.apiService.logout();  // Call the logout function from ApiService
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
