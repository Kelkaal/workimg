import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildProductEndpoint } from '@/lib/apiClient';
import type { CheckInRequest, TransactionResponse } from '@/types/api-types';

/**
 * POST /api/products/[productId]/check-in
 * Check in a product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Await params to get the actual values
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
    const body: CheckInRequest = await request.json();

    // Validate required fields
    if (!body.checkOutTransactionId || !body.quantity || !body.condition) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'checkOutTransactionId, quantity, and condition are required fields'
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

    // Validate condition is one of the allowed values
    const validConditions = ['GOOD', 'DAMAGED', 'FAULTY', 'LOST'];
    if (!validConditions.includes(body.condition)) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'condition must be one of: GOOD, DAMAGED, FAULTY, LOST'
        },
        { status: 400 }
      );
    }

    // Validate checkOutTransactionId is a valid UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.checkOutTransactionId)) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'checkOutTransactionId must be a valid UUID'
        },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildProductEndpoint(orgId, productId, 'check-in');

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.post<TransactionResponse>(endpoint, body, { headers });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error checking in product:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check in product',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}