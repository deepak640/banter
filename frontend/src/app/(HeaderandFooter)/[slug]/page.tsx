import Chat from '@/app/_components/Chat'
import React from 'react'
import { PageProps } from 'next/dist/shared/lib/app-page-props';
export default function Page({ params }: PageProps) {
  return (
    <Chat slug={params.slug} />
  )
}
