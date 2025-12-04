
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Medium";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  status: StockStatus; 
  image: string;
  icon?: string;
  iconBg?: string;
  description?: string;
  
}
