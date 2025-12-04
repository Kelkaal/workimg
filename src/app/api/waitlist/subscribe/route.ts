// app/api/waitlist/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.soma.emerj.net';
const UPSTREAM_API = `${API_BASE_URL}/waitlist/subscribe`;
const TIMEOUT_MS = 10000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName} = body;

    // Validate
    if (!email || !fullName) {
      return NextResponse.json(
        { message: "Email and full name are required" },
        { status: 400 }
      );
    }

    console.log('[Waitlist] Sending to:', UPSTREAM_API);
    console.log('[Waitlist] Body:', body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const upstreamResponse = await fetch(UPSTREAM_API, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Add any auth headers if required
        // "Authorization": `Bearer ${process.env.API_TOKEN}`
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!upstreamResponse.ok) {
      const errorData = await upstreamResponse.json().catch(() => ({}));
      console.error('[Waitlist] Error response:', errorData);
      
      return NextResponse.json(
        {
          message: errorData.message || "Failed to join waitlist",
          error: errorData
        },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();
    console.log("✅ [Waitlist] Success:", data);

    return NextResponse.json(data, { status: upstreamResponse.status });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Waitlist] Failed:', errorMessage);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { message: "Request timed out. Please try again." },
        { status: 504 }
      );
    }

    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('fetch failed')) {
      return NextResponse.json(
        { message: "Unable to connect to the server. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: "Subscription failed due to a server error.",
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
