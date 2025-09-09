"use client";
import { SearchboxProps } from "@/types/props";
import React from "react";
import { IoSend } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa";

const Searchbox = ({
  setInput,
  value,
  handleSendMessage,
  handleKeyDown,
  handleFileChange,
  isUploading,
}: SearchboxProps) => {
  return (
    <div className="w-full p-2 flex justify-center items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        disabled={isUploading}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800"
      />
      <label
        className={`ml-2 px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaPaperclip size={20} />
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          disabled={isUploading}
        />
      </label>
      <button
        className="ml-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-800"
        onClick={handleSendMessage}
        disabled={isUploading}
      >
        <IoSend size={20} />
      </button>
    </div>
  );
};

export default Searchbox;
