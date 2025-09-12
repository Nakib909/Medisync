"use client"

import { useState } from "react"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {Form} from "@/components/ui/form"
import { fetchPatientByUserId } from "@/lib/actions/patient.action";

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
  setIsLoading(true);
  setErrorMessage(null); 

  try {
    const user = {
      name: values.name,
      email: values.email,
      phone: values.phone,
    };

    
    const newUser = await createUser(user);

    if (newUser) {
      
      const existingPatient = await fetchPatientByUserId(newUser.$id);

      
      if (newUser.phone && newUser.phone !== values.phone) {
        setErrorMessage("Email registered with different phone number. Try again.");
        setIsLoading(false);
        return; 
      }

      if (existingPatient) {
        router.push(`/patients/${newUser.$id}/new-appointment`);
      } else {
        router.push(`/patients/${newUser.$id}/register`);
      }
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("Something went wrong. Please try again.");
  }

  setIsLoading(false);
};


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