import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildProductEndpoint } from '@/lib/apiClient';
import type { RestockRequest, SingleProductResponse } from '@/types/api-types';

/**
 * POST /api/products/[productId]/restock
 * Restock a product
 */
export async function POST(
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
    const body: RestockRequest = await request.json();

    // Validate required fields
    if (!body.quantity || !body.reason) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'quantity and reason are required fields'
        },
        { status: 400 }
      );
    }

    // Validate quantity is positive
    if (body.quantity < 1) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'quantity must be at least 1'
        },
        { status: 400 }
      );
    }

    // Validate reason has content
    if (body.reason.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'reason must not be empty'
        },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId, 'restock');

    // Forward request to backend API
    const data = await apiClient.post<SingleProductResponse>(endpoint, body);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error restocking product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to restock product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}