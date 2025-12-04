import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildProductEndpoint } from '@/lib/apiClient';
import type { 
  SingleProductResponse, 
  UpdateProductRequest,
  // APIResponse
} from '@/types/api-types';

/**
 * GET /api/products/[productId]
 * Get a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Get organization ID from request headers
    const orgId = request.headers.get('x-organization-id');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId);

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.get<SingleProductResponse>(endpoint, { headers });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[productId]
 * Update a product
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Get organization ID from request headers
    const orgId = request.headers.get('x-organization-id');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: UpdateProductRequest = await request.json();

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId);

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.patch<SingleProductResponse>(endpoint, body, { headers });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[productId]
 * Delete a product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Get organization ID from request headers
    const orgId = request.headers.get('x-organization-id');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId);

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    await apiClient.delete(endpoint, { headers });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}