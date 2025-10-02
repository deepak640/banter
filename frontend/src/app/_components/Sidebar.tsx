"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  MessageSquarePlus,
  Plus,
  Users,
  Search,
  LogOut,
  Bell,
} from "lucide-react";
import {
  useCreateConversation,
  useGetConversations,
} from "@/services/conversation.service";
import { useAuth } from "@/Hooks/useAuth";
import { removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Chatitem from "./Chatitem";
import { useGetAllUser } from "@/services/user.service";
import { toastError } from "@/utils/toast";

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const { data: Allusers } = useGetAllUser({
    userId: user?._id,
  });
  const { mutateAsync: createConversation } = useCreateConversation();

  const userId = user?._id;
  const { data: conversations } = useGetConversations(userId ?? "");

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };
  const handleCreateConversation = async (userId: string) => {
    const Ids: string[] = [userId];
    Ids.push(user?._id as string);
    try {
      const res = await createConversation({ users: Ids });
      if (res) {
        router.push(`/${res.id}`);
      }
    } catch (error) {
      console.log(error);
      toastError("Failed to create conversation");
    }
  };

  const toggleConversations = () => {
    setShowUsers((prev) => !prev);
  };

  return (
    <aside
      className={` md:relative flex flex-col h-full bg-green-50 dark:bg-green-900 border-r border-green-200 dark:border-green-800 transition-all duration-300 ease-in-out z-10 ${
        isSidebarOpen ? "w-80" : "w-0 hidden"
      } md:flex ${isOpen ? "md:w-64" : "md:w-25"}`}
    >
      {!isSidebarOpen && (
        <div className="flex items-center justify-between h-20 px-6 border-b border-green-200 dark:border-green-800">
          {isOpen && (
            <h1 className="text-2xl font-bold text-green-900 dark:text-white">
              {showUsers ? "Users" : "Banter"}
            </h1>
          )}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-4 rounded-full text-green-500 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronLeft
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="md:hidden p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-green-100 dark:bg-green-800 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {showUsers ? (
              Allusers?.map((conversation: any) => (
                <Chatitem
                  onClick={() => handleCreateConversation(conversation._id)}
                  key={conversation._id}
                  conversation={conversation}
                  isOpen={isOpen}
                />
              ))
            ) : conversations.length > 0 ? (
              conversations.map((conversation: any) => (
                <Chatitem
                  key={conversation._id}
                  conversation={conversation}
                  isOpen={isOpen}
                />
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
        <div className="md:hidden flex justify-around items-center">
          <button className="p-2 rounded-full text-green-500 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-700">
            <Bell className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-green-500 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-700"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={toggleConversations}
          className={`w-full flex items-center justify-center p-3 rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 mt-4 md:mt-0`}
        >
          {isOpen ? (
            <>
              <MessageSquarePlus className="w-6 h-6 mr-2" />
              <span className="font-semibold">
                {showUsers ? "Go back" : "New Conversation"}
              </span>
            </>
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
