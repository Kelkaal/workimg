import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resp = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data?.message || "Refresh token failed",
          data: {},
          status_code: resp.status,
        },
        { status: resp.status }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: data?.message || "Token refreshed",
        data: data.data || {},
        status_code: resp.status,
      },
      { status: resp.status }
    );
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