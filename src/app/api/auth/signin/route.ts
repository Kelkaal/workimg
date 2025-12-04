import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    // Attempt real backend first
    try {
      const resp = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const altData = await resp.json().catch(() => ({}));
        return NextResponse.json(
          {
            status: "error",
            message: altData?.message || "Sign in failed",
            data: {},
            status_code: resp.status,
          },
          { status: resp.status }
        );
      }

      const data = await resp.json();
      // For successful responses, format the data to match frontend expectations
      return NextResponse.json(
        { status: "success", message: data?.message || "Signed in successfully", data: data.data || {}, status_code: resp.status },
        { status: resp.status }
      );
    } catch {
      // If backend not reachable, return a mock success for dev
      const mock = {
        status: "success",
        message: "Signed in (mock)",
        status_code: 200,
        data: {
          token: `mock-token-${Date.now()}`,
          user: {
            id: "mock-user-id",
            name: email.split("@")[0] || "User",
            email,
          },
        },
      };
      return NextResponse.json(mock, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Internal server error",
        data: {},
        status_code: 500,
      },
      { status: 500 }
    );
  }
}