"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { account } from "@/lib/appwrite.client"
import { fetchPatientByUserId, createUser } from "@/lib/actions/patient.action"

const VerifyPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

  const [message, setMessage] = useState("Verifying your account, please wait...")

  useEffect(() => {
    const completeVerification = async () => {
      if (userId && secret) {
        try {
          await account.updateMagicURLSession(userId, secret)

          const loggedInUser = await account.get()
          console.log("✅ Logged in as:", loggedInUser)

          const newUser = await createUser({
            name: loggedInUser.name,
            email: loggedInUser.email,
            phone: loggedInUser.phone, 
          })

          if (!newUser) throw new Error("User creation failed")

          const existingPatient = await fetchPatientByUserId(newUser.$id)

          if (newUser.phone && loggedInUser.phone && newUser.phone !== loggedInUser.phone) {
            setMessage("Email registered with different phone number. Try again.")
            return
          }

          if (existingPatient) {
  router.push(`/patients/${newUser.$id}/new-appointment`);
} else {
  router.push(`/patients/${newUser.$id}/register`);
}

        } catch (err) {
          console.error("Verification failed:", err)
          setMessage("Verification failed. Please try again.")
        }
      }
    }

    completeVerification()
  }, [userId, secret, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{message}</p>
    </div>
  )
}

export default VerifyPage