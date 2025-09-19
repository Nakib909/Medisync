"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { account } from "@/lib/appwrite.client"
import { fetchPatientByUserId, createUser } from "@/lib/actions/patient.action"

export default function VerifyClient() {
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

          const newUser = await createUser({
            name: loggedInUser.name,
            email: loggedInUser.email,
            phone: loggedInUser.phone,
            
          })

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
      }
    }

    completeVerification()
  }, [userId, secret, router])

  return <p>{message}</p>
}