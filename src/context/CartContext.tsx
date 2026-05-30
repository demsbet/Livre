/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: "paper" | "pack";
  name: string;
  price: number;
  quantity: number;
  subtitle: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (id: "paper" | "pack") => void;
  removeFromCart: (id: "paper" | "pack") => void;
  updateQuantity: (id: "paper" | "pack", quantity: number) => void;
  convertPackToPaper: () => void;
  convertPaperToPack: () => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("la_bourse_en_afrique_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("la_bourse_en_afrique_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (id: "paper" | "pack") => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      const newItem: CartItem = {
        id,
        name: id === "paper" ? "Livre Papier Premium" : "Pack Duo Élite",
        subtitle: id === "paper" 
          ? "Broché d'Art, papier bouffant crème avec couverture rigide" 
          : "Livre Papier Premium + 30 min d'entretien avec l'auteur",
        price: id === "paper" ? 35 : 50,
        quantity: 1,
      };
      
      return [...prev, newItem];
    });
    setIsCartOpen(true); // Open drawer on addition automatically for premium feeling
  };

  const removeFromCart = (id: "paper" | "pack") => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: "paper" | "pack", quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const convertPackToPaper = () => {
    setCartItems((prev) => {
      const packItem = prev.find((item) => item.id === "pack");
      if (!packItem) return prev;
      
      const quantity = packItem.quantity;
      const filtered = prev.filter((item) => item.id !== "pack");
      
      const paperItem = filtered.find((item) => item.id === "paper");
      if (paperItem) {
        return filtered.map((item) =>
          item.id === "paper" ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: "paper",
          name: "Livre Papier Premium",
          subtitle: "Broché d'Art, papier bouffant crème avec couverture rigide",
          price: 35,
          quantity: quantity,
        };
        return [...filtered, newItem];
      }
    });
  };

  const convertPaperToPack = () => {
    setCartItems((prev) => {
      const paperItem = prev.find((item) => item.id === "paper");
      if (!paperItem) return prev;
      
      const quantity = paperItem.quantity;
      const filtered = prev.filter((item) => item.id !== "paper");
      
      const packItem = filtered.find((item) => item.id === "pack");
      if (packItem) {
        return filtered.map((item) =>
          item.id === "pack" ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: "pack",
          name: "Pack Duo Élite",
          subtitle: "Livre Papier Premium + 30 min d'entretien avec l'auteur",
          price: 50,
          quantity: quantity,
        };
        return [...filtered, newItem];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        convertPackToPaper,
        convertPaperToPack,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
