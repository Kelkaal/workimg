"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/inventory";

// 1. Update the context type
interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void; // <- add this
  checkIn: (id: string, amount: number) => void;
  checkOut: (id: string, amount: number) => void;
}

// 2. Create context
const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// 3. Provider
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Omit<Product, "id">) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: crypto.randomUUID() }, // generate a unique id
    ]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const checkIn = (id: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + amount } : p
      )
    );
  };

  const checkOut = (id: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(p.quantity - amount, 0) } : p
      )
    );
  };

  return (
    <InventoryContext.Provider
      value={{ products, addProduct, deleteProduct, checkIn, checkOut }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

// 4. Custom hook
export const useInventoryData = () => {
  const context = useContext(InventoryContext);
  if (!context)
    throw new Error("useInventoryData must be used within InventoryProvider");
  return context;
};
