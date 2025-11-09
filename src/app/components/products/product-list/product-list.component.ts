import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CategoryService } from '@services/category.service';
import { Product, Category } from '@models/index';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styles: [`
    .products-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .filters h3 {
      margin-bottom: 1rem;
      color: #333;
      font-size: 1.1rem;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .category-list li {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .category-list li:hover,
    .category-list li.active {
      background: #f0f0f0;
      color: #007bff;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .price-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price-filter input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .products-main {
      background: white;
      padding: 2rem;
      border-radius: 8px;
    }

    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .products-header h2 {
      margin: 0;
      color: #333;
    }

    .product-count {
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .product-card {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-card a {
      text-decoration: none;
      color: inherit;
    }

    .product-image {
      width: 100%;
      height: 200px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      color: #999;
    }

    .product-info {
      padding: 1rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #333;
    }

    .category {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .price,
    .discount-price {
      font-weight: bold;
      color: #28a745;
    }

    .original-price {
      text-decoration: line-through;
      color: #999;
      font-size: 0.875rem;
    }

    .out-of-stock {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #dc3545;
      color: white;
      font-size: 0.75rem;
      border-radius: 4px;
    }

    .loading,
    .no-products {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .pagination button:hover:not(:disabled) {
      background: #f0f0f0;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .products-container {
        grid-template-columns: 1fr;
      }

      .filters {
        position: static;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  
  selectedCategoryId = signal<number | null>(null);
  searchQuery = '';
  
  currentPage = signal(1);
  pageSize = 12;
  total = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    
    const filter = {
      search: this.searchQuery || undefined
    };

    this.productService.getProducts(filter, this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.totalPages.set(Math.ceil(response.total / this.pageSize));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
