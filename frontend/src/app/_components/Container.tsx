"use client"
import React, { useState } from 'react'
import Header from '@/app/_components/Header'
import Sidebar from '@/app/_components/Sidebar'

const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col app-bg">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="h-full bg-white dark:bg-gray-900 shadow-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Container
