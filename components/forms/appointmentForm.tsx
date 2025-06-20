"use client"

import { Dispatch, SetStateAction, useState } from "react"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {Form} from "@/components/ui/form"

import CustomFormField from "../customFormField"
import SubmitButton from "../submitButton"
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"
import { FormFieldType } from "./patientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Appointment } from "@/types/appwrite.types"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"




 

 
export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const AppointmentFormValidation = getAppointmentSchema(type);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });
 

 const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          timeZone,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
            note: values.note, 
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-1 space-y-6">
        <section className="mb-6 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in seconds</p>
        </section>
        
      {type !== "cancel" && (
        <>
            <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"
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

        <CustomFormField
         fieldType={FormFieldType.DATE_PICKER}
         control={form.control}
         name="schedule"
         label="Expected appointment date"
         showTimeSelect
         dateFormat="MM/dd/yyyy - h:mm aa"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason for appointment"
            placeholder="Enter reason for appointment"
        />
          </div>
          

        <div className="w-full">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="note"
            label="Notes"
            placeholder="Enter notes"
        />
        </div>
        
        </div>
        
        </>
      )}

      {type === "cancel" && (
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
        />
      )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm