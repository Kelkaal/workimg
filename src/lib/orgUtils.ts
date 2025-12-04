/**
 * Organization utility functions
 * Handles organization ID retrieval from localStorage
 */

/**
 * Get organization ID from localStorage
 * @returns Organization ID or null if not found
 */
export function getOrganizationId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('organizationId');
}

/**
 * Get organization ID or throw error if not found
 * @throws Error if organization ID is not found
 * @returns Organization ID
 */
export function requireOrganizationId(): string {
  const orgId = getOrganizationId();
  
  if (!orgId) {
    throw new Error('Organization ID not found. Please select an organization.');
  }
  
  return orgId;
}

/**
 * Get user ID from localStorage
 * @returns User ID or null if not found
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('user_id');
}

/**
 * Get user ID or throw error if not found
 * @throws Error if user ID is not found
 * @returns User ID
 */
export function requireUserId(): string {
  const userId = getUserId();
  
  if (!userId) {
    throw new Error('User ID not found. Please log in again.');
  }
  
  return userId;
}

/**
 * Check if user is authenticated
 * @returns true if user has a valid token
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = localStorage.getItem('token');
  return !!token;
}
