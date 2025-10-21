import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./url.service";
import { credentials } from "@/types/service";
import { toastSuccess } from "@/utils/toast";
import { LoginResponseData } from "@/types/auth";
import { IUser } from "@/types/users";

const prifix = `${BASE_URL}/users`;

const registerUser = async (obj: credentials) => {
  return axios.post(`${prifix}/register`, obj);
};

export const loginUser = async (
  obj: credentials
): Promise<AxiosResponse<LoginResponseData>> => {
  return await axios.post(`${prifix}/login`, obj);
};

const getAllUser = async (obj: any) => {
  const query = new URLSearchParams(obj).toString();
  return await axios.get(`${prifix}?${query}`);
};

const updateById = async (id: string, obj: FormData) => {
  return await axios.patch(`${prifix}/${id}`, obj, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getUserById = async (id: string) => {
  const res = await axios.get<{ data: IUser }>(`${prifix}/${id}`);
  return res.data;
};

// API Hooks
export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obj: FormData) => updateById(id, obj),
    onSuccess: () => {
      toastSuccess("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
};

export const useGetAllUser = ({
  userId,
  search = "",
}: {
  userId: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["All_user", userId, search],
    queryFn: () => getAllUser({ userId, search }).then((res) => res.data.data),
    enabled: !!userId, // Only run if obj is truthy
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["get_user_byId", id],
    queryFn: () => getUserById(id).then((res) => res.data),
    enabled: !!id, // Only run if id is truthy
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
