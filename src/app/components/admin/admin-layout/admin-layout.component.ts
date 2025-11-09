import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = true;

  menuItems = [
    { icon: '📊', label: 'داشبورد', path: '/admin' },
    { icon: '📦', label: 'محصولات', path: '/admin/products' },
    { icon: '📁', label: 'دسته‌بندی‌ها', path: '/admin/categories' },
    { icon: '👥', label: 'کاربران', path: '/admin/users' },
    { icon: '🛒', label: 'سفارشات', path: '/admin/orders' }
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
