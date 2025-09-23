import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./url.service";
import { IMessage } from "@/types/message";

const prifix = `${BASE_URL}/messages`;

const getMessages = async (conversationId: string) => {
  const res = await axios.get<{ data: IMessage[] }>(
    `${prifix}/${conversationId}`
  );
  return res.data.data;
};

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId).then((data) => data),
    enabled: !!conversationId,
  });
};
