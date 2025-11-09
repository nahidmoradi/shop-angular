export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  categoryId: number;
  categoryName?: string;
  images: ProductImage[];
  specifications?: ProductSpecification[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  categoryId: number;
  images?: Omit<ProductImage, 'id'>[];
  specifications?: ProductSpecification[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}
