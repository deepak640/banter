import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./url.service";
const prifix = `${BASE_URL}/conversations`;

const createConversation = async (obj: { users: string[] }) => {
  const res = await axios.post(`${prifix}/`, obj);
  return res.data;
};

const getConversations = async (userId: string) => {
  const res = await axios.get(`${prifix}/${userId}`);
  return res.data.conversations;
};

const getUserprofilebyConversationId = async (conversationId: string) => {
  const res = await axios.get(`${prifix}/profile/${conversationId}`);
  return res.data;
};

// Hooks
export const useCreateConversation = () => {
  return useMutation({
    mutationFn: createConversation,
  });
};

export const useGetConversations = (userId: string) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversations(userId).then((data) => data),
  });
};

export const useGetprofileByConversationId = (conversationId: string, userStatus: boolean) => {
  return useQuery({
    queryKey: ["conversation-profile", conversationId, userStatus],
    queryFn: () =>
      getUserprofilebyConversationId(conversationId).then(
        (data) => data.participants
      ),
  });
};
