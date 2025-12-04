const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Set to true when backend is ready
const USE_REAL_API = false;

export interface Shelf {
  id: string;
  name: string;
  description?: string;
  address?: string;
  isDefault?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
}

export interface ShelfProduct {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  photoUrl?: string;
  categoryName?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  status_code: number;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem("organizationId") ||
    localStorage.getItem("organizationId")
  );
}

// Mock data helpers
function getMockShelves(): Shelf[] {
  if (typeof window === "undefined") return [];
  const orgId = getOrgId();
  const key = `mock_shelves_${orgId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveMockShelves(shelves: Shelf[]): void {
  if (typeof window === "undefined") return;
  const orgId = getOrgId();
  const key = `mock_shelves_${orgId}`;
  localStorage.setItem(key, JSON.stringify(shelves));
}

function getMockShelfProducts(shelfId: string): ShelfProduct[] {
  if (typeof window === "undefined") return [];
  const orgId = getOrgId();
  const key = `mock_shelf_products_${orgId}_${shelfId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveMockShelfProducts(
  shelfId: string,
  products: ShelfProduct[]
): void {
  if (typeof window === "undefined") return;
  const orgId = getOrgId();
  const key = `mock_shelf_products_${orgId}_${shelfId}`;
  localStorage.setItem(key, JSON.stringify(products));
}

function generateId(): string {
  return crypto.randomUUID();
}

// Get all shelves for the organization
export const getShelves = async (): Promise<
  ApiResponse<Shelf[] | { content: Shelf[] }>
> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: [],
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const shelves = getMockShelves();
    return {
      status: "success",
      message: "Shelves fetched successfully",
      data: shelves,
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves?page=0&size=50`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to fetch shelves",
        data: [],
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to fetch shelves",
      data: [],
      status_code: 500,
    };
  }
};

// Create a new shelf
export const createShelf = async (data: {
  name: string;
  description?: string;
  address?: string;
}): Promise<ApiResponse<Shelf>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: {} as Shelf,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const shelves = getMockShelves();
    const newShelf: Shelf = {
      id: generateId(),
      name: data.name,
      description: data.description,
      address: data.address,
      isDefault: shelves.length === 0,
      createdOn: new Date().toISOString(),
      lastModifiedOn: new Date().toISOString(),
    };
    shelves.push(newShelf);
    saveMockShelves(shelves);
    return {
      status: "success",
      message: "Shelf created successfully",
      data: newShelf,
      status_code: 201,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to create shelf",
        data: {} as Shelf,
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to create shelf",
      data: {} as Shelf,
      status_code: 500,
    };
  }
};

// Update a shelf
export const updateShelf = async (
  shelfId: string,
  data: { name?: string; description?: string; address?: string }
): Promise<ApiResponse<Shelf>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: {} as Shelf,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const shelves = getMockShelves();
    const index = shelves.findIndex((s) => s.id === shelfId);
    if (index === -1) {
      return {
        status: "error",
        message: "Shelf not found",
        data: {} as Shelf,
        status_code: 404,
      };
    }
    shelves[index] = {
      ...shelves[index],
      ...data,
      lastModifiedOn: new Date().toISOString(),
    };
    saveMockShelves(shelves);
    return {
      status: "success",
      message: "Shelf updated successfully",
      data: shelves[index],
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to update shelf",
        data: {} as Shelf,
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update shelf",
      data: {} as Shelf,
      status_code: 500,
    };
  }
};

// Delete a shelf
export const deleteShelf = async (
  shelfId: string
): Promise<ApiResponse<null>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: null,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const shelves = getMockShelves();
    const filtered = shelves.filter((s) => s.id !== shelfId);
    saveMockShelves(filtered);
    const key = `mock_shelf_products_${orgId}_${shelfId}`;
    localStorage.removeItem(key);
    return {
      status: "success",
      message: "Shelf deleted successfully",
      data: null,
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to delete shelf",
        data: null,
        status_code: response.status,
      };
    }

    const text = await response.text();
    if (!text) {
      return {
        status: "success",
        message: "Shelf deleted",
        data: null,
        status_code: 200,
      };
    }

    return JSON.parse(text);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to delete shelf",
      data: null,
      status_code: 500,
    };
  }
};

// Get products in a specific shelf
export const getShelfProducts = async (
  shelfId: string
): Promise<ApiResponse<ShelfProduct[] | { content: ShelfProduct[] }>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: [],
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const products = getMockShelfProducts(shelfId);
    return {
      status: "success",
      message: "Shelf products fetched successfully",
      data: products,
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}/products?page=0&size=100`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to fetch shelf products",
        data: [],
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch shelf products",
      data: [],
      status_code: 500,
    };
  }
};

// Add product to shelf with quantity
export const addProductToShelf = async (
  shelfId: string,
  productId: string,
  quantity: number,
  productDetails?: {
    name: string;
    sku?: string;
    photoUrl?: string;
    categoryName?: string;
  }
): Promise<ApiResponse<ShelfProduct>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: {} as ShelfProduct,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const products = getMockShelfProducts(shelfId);
    const existing = products.find((p) => p.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      saveMockShelfProducts(shelfId, products);
      return {
        status: "success",
        message: "Product quantity updated",
        data: existing,
        status_code: 200,
      };
    }
    const newProduct: ShelfProduct = {
      productId,
      productName: productDetails?.name || "Product",
      sku: productDetails?.sku,
      quantity,
      photoUrl: productDetails?.photoUrl,
      categoryName: productDetails?.categoryName,
    };
    products.push(newProduct);
    saveMockShelfProducts(shelfId, products);
    return {
      status: "success",
      message: "Product added to shelf",
      data: newProduct,
      status_code: 201,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}/products`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to add product to shelf",
        data: {} as ShelfProduct,
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to add product to shelf",
      data: {} as ShelfProduct,
      status_code: 500,
    };
  }
};

// Update product quantity in shelf
export const updateShelfProductQuantity = async (
  shelfId: string,
  productId: string,
  quantity: number
): Promise<ApiResponse<ShelfProduct>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: {} as ShelfProduct,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const products = getMockShelfProducts(shelfId);
    const product = products.find((p) => p.productId === productId);
    if (!product) {
      return {
        status: "error",
        message: "Product not found in shelf",
        data: {} as ShelfProduct,
        status_code: 404,
      };
    }
    product.quantity = quantity;
    saveMockShelfProducts(shelfId, products);
    return {
      status: "success",
      message: "Quantity updated successfully",
      data: product,
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}/products/${productId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to update product quantity",
        data: {} as ShelfProduct,
        status_code: response.status,
      };
    }

    return response.json();
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product quantity",
      data: {} as ShelfProduct,
      status_code: 500,
    };
  }
};

// Remove product from shelf
export const removeProductFromShelf = async (
  shelfId: string,
  productId: string
): Promise<ApiResponse<null>> => {
  const orgId = getOrgId();
  if (!orgId) {
    return {
      status: "error",
      message: "No organization selected",
      data: null,
      status_code: 400,
    };
  }

  if (!USE_REAL_API) {
    const products = getMockShelfProducts(shelfId);
    const filtered = products.filter((p) => p.productId !== productId);
    saveMockShelfProducts(shelfId, filtered);
    return {
      status: "success",
      message: "Product removed from shelf",
      data: null,
      status_code: 200,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/organizations/${orgId}/shelves/${shelfId}/products/${productId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to remove product from shelf",
        data: null,
        status_code: response.status,
      };
    }

    const text = await response.text();
    if (!text) {
      return {
        status: "success",
        message: "Product removed from shelf",
        data: null,
        status_code: 200,
      };
    }

    return JSON.parse(text);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove product from shelf",
      data: null,
      status_code: 500,
    };
  }
};
