import React from 'react'
import Image from 'next/image'

import Link from 'next/link'
import RegisterForm from '@/components/forms/registerForm'
import { getUser } from '@/lib/actions/patient.action'

const Register = async ({params: {userId}}: SearchParamProps) => {
    const user = await getUser(userId);


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
    
              <RegisterForm user={user}/>
    
              
                <p className="copyright py-12">
                  © 2025 MediSync. All rights reserved.
                </p> 
    
              
            </div>
    
          </section>
    
          <Image
            src="/assets/images/register-img.png"
            height={1000}
            width={1000}
            alt="patient"
            className="side-img max-w-[45%] "
          />
        </div>
  )
}

export default Register