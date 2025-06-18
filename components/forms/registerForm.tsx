"use client"

import { useState, useEffect } from "react"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {Form, FormControl} from "@/components/ui/form"

import CustomFormField from "../customFormField"
import SubmitButton from "../submitButton"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.action"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../fileUploader"



export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON ='skeleton',
}
 

 
const RegisterForm = ({user}: {user: User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
      privacyConsent: false,
      treatmentConsent: false,
      disclosureConsent: false,
    },
  });

  useEffect(() => {
    console.log("Validation Errors:", form.formState.errors);
  }, [form.formState.errors]);
 

 const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
  console.log("Submitted");
  
    setIsLoading(true);

        let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    console.log("User: ", user);

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insuranceProviderNumber: values.insuranceProviderNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        disclosureConsent: values.disclosureConsent,
        treatmentConsent: values.treatmentConsent,
      };

      //@ts-ignore
      const newPatient = await registerPatient(patient);

    if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className=" space-y-4">
            <h1 className="header">Welcome!</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
            
            
        </section>
        
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="John Doe"
            label="Full Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

<div className="flex flex-col xl:flex-row gap-4">
  <div className="w-full">
    <CustomFormField
      fieldType={FormFieldType.INPUT}
      control={form.control}
      name="email"
      label="Email"
      placeholder="johndoe@gmail.com"
      iconSrc="/assets/icons/email.svg"
      iconAlt="email"
    />
  </div>

  <div className="w-full">
    <CustomFormField
      fieldType={FormFieldType.PHONE_INPUT}
      control={form.control}
      name="phone"
      label="Phone number"
      placeholder="(+880) 1711111111"
    />
  </div>
</div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
        />
          </div>
          
<div className="w-full">
  <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className='cursor-pointer'>
                        {option}

                      </Label>

                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
        />
</div>
        
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="Amberkhana, Sylhet"
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
        />
        </div>
        
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(+880) 1711111111"
        />
        </div>
        
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>   
        </section>

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select  physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2 sm:text-sm text-xs  ">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                <p>{doctor.name}</p>
                <p>{doctor.education}</p>
                <p className="font-bold">{doctor.specialization}</p>
                </div>
                
              </div>

            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProviderNumber"
            label="Insurance Policy Number"
            placeholder="ABC123456789"
        />
        </div>
        
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, etc."
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg, etc."
        />
        </div>
        
        </div>


        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Father have diabetes... etc."
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy, etc."
        />
        </div>
        
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification & Verification</h2>
          </div>   
        </section>

        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select  an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
        />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
        />

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent & Privacy</h2>
          </div>   
        </section>

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition"
        />

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purpose"
        />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy"
        />

        


        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm