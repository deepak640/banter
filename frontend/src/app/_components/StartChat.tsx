import { useGetAllUser } from "../../services/user.service";
import { useCreateConversation } from "../../services/conversation.service";
import { toastError } from "../../utils/toast";
import { useAuth } from "../../Hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "./Loader"; // Import the Loader component
import avatar from "../../images/avtar.jpg";
const StartChat = ({ setOpen }: { setOpen: any }) => {
  const router = useRouter();

  // API
  const { user } = useAuth();
  const { data: Allusers, isLoading: isLoadingUsers } = useGetAllUser({
    userId: user?._id,
  });
  const { mutateAsync: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();

  const handleClick = async (userId: string) => {
    setOpen(false);
    const Ids: string[] = [userId];
    Ids.push(user?._id as string);
    try {
      const res = await createConversation({ users: Ids });
      if (res) {
        router.push(`/${res.id}`);
      }
    } catch (error) {
      console.log("Error creating conversation:", error);
      toastError("Something went wrong");
    }
  };

  if (isLoadingUsers) {
    return <Loader />;
  }

  return (
    <ul className="flex flex-col items-starct mt-4 justify-start">
      {Allusers?.data?.map((user: any) => (
        <li
          key={user._id}
          className="p-2 border-1 my-1 rounded-sm hover:bg-gray-300 transition-colors cursor-pointer duration-150"
          onClick={() => handleClick(user._id)}
        >
          <div className="flex items-center">
            <Image
              src={user.photo ?? avatar}
              alt="profile"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
              unoptimized
            />
            <div className="flex items-center flex-col">
              <span className="ml-4">{user.name}</span>
              <span className="text-sm">{user.hashId}</span>
            </div>
          </div>
        </li>
      ))}
      {isCreatingConversation && <Loader />}
    </ul>
  );
};

export default StartChat;
