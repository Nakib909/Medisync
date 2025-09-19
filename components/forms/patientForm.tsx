"use client"

import { useState } from "react"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { account } from "@/lib/appwrite.client"
import { ID } from "node-appwrite"; 

import {Form} from "@/components/ui/form"
import { fetchPatientByUserId, sendVerificationEmailServerSide} from "@/lib/actions/patient.action";

import CustomFormField from "../customFormField"
import SubmitButton from "../submitButton"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"



export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON ='skeleton',
}
 

 
const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 

const [errorMessage, setErrorMessage] = useState<string | null>(null);

 const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      
      const newUser = await createUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
      })

      if (!newUser) throw new Error("Failed to create user")

      
      const redirectUrl =
        process.env.NEXT_PUBLIC_VERIFY_REDIRECT_URL || "http://localhost:3000/verify"

      await account.createMagicURLToken(ID.unique(), values.email, redirectUrl)

      setErrorMessage("✅ Account created! Please check your email for the login link.")
    } catch (error: any) {
      console.error("Error:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
    }

    setIsLoading(false)
  }







  return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-6 space-y-4">
            <h1 className="header">Welcome to Better Health</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(+880) 1711111111"
        />
        {errorMessage && (
  <p className="text-red-500 text-sm">{errorMessage}</p>
)}

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm