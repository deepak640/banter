import Chat from '@/app/_components/Chat'
import React from 'react'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Chat slug={params.slug} />
  )
}
