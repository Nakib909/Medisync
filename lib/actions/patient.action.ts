'use server'

import { ID, Permission, Query, Role } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, PATIENT_COLLECTION_ID, storage, users, ENDPOINT, PROJECT_ID,API_KEY, NEXT_PUBLIC_VERIFY_REDIRECT_URL } from "../appwrite.config"
import { parseStringify } from "../utils"
import {InputFile} from 'node-appwrite/file'
import { account } from "../appwrite.client"
import fetch from "node-fetch"


export const createUser = async (user: { name: string, email: string, phone: string }) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

 
    return parseStringify(newUser);

  } catch (error: any) {
    if (error?.code === 409) {
      const existingUsers = await users.list([Query.equal("email", [user.email])]);
      return existingUsers.users[0];
    }
    throw error;
  }
};
export const fetchPatientByUserId = async (userId: string) => {
  try {
    if (!DATABASE_ID || !PATIENT_COLLECTION_ID) {
  throw new Error("Missing Appwrite environment variables!");
}

    const response = await databases.listDocuments(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

  return response.documents.length > 0 ? response.documents[0] : null;
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};

export const sendVerificationEmailServerSide = async (
  userId: string,
  email: string
) => {
  try {
    if (!userId || !email) {
      throw new Error("UserId and email are required");
    }

    if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
      throw new Error("Missing Appwrite environment variables");
    }

    const baseRedirectUrl =
      process.env.NEXT_PUBLIC_VERIFY_REDIRECT_URL ||
      "http://localhost:3000/verify";

    const redirectUrl = `${baseRedirectUrl}?userId=${userId}&email=${encodeURIComponent(email)}`;

    console.log("Sending verification to:", `${ENDPOINT}/account/verification`);
    console.log("Redirect URL:", redirectUrl);

    const response = await fetch(`${ENDPOINT}/account/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": PROJECT_ID as string,
        "X-Appwrite-Key": API_KEY as string,
      },
      body: JSON.stringify({
        userId,
        url: redirectUrl,
      }),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = { message: "Could not parse response" };
    }

    if (!response.ok) {
      console.error("Appwrite API error:", responseData);
      
    }

    console.log("Verification email sent successfully");
    return true;
  } catch (error) {
    console.error("Server-side verification error:", error);
    throw new Error("Failed to send verification email. Please try again.");
  }
};


export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
          DATABASE_ID!,
          PATIENT_COLLECTION_ID!,
          [Query.equal('userId', userId)]
        );

        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error)
    }
}


export const registerPatient = async ({
  identificationDocument,
  userId,
  ...patient
}: RegisterUserParams) => {
  try {
    // 1️⃣ Upload file (if provided)
    let file;
    if (identificationDocument) {
      const blob = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;

      const inputFile = InputFile.fromBuffer(blob, fileName);
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // 2️⃣ Build the document data
    const documentData = {
      userId,
      identificationDocumentId: file?.$id ?? null,
      identificationDocumentUrl: file?.$id
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
        : null,
      ...patient,
    };

    // 3️⃣ Create the patient document
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      documentData
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw new Error("Failed to register patient");
  }
};


export const getPatientById = async (patientId: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId
    );
    return response;
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};