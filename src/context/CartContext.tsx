"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products-store";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCOP: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalCOP: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("procap_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("procap_cart", JSON.stringify(newItems));
    } catch (e) {}
  };

  const addItem = (product: Product) => {
    const existing = items.find((i) => i.product.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...items, { product, quantity: 1 }];
    }
    saveCart(updated);
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCOP = items.reduce((acc, curr) => acc + (curr.product.price_offer * curr.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalCOP,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

