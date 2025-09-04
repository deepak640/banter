import { useQuery, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./url.service";
import { credentials } from "@/types/service";
import { toastSuccess } from "@/utils/toast";
import { LoginResponseData } from "@/types/auth";

const prifix = `${BASE_URL}/users`;

interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

const registerUser = async (obj: credentials) => {
  return axios.post(`${prifix}/register`, obj);
};

export const loginUser = async (obj: credentials): Promise<AxiosResponse<LoginResponseData>> => {
  return await axios.post(`${prifix}/login`, obj);
};

const getAllUser = async (obj: any) => {
  const query = new URLSearchParams(obj).toString();
  return await axios.get(`${prifix}?${query}`);
};

const updateById = async (id: string, obj: any) => {
  return await axios.patch(`${prifix}/${id}`, obj);
};

const getUserById = async (id: string) => {
  const res = await axios.get<{ data: User }>(`${prifix}/${id}`);
  return res.data;
};

// API Hooks
export const useUpdateUser = (id: string) => {
  return useMutation({
    mutationFn: (obj: any) => updateById(id, obj),
    onSuccess: () => {
      toastSuccess("User updated successfully");
    },
  });
};

export const useGetAllUser = (obj: any) => {
  return useQuery({
    queryKey: ["user", obj],
    queryFn: () => getAllUser(obj).then((res) => res.data),
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id).then((res) => res.data),
    enabled: !!id, // Only run if id is truthy
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
