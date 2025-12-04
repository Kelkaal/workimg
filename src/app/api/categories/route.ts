import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';

/**
 * GET /api/categories
 * Get all categories for the organization
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
    const endpoint = `/organizations/${orgId}/categories`;

    // Forward Authorization header
    const authHeader = request.headers.get('authorization');
    const headers = authHeader ? { 'Authorization': authHeader } : undefined;

    // Forward request to backend API
    const data = await apiClient.get(endpoint, { headers });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
