import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body as { email?: string }).email || new URL(request.url).searchParams.get("email") || "";

    const url = `${BACKEND_URL}/api/v1/auth/resend-confirmation-email?email=${encodeURIComponent(email)}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return NextResponse.json(
        { status: "error", message: data?.message || "Failed", data: {}, status_code: resp.status },
        { status: resp.status }
      );
    }

    return NextResponse.json(
      { status: "success", message: data?.message || "Verification email resent", data: data.data || {}, status_code: resp.status },
      { status: resp.status }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Internal server error", data: {}, status_code: 500 },
      { status: 500 }
    );
  }
}