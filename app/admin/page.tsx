import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Admin = () => {
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href='/' className='cursor-pointer'>
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
            </Link>

            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>

        <main className='admin-main'>
            <section></section>
        </main>
    </div>
  )
}

export default Admin