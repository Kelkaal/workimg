import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Define a constant for minimum password length
const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate password strength using the defined constant
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // --- Removed console.log("Signup attempt:", { email, firstName, lastName }); ---

    // Make request to backend API
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    });

    const data = await response.json();

    if (response.ok && (data.status_code === 200 || data.status_code === 201)) {
      return NextResponse.json(
        {
          message: "Account created successfully!",
          data: data.data,
        },
        { status: 200 }
      );
    } else if (response.status === 400) {
      return NextResponse.json(
        { message: data.message || "Email already exists" },
        { status: 400 }
      );
    } else if (response.status === 409) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    } else {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    // --- Removed console.error("Signup API Error:", error); ---

    return NextResponse.json(
      {
        message: "An error occurred during registration. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "auth/signup",
    timestamp: new Date().toISOString(),
  });
}
