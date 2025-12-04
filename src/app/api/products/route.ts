import { NextRequest, NextResponse } from "next/server";
import { apiClient, buildProductEndpoint } from "@/lib/apiClient";

import type {
  ProductListResponse,
  SingleProductResponse,
  CreateProductRequest,
} from "@/types/api-types";

/**
 * GET /api/products
 * Get all products for the organization
 */
export async function GET(request: NextRequest) {
  try {
    // Get organization ID from request headers or localStorage
    const orgId = request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Build endpoint URL - fetch ALL products without filters
    const endpoint = buildProductEndpoint(orgId);

    // Forward Authorization header
    const authHeader = request.headers.get("authorization");
    const headers = authHeader ? { Authorization: authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.get<ProductListResponse>(endpoint, {
      headers,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Get organization ID from request headers
    const orgId = request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Parse request body
    const body: CreateProductRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.quantity || !body.categoryId) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "name, quantity, and categoryId are required fields",
        },
        { status: 400 }
      );
    }

    // Validate quantity is positive
    if (body.quantity < 1) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "quantity must be at least 1",
        },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId);

    // Forward Authorization header
    const authHeader = request.headers.get("authorization");
    const headers = authHeader ? { Authorization: authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.post<SingleProductResponse>(endpoint, body, {
      headers,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);

    return NextResponse.json(
      {
        error: "Failed to create product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
