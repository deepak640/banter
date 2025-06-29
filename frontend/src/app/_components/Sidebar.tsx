"use client";
import React, { useState } from 'react';
import { Menu, MessageSquareText, Plus, Settings } from 'lucide-react'; // or any icon library
import Custommodal from './Custommodal';
import StartChat from './StartChat';
import { useGetConversations } from '@/services/conversation.service';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import avatar from "@/images/avtar.jpg"
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openModel, setOpenModel] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?._id;

  // API
  const { data: Conversations } = useGetConversations(userId || "");
  // Function to handle opening the modal
  const handleOpen = () => {
    setOpenModel(true);
  }


  return (
    <nav
      className={`h-full bg-gray-800 text-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Header with hamburger */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h1 className={`text-lg w-full  flex items-center justify-between font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
          <div>Banter</div>
          <div className='mr-4 cursor-pointer' onClick={handleOpen}><Plus /></div>
        </h1>
        <button onClick={() => setIsOpen(prev => !prev)} className="mr-2 cursor-pointer p-2 rounded hover:bg-gray-700 transition-colors duration-200">
          <Menu size={20} />
        </button>
      </div>
      {/* Sidebar items */}
      <ul className="mt-4 flex flex-col px-4 justify-between h-[80%] space-y-2 overflow-y-auto max-h-screen">
        {Conversations && Conversations.length > 0 ? (
          Conversations.map((conversation: any) => (
            <li key={conversation._id} className={`flex items-center py-2 ${isOpen ? "" : "justify-center"}`}>
              <a href={`/${conversation._id}`} className="flex items-center w-full text-white hover:bg-gray-700 rounded p-2 transition-colors duration-200">
                <span className='p-2'>
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                </span>
                {isOpen && <span className='ml-4'>{conversation.userName || "Untitled Chat"}</span>}
              </a>
            </li>
          ))
        ) : (
          <li className={`flex items-center py-2 ${isOpen ? "" : "justify-center"}`}>
            <span className='p-2'><MessageSquareText /></span>
            {isOpen && <span className='ml-4'>No Conversations</span>}
          </li>
        )}
        {/* Add more items */}
      </ul>
      <div className={`flex ml-6 mt-6 items-center space-x-2 ${isOpen ? "" : "justify-center"}`}>
        <span><Settings /></span>
        {isOpen && <span>Settings</span>}
      </div>
      <Custommodal isOpen={openModel} onCancel={() => setOpenModel(false)} title="Start a new chat" >
        <StartChat setOpen={setOpenModel} />
      </Custommodal>
    </nav >
  );
};

export default Sidebar;
