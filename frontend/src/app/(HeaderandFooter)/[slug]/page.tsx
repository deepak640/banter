import Chat from '@/app/_components/Chat'
import React from 'react'
// types.ts (or directly in your file)


export default function Page({ params }: any) {
  return (
    <Chat slug={params.slug} />
  )
}
