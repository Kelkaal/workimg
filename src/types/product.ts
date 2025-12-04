// Product status types
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Medium";

export interface Transaction {
	id: string;
	productId: string;
	quantity: number;
	type: 'CHECK_OUT' | 'CHECK_IN';
	userId: string;
	createdOn: string;
	purpose?: string;
	condition?: 'GOOD' | 'DAMAGED' | 'LOST';
}

// Product interface
export interface Product {
	id: string;
	name: string;
	description: string;
	sku: string;
	category: string;
	stock: number;
	status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Medium';
	image: string;
	totalQuantity: number;
	availableQuantity: number;
	checkedOutQuantity: number;
	lowStockThreshold: number;
	photoUrl: string;
	categoryId: string;
	categoryName: string;
	createdOn: string;
	lastModifiedOn: string;
	lastCheckOutTransaction?: Transaction | null;
}
export interface ApiProduct {
	id: string;
	name: string;
	description?: string;
	categoryId?: string;
	categoryName?: string;
	totalQuantity?: number;
	availableQuantity?: number;
	checkedOutQuantity?: number;
	lowStockThreshold?: number;
	photoUrl?: string;
	createdOn?: string;
	lastModifiedOn?: string;
	unitOfMeasurement?: string;
	storageLocation?: string;
	internalNotes?: string;
}

// Form type for creating/updating products
export type ProductFormData = {
  itemName: string;
  category: string;
  currentQuantity: string;
  description: string;
  lowStockThreshold: string;
  unitOfMeasurement: string;
  storageLocation: string;
  currentPhotoUrl: string;
  internalNotes: string;
  photo: File | null;
};

// Product statistics
export interface ProductStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

// Filters for UI
export interface ProductFilters {
  search: string;
  category: string;
  status: string;
}

// Pagination info
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// API product type
export interface ApiProduct {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  availableQuantity?: number;
  totalQuantity?: number;
  checkedOutQuantity?: number;
  lowStockThreshold?: number;
  photoUrl?: string;
  createdOn?: string;
  lastModifiedOn?: string;
  lastCheckOutTransactionId?: string | null;
}
