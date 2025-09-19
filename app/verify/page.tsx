import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import VerifyClient from './verifyClient'

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClient />
    </Suspense>
  )
}