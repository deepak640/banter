"use client";
import React, { useState } from 'react';
import { ChevronLeft, MessageSquarePlus, Plus,  Users } from 'lucide-react';
import Custommodal from './Custommodal';
import StartChat from './StartChat';
import { useGetConversations } from '@/services/conversation.service';
import { useAuth } from '@/Hooks/useAuth';
import Image from 'next/image';
import avatar from "@/images/avtar.jpg";
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { user } = useAuth();
  const userId = user?._id;
  console.log("userId", user);
  const { data: conversations } = useGetConversations(userId || "");
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <aside
      className={`flex flex-col h-full bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-800 transition-all duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-24"
      }`}
    >
      <div className="flex items-center justify-between h-20 px-6 border-b border-green-200 dark:border-green-800">
        {isOpen && (
          <h1 className="text-2xl font-bold text-green-900 dark:text-white">
            Banter
          </h1>
        )}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-full text-green-500 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <ChevronLeft
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation: any) => (
                <li key={conversation._id}>
                  <Link
                    href={`/${conversation._id}`}
                    className={`flex items-center p-3 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 ${
                      isOpen ? "" : "justify-center"
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={conversation.userProfile??avatar}
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-green-900" />
                    </div>
                    {isOpen && (
                      <div className="ml-4">
                        <p className="font-semibold text-green-900 dark:text-white">
                          {conversation.userName || "Untitled Chat"}
                        </p>
                        <p className="text-sm text-green-500 dark:text-green-400">
                          Hey, how are you?
                        </p>
                      </div>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="flex items-center justify-center p-4 text-green-500 dark:text-green-400">
                {isOpen ? (
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    <p>No conversations yet.</p>
                  </div>
                ) : (
                  <Users className="w-8 h-8" />
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="px-6 py-4 border-t border-green-200 dark:border-green-800">
        <button
          onClick={handleOpenModal}
          className={`w-full flex items-center justify-center p-3 rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors duration-200`}
        >
          {isOpen ? (
            <>
              <MessageSquarePlus className="w-6 h-6 mr-2" />
              <span className="font-semibold">New Conversation</span>
            </>
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>

      <Custommodal
        isOpen={openModal}
        onCancel={() => setOpenModal(false)}
        title="Start a new conversation"
      >
        <StartChat setOpen={setOpenModal} />
      </Custommodal>
    </aside>
  );
};

export default Sidebar;
