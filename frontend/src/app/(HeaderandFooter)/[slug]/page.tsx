import Chat from '@/app/_components/Chat'
import React from 'react'

export default async function Page({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  return (
    <Chat slug={params.slug} />
  )
}
