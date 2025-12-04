import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    try {
      const resp = await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader || "" },
      });
      const data = await resp.json();
      if (!resp.ok) {
        return NextResponse.json(
          { status: "error", message: data?.message || "Failed", data: {}, status_code: resp.status },
          { status: resp.status }
        );
      }
      // For successful responses, format the data to match frontend expectations
      return NextResponse.json(
        { status: "success", message: data?.message || "Logged out successfully", data: data.data || {}, status_code: resp.status },
        { status: resp.status }
      );
    } catch {
      return NextResponse.json(
        { status: "success", message: "Logged out (mock)", data: { message: "ok" }, status_code: 200 },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Internal server error", data: {}, status_code: 500 },
      { status: 500 }
    );
  }
}