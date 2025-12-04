// API Client Utility for Backend Communication
// Handles authentication, request/response transformation, and error handling

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

// ============================================================================
// Types
// ============================================================================

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Build headers for API requests
 */
function buildHeaders(requiresAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    if (isJson) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  if (isJson) {
    return response.json();
  }

  // For non-JSON responses (like DELETE), return empty object
  return {} as T;
}

// ============================================================================
// API Client Class
// ============================================================================

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(requiresAuth),
      ...fetchConfig,
    });

    return handleResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(requiresAuth),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchConfig,
    });

    return handleResponse<T>(response);
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(requiresAuth),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchConfig,
    });

    return handleResponse<T>(response);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(requiresAuth),
      ...fetchConfig,
    });

    return handleResponse<T>(response);
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(requiresAuth),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchConfig,
    });

    return handleResponse<T>(response);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const apiClient = new APIClient(API_BASE_URL);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get organization ID from localStorage or context
 * This should be set after user authentication
 */
export function getOrganizationId(): string {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get organization ID on server side');
  }

  const orgId = localStorage.getItem('organizationId');
  
  if (!orgId) {
    throw new Error('Organization ID not found. Please log in again.');
  }

  return orgId;
}

/**
 * Build product endpoint URL
 */
export function buildProductEndpoint(
  organizationId: string,
  productId?: string,
  action?: string
): string {
  let endpoint = `/organizations/${organizationId}/products`;
  
  if (productId) {
    endpoint += `/${productId}`;
  }
  
  if (action) {
    endpoint += `/${action}`;
  }
  
  return endpoint;
}

/**
 * Build transaction endpoint URL
 */
export function buildTransactionEndpoint(
  organizationId: string,
  productId?: string
): string {
  if (productId) {
    return `/organizations/${organizationId}/products/${productId}/transactions`;
  }
  
  return `/organizations/${organizationId}/transactions`;
}
