import AppointmentForm from "@/components/forms/appointmentForm";
import PatientForm from "@/components/forms/patientForm";
import { getPatient } from "@/lib/actions/patient.action";
import Image from "next/image";
import Link from "next/link";

export default async function NewAppointment({params: {userId}}: SearchParamProps) {
  const patient = await getPatient(userId);
  
    return (
        <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <div className="w-fit mb-8 flex flex-row items-center justify-center gap-2">
            <Image
              src="/assets/icons/logo-icon.svg"
              height={1000}
              width={1000}
              alt="logo"
              className=" h-10 w-fit"
            />
            <div className="text-lg text-white font-bold">MediSync</div>
          </div>

          <AppointmentForm type='create' userId={userId} patientId={patient.$id}/>

          
            <p className="copyright mt-10 py-12">
              © 2025 MediSync. All rights reserved.
            </p> 

            
        </div>

      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom "
      />
    </div>
  );
}
