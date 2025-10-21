import Image from "next/image";
import Link from "next/link";
import avatar from "@/images/avtar.jpg";
import { ChatitemProps } from "@/types/props";

const Chatitem = ({ conversation, isOpen, onClick }: ChatitemProps) => {
  return (
    <li key={conversation._id}>
      <Link
        {...(onClick && { onClick })}
        href={`/${conversation._id}`}
        className={`flex items-center p-3 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 ${
          isOpen ? "" : "justify-center"
        }`}
      >
        <div className="relative">
          <Image
            src={conversation?.userProfile ?? avatar}
            alt="User Avatar"
            width={48}
            height={48}
            className="rounded-full contain-size"
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
  );
};

export default Chatitem;
