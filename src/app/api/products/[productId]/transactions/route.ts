import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildTransactionEndpoint } from '@/lib/apiClient';
import type { TransactionListResponse } from '@/types/api-types';

/**
 * GET /api/products/[productId]/transactions
 * Get all transactions for a specific product
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
    const endpoint = buildTransactionEndpoint(orgId, productId);

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.get<TransactionListResponse>(endpoint, { headers });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching product transactions:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch product transactions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}