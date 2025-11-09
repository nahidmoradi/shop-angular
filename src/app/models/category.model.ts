export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTree extends Category {
  children?: CategoryTree[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}
