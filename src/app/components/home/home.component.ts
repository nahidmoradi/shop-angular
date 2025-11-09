import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@services/product.service';
import { Product } from '@models/index';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styles: [`
    .home-container {
      min-height: calc(100vh - 200px);
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .btn-hero {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.125rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-hero:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .featured-products {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .featured-products h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .product-card a {
      text-decoration: none;
      color: inherit;
    }

    .product-image {
      position: relative;
      width: 100%;
      height: 250px;
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

    .badge-discount {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #dc3545;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      color: #333;
    }

    .category {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price,
    .discount-price {
      font-weight: bold;
      font-size: 1.125rem;
      color: #28a745;
    }

    .original-price {
      text-decoration: line-through;
      color: #999;
      font-size: 0.875rem;
    }

    .view-all {
      text-align: center;
    }

    .btn-view-all {
      display: inline-block;
      padding: 0.875rem 2rem;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-view-all:hover {
      background: #0056b3;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-content p {
        font-size: 1.125rem;
      }

      .featured-products h2 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  featuredProducts = signal<Product[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading.set(true);
    this.productService.getFeaturedProducts(8).subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.isLoading.set(false);
      }
    });
  }

  calculateDiscount(originalPrice: number, discountPrice: number): number {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  }
}
