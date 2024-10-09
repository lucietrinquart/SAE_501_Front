import { Component } from '@angular/core';
import {ApiService} from "../../shared/services/api.service";
import {User} from "../../shared/interfaces/user";
import { UserWorkload } from '../../shared/interfaces/user-workload';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  user!: User;
  userworkload!:UserWorkload

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.requestApi(`/prof`)
    .then((response: User) => {

    this.user = response;
    });
    this.apiService.requestApi(`/user_workload`)
    .then((response: UserWorkload) => {

    this.userworkload = response;
    });
  }

}
