import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const resp = await fetch(
      `${BACKEND_URL}/api/v1/auth/confirm-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data?.message || "Confirm email failed",
          data: {},
          status_code: resp.status,
        },
        { status: resp.status }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: data?.message || "Email confirmed",
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