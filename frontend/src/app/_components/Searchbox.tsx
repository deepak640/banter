"use client"
import { SearchboxProps } from '@/types/props'
import React from 'react'
import { IoSend } from 'react-icons/io5'

const Searchbox = ({
  setInput,
  value,
  handleSendMessage,
  handleKeyDown,
}: SearchboxProps) => {
  return (
    <div className='w-full p-2 flex justify-center items-center'>
      <input
        type='text'
        value={value}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Search...'
        onKeyDown={handleKeyDown}
        className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <button className='ml-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600' onClick={handleSendMessage}>
        <IoSend size={20} />
      </button>
    </div>
  )
}

export default Searchbox
