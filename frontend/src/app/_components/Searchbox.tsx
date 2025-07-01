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
        className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white'
      />
      <button className='ml-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2' onClick={handleSendMessage}>
        <IoSend size={20} />
      </button>
    </div>
  )
}

export default Searchbox
