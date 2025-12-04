// API Type Definitions for Product Management
// Based on Swagger API documentation

// ============================================================================
// Generic API Response Types
// ============================================================================

export interface APIResponse<T> {
  status: string;
  message: string;
  data: T;
  status_code: number;
}

export interface PaginationMetadata {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ============================================================================
// Product Types
// ============================================================================

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  totalQuantity: number;
  availableQuantity: number;
  checkedOutQuantity: number;
  lowStockThreshold: number;
  photoUrl: string;
  categoryId: string;
  categoryName: string;
  createdOn: string;
  lastModifiedOn: string;
}

// ============================================================================
// Product Request Types
// ============================================================================

export interface CreateProductRequest {
  name: string;
  description?: string;
  quantity: number;
  categoryId: string;
  lowStockThreshold?: number;
  photoUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  lowStockThreshold?: number;
  photoUrl?: string;
  status?: ProductStatus;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = 'RESTOCK' | 'CONSUME' | 'CHECK_OUT' | 'CHECK_IN';
export type ItemCondition = 'GOOD' | 'DAMAGED' | 'FAULTY' | 'LOST';
export type CheckOutStatus = 'OPEN' | 'CLOSED';

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  transactionType: TransactionType;
  quantity: number;
  reason: string | null;
  parentTransactionId: string | null;
  condition: ItemCondition | null;
  checkOutStatus: CheckOutStatus | null;
  createdOn: string;
  createdBy: string;
}

// ============================================================================
// Transaction Request Types
// ============================================================================

export interface RestockRequest {
  quantity: number; // minimum: 1
  reason: string; // minLength: 1
}

export interface ConsumeRequest {
  quantity: number; // minimum: 1
  reason: string; // minLength: 1
}

export interface CheckOutRequest {
  userId: string; // uuid
  quantity: number; // minimum: 1
  purpose: string; // minLength: 1
}

export interface CheckInRequest {
  checkOutTransactionId: string; // uuid
  quantity: number; // minimum: 1
  condition: ItemCondition;
}

// ============================================================================
// API Response Types
// ============================================================================

export type ProductListResponse = APIResponse<PaginatedResponse<ProductResponse>>;
export type SingleProductResponse = APIResponse<ProductResponse>;
export type TransactionListResponse = APIResponse<PaginatedResponse<Transaction>>;
export type TransactionResponse = APIResponse<Transaction>;

// ============================================================================
// Error Response Types
// ============================================================================

export interface APIError {
  status: string;
  message: string;
  status_code: number;
  errors?: Record<string, string[]>;
}
