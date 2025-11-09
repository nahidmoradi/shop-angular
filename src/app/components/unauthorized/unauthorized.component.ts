import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = !!this.authService.getToken();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
