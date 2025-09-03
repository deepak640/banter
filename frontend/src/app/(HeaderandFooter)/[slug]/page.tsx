import Chat from '@/app/_components/Chat'
import React from 'react'

export default function Page({ params }: any) {
  return (
    <Chat slug={params.slug} />
  )
}
