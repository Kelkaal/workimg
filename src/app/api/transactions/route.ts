import { NextRequest, NextResponse } from 'next/server';
import { apiClient, buildTransactionEndpoint } from '@/lib/apiClient';
import type { TransactionListResponse } from '@/types/api-types';

/**
 * GET /api/transactions
 * Get all transactions for the organization
 */
export async function GET(request: NextRequest) {
  try {
    // Get organization ID from request headers
    const orgId = request.headers.get('x-organization-id');
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Build endpoint URL
    const endpoint = buildTransactionEndpoint(orgId);

    // Forward request to backend API
    const data = await apiClient.get<TransactionListResponse>(endpoint);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
