import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';

// Define the expected user profile response type
interface UserProfile {
	id: string;
	email: string;
	name?: string;
	organizationId?: string;
	role?: string;
	photoUrl?: string;
	[key: string]: unknown; // Allow additional properties
}

interface ResponseError {
	response?: {
		status: number;
		data: unknown;
	};
}

export async function GET(request: NextRequest) {
	try {
		const token = request.headers.get('authorization')?.replace('Bearer ', '');

		if (!token) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Fetch user profile from backend
		const response = await apiClient.get<UserProfile>('/user/profile', {
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		// Return the data in the expected format
		return NextResponse.json({ user: response.data }, { status: 200 });
	} catch (error: unknown) {
		const err = error as Error & ResponseError;
		console.error('Error fetching user profile:', err.message);

		if (err.response) {
			console.error('Response error:', err.response.status, err.response.data);
		}
	}

	{/*return NextResponse.json(
		{ error: error.message || 'Failed to fetch user profile' },
		{ status: error.response?.status || 500 }
	);*/}
}

