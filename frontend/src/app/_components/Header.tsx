"use client";
import React from "react";
import { LogOut, Search, Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import avatar from "../../images/avtar.jpg";
import { useUserById } from "../../services/user.service";
import { useAuth } from "../../Hooks/useAuth";
import { removeToken } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { useGetAllUser } from "@/services/user.service";
import useDebounce from "@/Hooks/useDebounce";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = ({
  isSidebarOpen,
  toggleSidebar,
}: {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const _id = user?._id ?? "";
  const { data: Allusers } = useGetAllUser({
    userId: user?._id,
    search: useDebounce(searchQuery, 300),
  });
  const { data: Profile } = useUserById(_id ?? "");

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-green-50 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
      <div className="flex items-center">
        <div className="md:hidden">
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        <div className="relative group ml-4">
          <Link href="/profile" target="_blank">
            <div className="flex items-center">
              <div className="relative w-10 h-10">
                <Image
                  src={Profile?.photo ?? avatar}
                  alt="User Avatar"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-full"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-green-900 dark:text-white">
                  {Profile?.name}
                </h2>
                <p className="text-sm text-green-500 dark:text-green-400">
                  Welcome back!
                </p>
              </div>
            </div>
          </Link>
          <div className="absolute z-99 top-full mt-2 w-max bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Open settings
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQuery}
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-full bg-green-100 dark:bg-green-800 text-green-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {Allusers && searchQuery && (
            <div className="absolute z-99 top-full mt-2 w-full bg-white text-black text-sm rounded-md px-2 py-1 opacity-100 transition-opacity duration-300">
              <ul>
                <li>asds</li>
                <li>asdad</li>
              </ul>
            </div>
          )}
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
        {/* <ThemeSwitcher /> */}
      </div>
    </header>
  );
};

export default Header;
