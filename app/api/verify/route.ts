import { NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const { userId, secret } = await req.json();

    if (!userId || !secret) {
      return NextResponse.json({ success: false, error: "Missing userId or secret" }, { status: 400 });
    }

    // ✅ Use Server SDK with API Key
    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject(process.env.PROJECT_ID!)
      .setKey(process.env.API_KEY!); // ← Add this line

    const account = new Account(client);

    // ✅ Complete magic URL login using server SDK
    const session = await account.updateMagicURLSession(userId, secret);
    
    // ✅ Create a client with the session token for user operations
    const userClient = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject(process.env.PROJECT_ID!)
      .setSession(session.secret); // ← Use the session from the magic URL

    const userAccount = new Account(userClient);
    const user = await userAccount.get();

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Verification API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}