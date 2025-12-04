const BASE_URL = "https://api.staging.soma.emerj.net"; // Use same-origin API routes in dev/prod

export interface ApiResponse<T = Record<string, unknown>> {
  status: string;
  message: string;
  data: T;
  status_code: number;
}

// Keep only THIS version of EmptyData
export type EmptyData = {
  message: string;
};

// ---------- SSR-SAFE HELPER FUNCTION -----------

/**
 * Safely retrieves the authentication token from localStorage.
 * Returns null if running on the server (during SSR/prerendering).
 */
export function getSafeToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("token");
}

// ---------- HELPER FUNCTIONS -----------

// ... (postRequest and getRequest functions remain unchanged)

async function postRequest<T>(
  endpoint: string,
  body: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  console.log("🔵 API Request:", url);
  console.log("🔵 Request body:", body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    console.log("🔵 Response status:", response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        console.log("🔴 Error data:", errorData);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      return {
        status: "error",
        message: errorMessage,
        data: {} as T,
        status_code: response.status,
      };
    }

    const data = await response.json();
    console.log("🟢 Success data:", data);
    return data;
  } catch (error: unknown) {
    console.error("🔴 Network error:", error);

    let errorMessage =
      "An unexpected error occurred during the authentication process.";

    if (error instanceof TypeError && error.message === "fetch failed") {
      errorMessage =
        "Unable to connect to the authentication service. Please check your internet connection and try again.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      status: "error",
      message: errorMessage,
      data: {} as T,
      status_code: 500,
    };
  }
}

// ---------- AUTH RESPONSE TYPES -----------

export type SignupData = {
  message: string;
  token: string;
  userId?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type LoginData = {
  message: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  user_id?: string;
  email?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

// ---------- AUTH ENDPOINTS WITH MOCK SUPPORT ------------

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<SignupData>> => {
  return postRequest<SignupData>("/api/v1/auth/signup", data);
};

export const resendVerification = async (data: {
  email: string;
}): Promise<ApiResponse<EmptyData>> => {
  return postRequest<EmptyData>("/api/v1/auth/resend-confirmation-email", data);
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginData>> => {
  // Change from /api/auth/login to /api/v1/auth/login
  return postRequest<LoginData>("/api/v1/auth/login", data);
};

export const forgotPassword = async (data: {
  email: string;
}): Promise<ApiResponse<EmptyData>> => {
  return postRequest<EmptyData>("/api/v1/auth/forgot-password", data);
};

export const resetPassword = async (data: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<ApiResponse<EmptyData>> => {
  return postRequest<EmptyData>("/api/v1/auth/reset-password", data);
};

export const logout = async (
  accessToken: string
): Promise<ApiResponse<EmptyData>> => {
  return postRequest<EmptyData>(
    "/api/v1/auth/logout",
    {},
    { Authorization: `Bearer ${accessToken}` }
  );
};

async function getRequest<T>(
  endpoint: string,
  query?: Record<string, string>,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
  const url = `${BASE_URL}${endpoint}${qs}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", ...headers },
    });
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorMessage;
      } catch {}
      return {
        status: "error",
        message: errorMessage,
        data: {} as T,
        status_code: response.status,
      };
    }
    return response.json() as Promise<ApiResponse<T>>;
  } catch (error: unknown) {
    let errorMessage =
      "An unexpected error occurred during the authentication process.";
    if (error instanceof TypeError && error.message === "fetch failed") {
      errorMessage =
        "Unable to connect to the authentication service. Please check your internet connection and try again.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      status: "error",
      message: errorMessage,
      data: {} as T,
      status_code: 500,
    };
  }
}
export const confirmEmail = async (
  email: string,
  token: string
): Promise<ApiResponse<EmptyData>> => {
  return getRequest<EmptyData>("/api/v1/auth/confirm-email", {
    email,
    token,
  });
};

export const confirmResetToken = async (
  email: string,
  token: string
): Promise<ApiResponse<EmptyData>> => {
  return getRequest<EmptyData>("/api/v1/auth/confirm-reset-token", {
    email,
    token,
  });
};

export const refreshToken = async (
  refreshToken: string
): Promise<ApiResponse<{ accessToken?: string; refreshToken?: string }>> => {
  return postRequest<{ accessToken?: string; refreshToken?: string }>(
    "/api/v1/auth/refresh-token",
    { refreshToken }
  );
};
// services/authService.ts - Add these functions

export interface InvitationData {
  id: string;
  organizationId: string;
  organizationName: string;
  inviterName: string;
  inviteeEmail: string;
  role: "ADMIN" | "STAFF" | "OWNER";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdOn: string;
  token?: string; // Invitation token for accepting
}

// Get my invitations
export const getMyInvitations = async (params?: {
  status?: "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";
  page?: number;
  size?: number;
}): Promise<ApiResponse<InvitationData[] | { content: InvitationData[] }>> => {
  const token = getSafeToken();
  const queryParams: Record<string, string> = {};

  if (params?.status) queryParams.status = params.status;
  if (params?.page !== undefined) queryParams.page = params.page.toString();
  if (params?.size !== undefined) queryParams.size = params.size.toString();

  return getRequest<InvitationData[] | { content: InvitationData[] }>(
    "/api/v1/invitations/me",
    queryParams,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Accept invitation (no auth required - uses token query param)
export const acceptInvitation = async (
  invitationToken: string
): Promise<ApiResponse<EmptyData>> => {
  const url = `${BASE_URL}/api/v1/invitations/accept?token=${encodeURIComponent(
    invitationToken
  )}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to accept invitation",
        data: {} as EmptyData,
        status_code: response.status,
      };
    }

    return response.json() as Promise<ApiResponse<EmptyData>>;
  } catch (error: unknown) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to accept invitation",
      data: {} as EmptyData,
      status_code: 500,
    };
  }
};

// Get organization invitations
export const getOrgInvitations = async (
  orgId: string
): Promise<ApiResponse<InvitationData[] | { content: InvitationData[] }>> => {
  const token = getSafeToken();
  return getRequest<InvitationData[] | { content: InvitationData[] }>(
    `/api/v1/organizations/${orgId}/invitations`,
    { page: "0", size: "50" },
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Send invitation
export const sendInvitation = async (
  orgId: string,
  data: {
    email: string;
    role: "ADMIN" | "STAFF";
  }
): Promise<ApiResponse<InvitationData>> => {
  const token = getSafeToken(); // 🔑 MODIFIED
  return postRequest<InvitationData>(
    `/api/v1/organizations/${orgId}/invitations`,
    data,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Resend invitation - POST to /invitations/resend with email in body
export const resendInvitation = async (
  orgId: string,
  invitationId: string,
  email: string
): Promise<ApiResponse<EmptyData>> => {
  const token = getSafeToken();

  // Try the endpoint format: POST /organizations/{orgId}/invitations/resend with body
  const url = `${BASE_URL}/api/v1/organizations/${orgId}/invitations/resend`;

  try {
    // Build request body - try both email formats the API might expect
    const requestBody = {
      email: email,
      inviteeEmail: email,
      invitationId: invitationId,
    };

    console.log("🔵 Resend invitation request:", { url, body: requestBody });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("🔵 Resend invitation response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to resend invitation",
        data: {} as EmptyData,
        status_code: response.status,
      };
    }

    // Handle 204 No Content or empty response
    const text = await response.text();
    if (!text) {
      return {
        status: "success",
        message: "Invitation resent successfully",
        data: { message: "Invitation resent successfully" },
        status_code: response.status,
      };
    }

    return JSON.parse(text) as ApiResponse<EmptyData>;
  } catch (error: unknown) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to resend invitation",
      data: {} as EmptyData,
      status_code: 500,
    };
  }
};

// Revoke invitation
export const revokeInvitation = async (
  orgId: string,
  invitationId: string
): Promise<ApiResponse<EmptyData>> => {
  const token = getSafeToken();

  const url = `${BASE_URL}/api/v1/organizations/${orgId}/invitations/${invitationId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔵 Revoke invitation response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to revoke invitation",
        data: {} as EmptyData,
        status_code: response.status,
      };
    }

    // Handle 204 No Content or empty response (common for DELETE)
    const text = await response.text();
    if (!text || response.status === 204) {
      return {
        status: "success",
        message: "Invitation revoked successfully",
        data: { message: "Invitation revoked successfully" },
        status_code: response.status,
      };
    }

    return JSON.parse(text) as ApiResponse<EmptyData>;
  } catch (error: unknown) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to revoke invitation",
      data: {} as EmptyData,
      status_code: 500,
    };
  }
};
// Add the following code block to the very end of your service file:

// Delete organization
export const deleteOrganization = async (
  orgId: number
): Promise<ApiResponse<EmptyData>> => {
  const token = getSafeToken();

  const url = `${BASE_URL}/api/v1/organizations/${orgId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        message: errorData?.message || "Failed to delete organization",
        data: {} as EmptyData,
        status_code: response.status,
      };
    }

    return response.json() as Promise<ApiResponse<EmptyData>>;
  } catch (error: unknown) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
      data: {} as EmptyData,
      status_code: 500,
    };
  }
};
