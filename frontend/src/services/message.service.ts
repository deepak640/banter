import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./url.service";
import { toastSuccess } from "@/utils/toast";

let prifix = `${BASE_URL}/messages`;

const getMessages = async (conversationId: string) => {
  const res = await axios.get(`${prifix}/${conversationId}`);
  return res.data;
};

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId).then((data) => data.data),
    enabled: !!conversationId,
  });
};
