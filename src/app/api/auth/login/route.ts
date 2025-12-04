import { NextRequest, NextResponse } from "next/server";

// Use environment variable for backend URL (HTTPS in production)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function POST(request: NextRequest) {
  try {
    // Parse request body from frontend
    const body = await request.json();

    // Forward request to backend login endpoint
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Forward backend errors with proper status and message
    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Login failed",
          status_code: response.status,
        },
        { status: response.status }
      );
    }

    // Return success response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal server error",
        status_code: 500,
      },
      { status: 500 }
    );
  }
}
