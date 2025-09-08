import Image from "next/image";
import { getPatientById } from "@/lib/actions/patient.action";
import Link from "next/link";

export default async function UserDetails({ params }: { params: { id: string } }) {
  const user = await getPatientById(params.id);

  if (!user) return (
    <div className="admin-main p-4 text-red-500 font-semibold">
      User not found
    </div>
  );

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="cursor-pointer text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          
          <Link href='/' className='cursor-pointer'>
            <div className="w-fit flex flex-row items-center justify-center gap-2">
              <Image
                src="/assets/icons/logo-icon.svg"
                height={1000}
                width={1000}
                alt="logo"
                className="h-10 w-fit"
              />
              <div className="text-lg text-white font-bold">MediSync</div>
            </div>
          </Link>
        </div>

        <p className='text-16-semibold'>Patient Details</p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>{user.name}'s Profile</h1>
          <p className='text-dark-700'>View and manage patient information.</p>
        </section>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dark-600 border-b pb-2">Personal Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark-500">Email:</span> <span className="text-dark-400">{user.email}</span></p>
                <p><span className="font-medium text-dark-500">Phone:</span> <span className="text-dark-400">{user.phone}</span></p>
                <p><span className="font-medium text-dark-500">Birth Date:</span> <span className="text-dark-400">{new Date(user.birthDate).toLocaleDateString()}</span></p>
                <p><span className="font-medium text-dark-500">Gender:</span> <span className="text-dark-400">{user.gender}</span></p>
                <p><span className="font-medium text-dark-500">Address:</span> <span className="text-dark-400">{user.address}</span></p>
                <p><span className="font-medium text-dark-500">Occupation:</span> <span className="text-dark-400">{user.occupation}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dark-600 border-b pb-2">Emergency & Insurance</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark-500">Emergency Contact:</span> <span className="text-dark-400">{user.emergencyContactName} ({user.emergencyContactNumber})</span></p>
                <p><span className="font-medium text-dark-500">Primary Physician:</span> <span className="text-dark-400">{user.primaryPhysician || "N/A"}</span></p>
                <p><span className="font-medium text-dark-500">Insurance Provider:</span> <span className="text-dark-400">{user.insuranceProvider || "N/A"}</span></p>
                <p><span className="font-medium text-dark-500">Policy Number:</span> <span className="text-dark-400">{user.insurancePolicyNumber || "N/A"}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dark-600 border-b pb-2">Medical History</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark-500">Allergies:</span> <span className="text-dark-400">{user.allergies || "None"}</span></p>
                <p><span className="font-medium text-dark-500">Current Medication:</span> <span className="text-dark-400">{user.currentMedication || "None"}</span></p>
                <p><span className="font-medium text-dark-500">Family Medical History:</span> <span className="text-dark-400">{user.familyMedicalHistory || "None"}</span></p>
                <p><span className="font-medium text-dark-500">Past Medical History:</span> <span className="text-dark-400">{user.pastMedicalHistory || "None"}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dark-600 border-b pb-2">Identification</h2>
              <div className="space-y-3">
                <p><span className="font-medium text-dark-500">Type:</span> <span className="text-dark-400">{user.identificationType || "N/A"}</span></p>
                <p><span className="font-medium text-dark-500">Number:</span> <span className="text-dark-400">{user.identificationNumber || "N/A"}</span></p>
                
                {user.identificationDocumentUrl ? (
                  <div className="mt-4">
                    <p className="font-medium text-dark-500 mb-2">Document Preview:</p>
                    <div className="border rounded-md p-2">
                      <Image
                        src={user.identificationDocumentUrl}
                        alt="Identification Document"
                        width={400}
                        height={300}
                        className="rounded-md w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No document uploaded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}