import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./url.service";
import { credentials } from "@/types/service";
import { toastSuccess } from "@/utils/toast";

let prifix = `${BASE_URL}/users`;

const registerUser = async (obj: credentials) => {
  return axios.post(`${prifix}/register`, obj);
};

export const loginUser = async (obj: credentials) => {
  return axios.post(`${prifix}/login`, obj);
};

const getAllUser = async (obj: any) => {
  const query = new URLSearchParams(obj).toString();
  return axios.get(`${prifix}?${query}`);
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
