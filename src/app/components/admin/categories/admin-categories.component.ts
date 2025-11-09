import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@services/category.service';
import { Category } from '@models/index';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingCategory = signal<Category | null>(null);

  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: [''],
      slug: ['', Validators.required],
      isActive: [true]
    });
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.editingCategory.set(null);
    this.categoryForm.reset({ id: 0, isActive: true });
    this.showModal.set(true);
  }

  openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.categoryForm.patchValue(category);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const category = this.categoryForm.value;

      if (this.editingCategory()) {
        this.categoryService.updateCategory(category.id, category).subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal();
          },
          error: (error) => console.error('Error updating category:', error)
        });
      } else {
        this.categoryService.createCategory(category).subscribe({
          next: () => {
            this.loadCategories();
            this.closeModal();
          },
          error: (error) => console.error('Error creating category:', error)
        });
      }
    }
  }

  deleteCategory(id: number): void {
    if (confirm('آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }
}
