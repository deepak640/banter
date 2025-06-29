"use client";
import React, { useEffect, useState } from "react";
import Searchbox from "@/app/_components/Searchbox";
import { useSocket } from "@/Hooks/useSocket";
import { RxAvatar, RxDotsVertical } from "react-icons/rx";
import { Message } from "@/types/state";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toastError } from "@/utils/toast";
export default function Chat({ slug }: { slug?: string }) {
  console.log("Chat component rendered with slug:", slug);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  console.log("User ID from search params:", userId);
  const socket = useSocket({ userId: session?.user?._id ?? "", conversationId: slug ?? "" });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (input.trim() && socket.current) {
      const message = { text: input, hashId: session?.user.hashId, conversationId: slug };
      socket.current.emit("send-message", message); // Fixed: Use socket directly
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
    console.log("Socket connection established:", socket.current);
    if (!socket.current) return;
    socket.current.on("error", (error: { message: string }) => {
      console.error("Socket error:", error);
      toastError(error.message)
    });
    const handleReceiveMessage = (msg: any) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.current.on("receive-message", handleReceiveMessage);

    return () => {
      socket.current?.off("receive-message", handleReceiveMessage);
    };
  }, [socket.current, session]);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full w-full bg-white shadow-lg flex flex-col border border-gray-200">
      <nav>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold cursor-pointer"><RxAvatar size={35} /></h1>
          <span className="text-gray-500 cursor-pointer hover:text-gray-700"><RxDotsVertical size={25} /></span>
        </div>
      </nav>
      <div className="flex-1 overflow-auto">
        <ul className="flex-1 p-4 pb-0 space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${message.hashId === session?.user.hashId ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`p-2 rounded-xl w-fit max-w-[70%] ${message.hashId === session?.user.hashId ? "bg-green-100" : "bg-blue-100"
                  }`}
              >
                {message.text}
              </span>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef}>
        </div>
      </div>
      <Searchbox
        setInput={setInput}
        value={input}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
      />
    </div >
  );
}
