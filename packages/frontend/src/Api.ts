import { createStandaloneToast } from "@chakra-ui/react";
import {
  ADD_MESSAGE_REQUEST,
  MESSAGE,
  MESSAGE_RESPONSE,
} from "@/interfaces/IMessage";
import { USER } from "@/interfaces/IUser";
import { AxiosRequestConfig } from "axios";

const { toast } = createStandaloneToast();
export const axios = Axios.create({
  baseURL: `//${document.domain}:9002/api`,
  timeout: 10000,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 1) {
      res.message &&
        toast({
          description: res.message,
          status: "error",
          position: "top",
          duration: 1000,
        });
    } else if (res.code === 0) {
      res.message &&
        toast({
          description: res.message,
          status: "success",
          position: "top",
          duration: 1000,
        });
    }
    return res;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      // to fix the cycle import
      const { store } = await import("@/store");
      const { logout } = await import("@/store/reducer/user");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export async function request<RESPONSE>(
  config: AxiosRequestConfig
): Promise<RESPONSE> {
  const res = await axios.request<RESPONSE>(config);
  return res.data;
}

const Api = {
  login: (data: any) =>
    request({
      url: "/login",
      method: "post",
      data,
    }),
  register: (data: any) =>
    request({
      url: "/register",
      method: "post",
      data,
    }),
  logout: () =>
    request({
      url: "/logout",
      method: "post",
    }),
  getMyUserInfo: () =>
    request<USER>({
      url: "/userInfo",
      method: "get",
    }),
  setMyUserInfo: (data: any) =>
    request({
      url: "/userInfo",
      method: "post",
      data,
    }),
  upload: (data: File) =>
    request({
      url: "/upload",
      method: "post",
      data,
    }),
  getUserImage: (username: string) =>
    request<string>({
      url: "/userImage",
      method: "get",
      params: {
        username,
      },
    }),
  queryUser: (params: any) =>
    request({
      url: "/user",
      method: "get",
      params,
    }),
  getRoom: (params: any) =>
    request<MESSAGE_RESPONSE>({
      url: "/room",
      method: "get",
      params,
    }),
  addRoom: (data: any) =>
    request({
      url: "/room",
      method: "post",
      data,
    }),
  deleteRoom: (id: string) =>
    request({
      url: "/room/" + id,
      method: "delete",
    }),
  editRoom: () =>
    request({
      url: "/room",
      method: "patch",
    }),
  sendMessage: (data: ADD_MESSAGE_REQUEST) =>
    request<MESSAGE>({
      url: "/room/message",
      method: "post",
      data,
    }),
  deleteMessage: (params: any) =>
    request({
      url: "/room/message",
      method: "delete",
      params,
    }),
  addFriend: (data: any) =>
    request({
      url: "/friend",
      method: "post",
      data,
    }),
  deleteFriend: (params: any) =>
    request({
      url: "/friend",
      method: "delete",
      params,
    }),
};

export default Api;
