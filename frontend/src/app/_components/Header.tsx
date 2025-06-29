"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { IoMdLogOut } from 'react-icons/io'

const Header = () => {
  const handleLogout = () => {
    signOut()
  }
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold border rounded-4xl p-2">
        {/* <Image /> */}
        C
      </div>
      <div onClick={handleLogout}>
        <IoMdLogOut size={30} />
      </div>
    </div>
  )
}

export default Header
