// angular import
import { Component, inject } from '@angular/core';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { RouterModule, Router } from '@angular/router';
// import { AuthService } from 'src/app/theme/shared/services/auth.service';
@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  // public props

  // constructor
  constructor(private router: Router) {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';
  }
  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
  createFlag() {
    this.router.navigate(['/action/create-feature-flag']);
  }

  logout() {
    // this.authService.logout();
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
