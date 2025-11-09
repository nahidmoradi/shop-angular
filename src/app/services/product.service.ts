import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError } from 'rxjs';
import { Product, ProductListResponse } from '@models/product.model';
import { environment } from '@environments/environment';

interface ProductFilter {
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(filter?: ProductFilter, page = 1, pageSize = 12): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter?.search) {
      params = params.set('q', filter.search);
    }

    const fullUrl = `${this.apiUrl}?${params.toString()}`;
    console.log('\n========================================');
    console.log('🔵 [REQUEST] GET Products');
    console.log('🔵 URL:', fullUrl);
    console.log('🔵 Params:', JSON.stringify({ page, pageSize, filter }, null, 2));
    console.log('========================================\n');

    return this.http.get<{ total: number; page: number; pageSize: number; items: Product[] }>(
      this.apiUrl, 
      { params }
    ).pipe(
      tap(response => {
        console.log('\n========================================');
        console.log('🟢 [RESPONSE] GET Products');
        console.log('🟢 Status: SUCCESS');
        console.log('🟢 Total items:', response.total);
        console.log('🟢 Items in response:', response.items?.length || 0);
        console.log('🟢 Page:', response.page, '/', Math.ceil(response.total / response.pageSize));
        console.log('🟢 Raw Response:', JSON.stringify(response, null, 2));
        console.log('========================================\n');
      }),
      catchError(error => {
        console.log('\n========================================');
        console.log('🔴 [ERROR] GET Products FAILED');
        console.log('🔴 Status:', error.status);
        console.log('🔴 Status Text:', error.statusText);
        console.log('🔴 URL:', error.url);
        console.log('🔴 Error Message:', error.message);
        console.log('🔴 Full Error:', JSON.stringify(error, null, 2));
        console.log('========================================\n');
        throw error;
      }),
      map(response => {
        const result = {
          products: response.items || [],
          total: response.total || 0,
          page: response.page || 1,
          pageSize: response.pageSize || 12
        };
        
        console.log('� [TRANSFORM] Mapping response...');
        console.log('🔄 Products count:', result.products.length);
        
        return result;
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(limit = 8): Observable<Product[]> {
    // از آنجایی که endpoint مخصوص featured نداریم، محصولات اول را با pageSize محدود برمی‌گردانیم
    return this.getProducts(undefined, 1, limit).pipe(
      map(response => response.products)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    // از همان endpoint اصلی با پارامتر q استفاده می‌کنیم
    return this.getProducts({ search: query }, 1, 50).pipe(
      map(response => response.products)
    );
  }
}
