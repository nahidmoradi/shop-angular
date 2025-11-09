import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '@services/product.service';
import { CategoryService } from '@services/category.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  stats = signal({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  isLoading = signal(false);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);

    // Load products count
    this.productService.getProducts(undefined, 1, 1).subscribe({
      next: (response) => {
        this.stats.update(s => ({ ...s, totalProducts: response.total }));
      }
    });

    // Load categories count
    this.categoryService.getCategories(1, 1).subscribe({
      next: (categories) => {
        this.stats.update(s => ({ ...s, totalCategories: categories.length }));
        this.isLoading.set(false);
      }
    });
  }
}
