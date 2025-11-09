import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '@services/product.service';
import { CategoryService } from '@services/category.service';
import { Product, Category } from '@models/index';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);

  productForm!: FormGroup;
  searchQuery = '';

  currentPage = signal(1);
  pageSize = 20;
  total = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0, Validators.min(0)],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      categoryId: [null, Validators.required],
      isActive: [true],
      isFeatured: [false]
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const filter = this.searchQuery ? { search: this.searchQuery } : undefined;

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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  openAddModal(): void {
    this.editingProduct.set(null);
    this.productForm.reset({
      id: 0,
      isActive: true,
      isFeatured: false,
      price: 0,
      discountPrice: 0,
      stock: 0
    });
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.productForm.patchValue(product);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value;

      if (this.editingProduct()) {
        this.productService.updateProduct(product.id, product).subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (error) => console.error('Error updating product:', error)
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (error) => console.error('Error creating product:', error)
        });
      }
    }
  }

  deleteProduct(id: number): void {
    if (confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }
}
