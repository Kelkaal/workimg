import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildProductEndpoint } from '@/lib/apiClient';
import type { CheckOutRequest, TransactionResponse } from '@/types/api-types';

/**
 * POST /api/products/[productId]/check-out
 * Check out a product
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
    const body: CheckOutRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.quantity || !body.purpose) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'userId, quantity, and purpose are required fields'
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

    // Validate purpose has content
    if (body.purpose.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'purpose must not be empty'
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.userId)) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'userId must be a valid UUID'
        },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId, 'check-out');

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.post<TransactionResponse>(endpoint, body, { headers });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error checking out product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check out product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}