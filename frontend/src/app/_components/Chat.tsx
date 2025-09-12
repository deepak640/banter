"use client";
import React, { useEffect, useState, useRef } from "react";
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
import Loader from "./Loader";
import moment from "moment";
import generateFilePath from "@/helpers/generateFilePath";
import { ImageSend } from "./ImageSend";

export default function Chat({ slug }: { slug?: string }) {
  const { user } = useAuth();
  const socket = useSocket({
    userId: user?._id ?? "",
    conversationId: slug ?? "",
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [userStatus, setUserStatus] = useState(false);
  const [peerProfile, setPeerProfile] = useState<any>(null);

  // API
  const { data: participants } = useGetprofileByConversationId(
    slug ?? "",
    userStatus
  );
  const { data: messagesData, isLoading } = useGetMessages(slug ?? "");

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  const userProfile = participants?.find(
    (participant: any) => participant._id !== user?._id
  );

  useEffect(() => {
    if (userProfile) {
      setPeerProfile(userProfile);
    }
  }, [userProfile]);

  const handleSendMessage = async () => {
    if (input.trim() && socket.current) {
      const message = {
        text: input,
        hashId: user.hashId,
        conversationId: slug,
      };
      socket.current.emit("send-message", message);
      setInput("");
    }
  };

  const handleSendImage = (imageUrl: string) => {
    if (socket.current) {
      socket.current.emit("sendImage", {
        imageUrl,
        hashId: user.hashId,
        conversationId: slug,
      });
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
    if (!socket.current || !peerProfile) return;

    const handleUserStatus = ({
      userId,
      status,
      lastActive,
    }: {
      userId: string;
      status: boolean;
      lastActive?: Date;
    }) => {
      if (userId === peerProfile._id) {
        setUserStatus(status);
        if (!status && lastActive) {
          setPeerProfile((prev: any) => ({ ...prev, lastActive }));
        }
      }
    };

    const handleError = (error: { message: string }) => {
      toastError(error.message);
    };

    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleReceiveImage = (img: any) => {
      setMessages((prev) => [...prev, img]);
    };

    socket.current.on("user-status", handleUserStatus);
    socket.current.on("error", handleError);
    socket.current.on("receive-message", handleReceiveMessage);
    socket.current.on("receive-image", handleReceiveImage);

    return () => {
      socket.current?.off("user-status", handleUserStatus);
      socket.current?.off("error", handleError);
      socket.current?.off("receive-message", handleReceiveMessage);
      socket.current?.off("receive-image", handleReceiveImage);
    };
  }, [socket, user, peerProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Image
            src={generateFilePath(peerProfile?.photo) ?? avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full contain-size"
          />
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {peerProfile?.name || "Chat"}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 ${
                  userStatus ? "bg-green-500" : "bg-gray-400" 
                } rounded-full`}
              ></span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userStatus
                  ? "Online"
                  : peerProfile?.lastActive
                  ? moment(peerProfile.lastActive).fromNow()
                  : "Offline"}
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
              className={`flex items-start gap-4 ${
                message.hashId === user.hashId ? "justify-end" : "justify-start"
              }`}
            >
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
                className={`px-4 py-3 rounded-2xl max-w-lg ${
                  message.hashId === user.hashId
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm"
                }`}
              >
                {(message.text && message.type !== "image") && <p>{message.text}</p>}
                {message.imageUrl && (
                  <Image
                    src={generateFilePath(message.imageUrl)}
                    alt="Sent image"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                )}
                {message.type === "image" && (
                  <Image
                    src={generateFilePath(message.text)}
                    alt="Sent image"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ImageSend onSend={handleSendImage} ref={fileInputRef} />
        <Searchbox
          isUploading={false}
          setInput={setInput}
          value={input}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          onFileSelect={() => fileInputRef.current?.click()}
        />
      </footer>
    </div>
  );
}
