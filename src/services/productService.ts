import { Product } from "../types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getAllProducts(
  organizationId: string
): Promise<Product[]> {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not configured. Check your .env file.");
  }

  // const url = `${API_BASE_URL}/organizations/${organizationId}/products`;

  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const url = `${API_BASE_URL}/api/v1/organizations/${organizationId}/products`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch products: ${res.status} - ${body}`);
  }

  const data: {
    status: string;
    message: string;
    data: Product[];
    status_code: number;
  } = await res.json();
  return data.data;
}

export const getProductSku = (productId: string) =>
  `INV-${productId.slice(0, 4).toUpperCase()}`;
export type { Product };
