"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPatientByUserId, createUser } from "@/lib/actions/patient.action"

const VerifyClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [message, setMessage] = useState("Verifying your account, please wait...");

  useEffect(() => {
    const completeVerification = async () => {
      if (!userId || !secret) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        // ✅ Client only calls our server API
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, secret }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Verification failed");

        const loggedInUser = data.user;
        const newUser = await createUser({
            name: loggedInUser.name,
            email: loggedInUser.email,
            phone: loggedInUser.phone,
            
          })

        // ✅ Optional: create your own user in DB
        const existingPatient = await fetchPatientByUserId(newUser.$id)

          if (existingPatient) {
            router.push(`/patients/${newUser.$id}/new-appointment`)
          } else {
            router.push(`/patients/${newUser.$id}/register`)
          }
        } catch (err) {
          console.error("Verification failed:", err)
          setMessage("Verification failed. Please try again.")
        }
    };

    completeVerification();
  }, [userId, secret, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{message}</p>
    </div>
  );
};

export default VerifyClient;