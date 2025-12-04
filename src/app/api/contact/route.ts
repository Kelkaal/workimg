import { NextResponse } from "next/server";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Invalid data",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parseResult.data;

    // 🔴 For now we just log it on the server.
    // Later we can:
    // - send email
    // - save to DB
    // - call external backend etc.
    console.log("NEW CONTACT MESSAGE:", {
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message: "Message received successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong while sending your message.",
      },
      { status: 500 }
    );
  }
}
