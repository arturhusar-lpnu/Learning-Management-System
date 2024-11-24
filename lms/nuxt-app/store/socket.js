import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocket = defineStore("socket", () => {
  const socket = ref(null);
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  const getSocket = () => {
    if (!socket.value) {
      socket.value = io(apiUrl);
    }
    return socket.value;
  };
  return { getSocket };
});
