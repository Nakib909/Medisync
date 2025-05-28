import PatientForm from "@/components/forms/patientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
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

          <PatientForm/>

          <div className="text-14-regular mt-10 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 MediSync. All rights reserved.
            </p> 

            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>

      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%] "
      />
    </div>
  );
}
