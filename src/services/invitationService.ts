const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export interface InvitationResponse {
	status: string;
	message: string;
	data: {
		organizationName?: string;
		inviterName?: string;
		role?: string;
		email?: string;
	};
	status_code: number;
}

/**
 * Accept an organization invitation
 */
export async function acceptInvitation(
	token: string
): Promise<InvitationResponse> {
	const url = `${BASE_URL}/api/v1/invitations/accept?token=${encodeURIComponent(
		token
	)}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				status: 'error',
				message:
					data?.message || `HTTP error! status: ${response.status}`,
				data: {},
				status_code: response.status,
			};
		}

		return data;
	} catch (error: unknown) {
		console.error('Error accepting invitation:', error);

		let errorMessage =
			'An unexpected error occurred while accepting the invitation.';

		if (error instanceof TypeError && error.message === 'fetch failed') {
			errorMessage =
				'Unable to connect to the server. Please check your internet connection and try again.';
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			status: 'error',
			message: errorMessage,
			data: {},
			status_code: 500,
		};
	}
}

/**
 * Decline an organization invitation
 */
export async function declineInvitation(
	token: string
): Promise<InvitationResponse> {
	const url = `${BASE_URL}/api/v1/invitations/decline?token=${encodeURIComponent(
		token
	)}`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				status: 'error',
				message:
					data?.message || `HTTP error! status: ${response.status}`,
				data: {},
				status_code: response.status,
			};
		}

		return data;
	} catch (error: unknown) {
		console.error('Error declining invitation:', error);

		let errorMessage =
			'An unexpected error occurred while declining the invitation.';

		if (error instanceof TypeError && error.message === 'fetch failed') {
			errorMessage =
				'Unable to connect to the server. Please check your internet connection and try again.';
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			status: 'error',
			message: errorMessage,
			data: {},
			status_code: 500,
		};
	}
}

/**
 * Get invitation details from token
 */
export async function getInvitationDetails(
	token: string
): Promise<InvitationResponse> {
	const url = `${BASE_URL}/api/v1/invitations/details?token=${encodeURIComponent(
		token
	)}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				status: 'error',
				message:
					data?.message || `HTTP error! status: ${response.status}`,
				data: {},
				status_code: response.status,
			};
		}

		return data;
	} catch (error: unknown) {
		console.error('Error fetching invitation details:', error);

		let errorMessage =
			'An unexpected error occurred while fetching invitation details.';

		if (error instanceof TypeError && error.message === 'fetch failed') {
			errorMessage =
				'Unable to connect to the server. Please check your internet connection and try again.';
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			status: 'error',
			message: errorMessage,
			data: {},
			status_code: 500,
		};
	}
}

