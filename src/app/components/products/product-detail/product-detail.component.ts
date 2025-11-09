import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart.service';
import { Product } from '@models/index';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .product-gallery {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .main-image {
      width: 100%;
      height: 400px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnails {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .thumbnails img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s;
    }

    .thumbnails img:hover,
    .thumbnails img.active {
      border-color: #007bff;
    }

    .product-info h1 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.75rem;
    }

    .category,
    .sku {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .price-section {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .price-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .price,
    .discount-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #28a745;
    }

    .original-price {
      text-decoration: line-through;
      color: #999;
      font-size: 1.125rem;
    }

    .discount-badge {
      background: #dc3545;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .stock-info {
      margin: 1rem 0;
    }

    .in-stock {
      color: #28a745;
      font-weight: 500;
    }

    .out-of-stock {
      color: #dc3545;
      font-weight: 500;
    }

    .short-description {
      margin: 1.5rem 0;
      color: #555;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .quantity-selector button {
      padding: 0.75rem 1rem;
      border: none;
      background: white;
      cursor: pointer;
      font-size: 1.125rem;
    }

    .quantity-selector button:hover:not(:disabled) {
      background: #f0f0f0;
    }

    .quantity-selector button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-selector input {
      width: 60px;
      text-align: center;
      border: none;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 0.75rem;
    }

    .btn-add-to-cart {
      flex: 1;
      padding: 0.75rem 2rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-add-to-cart:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-add-to-cart:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .specifications {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    .specifications h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .specifications table {
      width: 100%;
      border-collapse: collapse;
    }

    .specifications tr {
      border-bottom: 1px solid #eee;
    }

    .specifications td {
      padding: 0.75rem;
    }

    .specifications td:first-child {
      font-weight: 500;
      color: #666;
      width: 40%;
    }

    .description-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
    }

    .description-section h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .loading,
    .error {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .no-image {
      color: #999;
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = signal(false);
  selectedImage = signal<string | null>(null);
  quantity = signal(1);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        if (product.images && product.images.length > 0) {
          this.selectedImage.set(product.images[0].url);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading.set(false);
      }
    });
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  increaseQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct && this.quantity() < currentProduct.stock) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart({
        productId: currentProduct.id,
        quantity: this.quantity()
      });
      alert('محصول به سبد خرید اضافه شد');
    }
  }

  calculateDiscount(originalPrice: number, discountPrice: number): number {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  }
}
