import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest
} from '@models/cart.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;
  
  // Using signals for reactive cart state
  private cartItemsSignal = signal<CartItem[]>([]);
  
  public cartItems = this.cartItemsSignal.asReadonly();
  
  public totalItems = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  public totalPrice = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.subtotal, 0)
  );

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    // In a real app, this would fetch from the server
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSignal.set(JSON.parse(savedCart));
    }
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(request: AddToCartRequest): void {
    const items = this.cartItemsSignal();
    const existingItem = items.find(item => item.productId === request.productId);
    
    if (existingItem) {
      const updatedItems = items.map(item =>
        item.productId === request.productId
          ? { ...item, quantity: item.quantity + request.quantity, subtotal: item.price * (item.quantity + request.quantity) }
          : item
      );
      this.cartItemsSignal.set(updatedItems);
    } else {
      // In a real app, fetch product details from server
      const newItem: CartItem = {
        id: Date.now(),
        productId: request.productId,
        productName: 'Product Name', // Would come from product service
        price: 0, // Would come from product service
        quantity: request.quantity,
        subtotal: 0
      };
      this.cartItemsSignal.set([...items, newItem]);
    }
    
    this.saveCart();
  }

  updateCartItem(itemId: number, request: UpdateCartItemRequest): void {
    const items = this.cartItemsSignal();
    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, quantity: request.quantity, subtotal: item.price * request.quantity }
        : item
    );
    this.cartItemsSignal.set(updatedItems);
    this.saveCart();
  }

  removeFromCart(itemId: number): void {
    const items = this.cartItemsSignal();
    this.cartItemsSignal.set(items.filter(item => item.id !== itemId));
    this.saveCart();
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    localStorage.removeItem('cart');
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSignal()));
  }
}
