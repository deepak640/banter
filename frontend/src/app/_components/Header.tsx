"use client"
import React from 'react'
import { LogOut, Search, Bell } from 'lucide-react';
import Image from 'next/image';
import avatar from "../../images/avtar.jpg";
import { useUserById } from '../../services/user.service';
import { useAuth } from '../../Hooks/useAuth';
import { removeToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  const _id = user?._id ?? "";
  const { data: Profile } = useUserById(_id??"");

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-green-50 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
      <div className="flex items-center">
        <div className="relative w-10 h-10">
          <Image
            src={Profile?.photo ?? avatar}
            alt="User Avatar"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-green-900 dark:text-white">{Profile?.name}</h2>
          <p className="text-sm text-green-500 dark:text-green-400">Welcome back!</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-full bg-green-100 dark:bg-green-800 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
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
    </header>
  )
}

export default Header
