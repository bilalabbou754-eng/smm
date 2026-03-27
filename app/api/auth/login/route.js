import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const limited = rateLimit(`login:${ip}`);

    if (!limited.ok) {
      return NextResponse.json({ error: "Too many login attempts." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await findUserByEmail(parsed.data.email);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = await comparePassword(parsed.data.password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = signToken({ userId: user._id, role: user.role, email: user.email });
    const response = NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role }
    });

    response.cookies.set("smm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("MONGODB_URI") ||
        error.message.includes("FIREBASE_PROJECT_ID") ||
        error.message.includes("FIREBASE_CLIENT_EMAIL") ||
        error.message.includes("FIREBASE_PRIVATE_KEY") ||
        error.message.includes("Firebase Admin credentials"))
    ) {
      return NextResponse.json(
        { error: "Server setup incomplete. Add the Firebase Admin environment variables and redeploy the app." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? `Login failed: ${error.message}` : "Login failed." },
      { status: 500 }
    );
  }
}
