"use client";
import React, { useEffect, useState } from "react";
import Searchbox from "./Searchbox";
import { useSocket } from "../../Hooks/useSocket";
import { Message } from "../../types/state";
import { toastError } from "../../utils/toast";
import Image from "next/image";
import avatar from "../../images/avtar.jpg";
import { MoreVertical } from "lucide-react";
import { useGetprofileByConversationId } from "../../services/conversation.service";
import { useGetMessages } from "../../services/message.service";
import { useAuth } from "../../Hooks/useAuth";

export default function Chat({ slug }: { slug?: string }) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const socket = useSocket({ userId: user?._id ?? "", conversationId: slug ?? "" });
  const [input, setInput] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // API
  const { data: participants } = useGetprofileByConversationId(slug ?? "");
  const { data: messagesData, isLoading } = useGetMessages(slug ?? "");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  const userProfile = participants?.find(
    (participant: any) => participant._id !== user._id
  );
  const handleSendMessage = () => {
    if (input.trim() && socket.current) {
      const message = { text: input, hashId: user.hashId, conversationId: slug };
      socket.current.emit("send-message", message);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("error", (error: { message: string }) => {
      toastError(error.message);
    });
    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.current.on("receive-message", handleReceiveMessage);

    return () => {
      socket.current?.off("receive-message", handleReceiveMessage);
    };
  }, [socket.current, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Image
            src={avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {userProfile?.name || "Chat"}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 ${userProfile?.status ? "bg-green-500" : "bg-gray-400"} rounded-full`}></span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userProfile?.status ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${message.hashId === user.hashId ? "justify-end" : "justify-start"}`}>
              {message.hashId !== user.hashId && (
                <Image
                  src={avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-lg ${message.hashId === user.hashId
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm"}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Searchbox
          setInput={setInput}
          value={input}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </footer>
    </div>
  );
}
