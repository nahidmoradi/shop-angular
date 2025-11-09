import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-header {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
      text-decoration: none;
    }

    .main-nav {
      display: flex;
      gap: 2rem;
    }

    .main-nav a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;
      padding: 0.5rem;
    }

    .main-nav a:hover,
    .main-nav a.active {
      color: #007bff;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .cart-icon {
      position: relative;
      cursor: pointer;
      color: #333;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      background: none;
      border: none;
      cursor: pointer;
      color: #333;
      padding: 0.5rem;
      display: flex;
      align-items: center;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin-top: 0.5rem;
      min-width: 150px;
      z-index: 1001;
    }

    .user-dropdown a,
    .user-dropdown button {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      border: none;
      background: none;
      text-align: right;
      cursor: pointer;
      transition: background 0.2s;
    }

    .user-dropdown a:hover,
    .user-dropdown button:hover {
      background: #f5f5f5;
    }

    .auth-links {
      display: flex;
      gap: 1rem;
    }

    .btn-login,
    .btn-register {
      padding: 0.5rem 1.5rem;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-login {
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-login:hover {
      background: #007bff;
      color: white;
    }

    .btn-register {
      background: #007bff;
      color: white;
      border: 1px solid #007bff;
    }

    .btn-register:hover {
      background: #0056b3;
    }

    .main-content {
      flex: 1;
      background: #f8f9fa;
    }

    .main-footer {
      background: #333;
      color: white;
      padding: 3rem 2rem 1rem;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3 {
      margin-bottom: 1rem;
      color: #fff;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: white;
    }

    .footer-section p {
      color: #ccc;
      line-height: 1.6;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #555;
      color: #999;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .main-nav {
        gap: 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class App {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  showUserMenu = false;

  isAuthenticated() {
    return this.authService.getToken() && !this.authService.isTokenExpired();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
