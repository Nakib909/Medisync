import { NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const { userId, secret } = await req.json();

    if (!userId || !secret) {
      return NextResponse.json({ success: false, error: "Missing userId or secret" }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject(process.env.PROJECT_ID!)
      .setKey(process.env.API_KEY!); // server key only here

    const account = new Account(client);

    // ✅ Complete magic URL login
    await account.updateMagicURLSession(userId, secret);

    // ✅ Fetch logged-in user
    const user = await account.get();

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Verification API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}