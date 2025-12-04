import { create } from "zustand";
import { toast } from "sonner";
import type {
  Product,
  ProductStats,
  ProductFilters,
  PaginationState,
  ApiProduct,
} from "@/types/product";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  RestockRequest,
  ConsumeRequest,
  CheckOutRequest,
  CheckInRequest,
  ProductListResponse,
  SingleProductResponse,
} from "@/types/api-types";
import { requireOrganizationId } from "@/lib/orgUtils";
import type { TransactionListResponse, Transaction } from "@/types/api-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
// console.log("API_BASE_URL in productStore:", API_BASE_URL);

interface ProductStore {
  // State
  products: Product[];
  filters: ProductFilters;
  pagination: PaginationState;
  selectedProducts: string[];
  loading: boolean;
  error: string | null;

  // Actions
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
  toggleProductSelection: (productId: string) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;

  // API Actions
  fetchProducts: () => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<boolean>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  restockProduct: (id: string, data: RestockRequest) => Promise<boolean>;
  consumeProduct: (id: string, data: ConsumeRequest) => Promise<boolean>;
  checkOutProduct: (id: string, data: CheckOutRequest) => Promise<boolean>;
  checkInProduct: (id: string, data: CheckInRequest) => Promise<boolean>;

  // Computed
  getFilteredProducts: () => Product[];
  getStats: () => ProductStats;
  getPaginatedProducts: () => Product[];
  getTotalItems: () => number;
  getLastTransaction: (
    productId: string,
    type: "CHECK_OUT" | "CHECK_IN"
  ) => Promise<Transaction | null>;
}

// Helper function to map API product to local product type
function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  const availableQuantity = apiProduct.availableQuantity ?? 0;
  const lowThreshold = apiProduct.lowStockThreshold ?? 10;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || "",
    sku: `SKU-${apiProduct.id.slice(0, 8).toUpperCase()}`,
    category: apiProduct.categoryName || "Uncategorized",
    stock: availableQuantity,
    status:
      availableQuantity > lowThreshold
        ? "In Stock"
        : availableQuantity > 0
        ? "Low Stock"
        : "Out of Stock",
    image: apiProduct.photoUrl || "/placeholder-product.png",
    totalQuantity: apiProduct.totalQuantity ?? 0,
    availableQuantity,
    checkedOutQuantity: apiProduct.checkedOutQuantity ?? 0,
    lowStockThreshold: lowThreshold,
    photoUrl: apiProduct.photoUrl || "",
    categoryId: apiProduct.categoryId || "",
    categoryName: apiProduct.categoryName || "",
    createdOn: apiProduct.createdOn || new Date().toISOString(),
    lastModifiedOn: apiProduct.lastModifiedOn || new Date().toISOString(),
    lastCheckOutTransaction: null, // optional OR handle later
  };
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  filters: {
    search: "",
    category: "All Categories",
    status: "All Status",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
  selectedProducts: [],
  loading: false,
  error: null,

  // Actions
  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setStatus: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),

  toggleProductSelection: (productId) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.includes(productId)
        ? state.selectedProducts.filter((id) => id !== productId)
        : [...state.selectedProducts, productId],
    })),

  toggleAllSelection: () => {
    const { selectedProducts } = get();
    const filtered = get().getFilteredProducts();
    const allSelected =
      filtered.length > 0 &&
      filtered.every((p) => selectedProducts.includes(p.id));

    if (allSelected) {
      set({ selectedProducts: [] });
    } else {
      set({ selectedProducts: filtered.map((p) => p.id) });
    }
  },

  clearSelection: () => set({ selectedProducts: [] }),

  // API Actions
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // console.log("token:", token);

      // Fetch ALL products without filters - filtering happens client-side
      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products?page=0&size=20`,
        {
          method: "GET",
          headers: {
            // 'x-organization-id': orgId,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('Fetch Products Response:', response);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result: ProductListResponse = await response.json();
      // console.log('Fetched Products:', result);
      const products1 = result.data.content.map(mapApiProductToProduct);
      // console.log('Mapped Products:', products1);

      set((state) => ({
        ...state,
        products: [...products1],
        pagination: {
          ...state.pagination,
          totalItems: result.data.totalElements,
        },
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch products";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createProduct: async (data: CreateProductRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'x-organization-id': orgId,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result: SingleProductResponse = await response.json();
      const newProduct = mapApiProductToProduct(result.data);

      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));

      toast.success("Product created successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  updateProduct: async (id: string, data: UpdateProductRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // 'x-organization-id': orgId,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result: SingleProductResponse = await response.json();
      const updatedProduct = mapApiProductToProduct(result.data);

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));

      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));

      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  restockProduct: async (id: string, data: RestockRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}/restock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to restock product");
      }

      const result: SingleProductResponse = await response.json();
      const updatedProduct = mapApiProductToProduct(result.data);

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));

      toast.success("Product restocked successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to restock product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  consumeProduct: async (id: string, data: ConsumeRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}/consume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to consume product");
      }

      const result: SingleProductResponse = await response.json();
      const updatedProduct = mapApiProductToProduct(result.data);

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));

      toast.success("Product consumed successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to consume product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  checkOutProduct: async (id: string, data: CheckOutRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}/check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check out product");
      }

      // Refresh products after checkout
      await get().fetchProducts();

      toast.success("Product checked out successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to check out product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  checkInProduct: async (id: string, data: CheckInRequest) => {
    try {
      set({ loading: true, error: null });
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${id}/check-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check in product");
      }

      // Refresh products after checkin
      await get().fetchProducts();

      toast.success("Product checked in successfully!");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to check in product";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  // Computed getters
  getFilteredProducts: () => {
    const { products, filters } = get();
    let filtered = products;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "All Categories") {
      filtered = filtered.filter((p) => p.categoryId === filters.category);
    }

    // Status filter
    if (filters.status !== "All Status") {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    return filtered;
  },

  getStats: () => {
    const { products } = get();
    return {
      total: products.length,
      inStock: products.filter((p) => p.status === "In Stock").length,
      lowStock: products.filter((p) => p.status === "Low Stock").length,
      outOfStock: products.filter((p) => p.status === "Out of Stock").length,
    };
  },

  getPaginatedProducts: () => {
    const { pagination } = get();
    const filtered = get().getFilteredProducts();
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return filtered.slice(start, end);
  },

  getTotalItems: () => {
    return get().getFilteredProducts().length;
  },

  getLastTransaction: async (
    productId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: "CHECK_OUT" | "CHECK_IN"
  ): Promise<Transaction | null> => {
    try {
      const orgId = requireOrganizationId();
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/organizations/${orgId}/products/${productId}/transactions?page=0&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return null;

      const result: TransactionListResponse = await response.json();
      return result.data.content[0] || null;
    } catch {
      return null;
    }
  },
}));
