import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/store";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const limited = rateLimit(`register:${ip}`);

    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await findUserByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const password = await hashPassword(parsed.data.password);
    const user = await createUser({
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      password
    });

    const token = signToken({ userId: user._id, role: user.role, email: user.email });
    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });

    response.cookies.set("smm_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Server setup incomplete. Add MONGODB_URI to .env.local and restart the app." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
