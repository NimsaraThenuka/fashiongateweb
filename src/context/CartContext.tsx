import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../data/products';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: string, color: string) => {
    const maxStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 10 : 0);
    if (!product.inStock || maxStock <= 0) {
      return;
    }
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === size && i.selectedColor === color);
      if (existing) {
        if (existing.quantity >= maxStock) {
          return prev; // cannot exceed available stock
        }
        return prev.map(i =>
          i.id === product.id && i.selectedSize === size && i.selectedColor === color
            ? { ...i, quantity: Math.min(maxStock, i.quantity + 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (id: number, size: string, color: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.selectedSize === size && i.selectedColor === color)));
  };

  const updateQuantity = (id: number, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if (i.id === id && i.selectedSize === size && i.selectedColor === color) {
          const maxStock = typeof i.stockQuantity === 'number' ? i.stockQuantity : (i.inStock ? 10 : 0);
          const cappedQty = maxStock > 0 ? Math.min(quantity, maxStock) : quantity;
          return { ...i, quantity: cappedQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
