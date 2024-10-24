import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service'; // Assurez-vous que le chemin est correct
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'] // Correction du nom du champ
})
export class UnauthorizedComponent implements OnInit {
  private userSubscription: Subscription = new Subscription(); // Pour gérer l'abonnement

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.redirectUser();
  }

  private redirectUser() {
    // Abonnement à l'observable pour obtenir l'utilisateur courant
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        switch (user.role) {
          case 'admin':
            this.router.navigate(['/user']);
            break;
          case 'vacataire':
            this.router.navigate(['/vacataire']);
            break;
          case 'enseignant':
            this.router.navigate(['/user']);
            break;
          default:
            // Si le rôle ne correspond à aucun cas, vous pouvez éventuellement gérer cela
            break;
        }
      } else {
        // Si l'utilisateur n'est pas connecté, vous pouvez le rediriger vers la page de connexion
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    // Désabonnez-vous de l'observable pour éviter les fuites de mémoire
    this.userSubscription.unsubscribe();
  }
}
