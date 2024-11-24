<template>
  <div class="container flex flex-col gap-4">
    <div class="header flex flex-col">
      <h3>Chat rooms</h3>
      <button class="btn" @click="createNewChat">
        <i class="material-icons mr-2">chat</i>
        <span>+ New Chat</span>
      </button>
    </div>
    <div class="rooms flex flex-col gap-4">
      <div v-for="ch in chats">
        <ChatCard :chat="ch" @click="() => joinRoom(ch._id)" />
      </div>
    </div>
    <AddChatForm :show="showModal" @close="showModal = false" />
  </div>
</template>
<script setup>
import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";
import AddChatForm from "~/components/Chat/AddChat/AddChatForm.vue";

const store = useUserStore();

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const socket = useSocket().getSocket();
const showModal = ref(false);
const chats = ref([]);

const getChatRooms = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/chats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (response.status === "success") {
      chats.value = response.data.chats == [] ? [] : response.data.chats;
    }
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error.message,
      fatal: true,
    });
  }
};

//get chats when opening page
onMounted(() => {
  getChatRooms();

  // socket.on("connect", () => {
  //   console.log("Connected to Socket.IO server");
  // });

  socket.on("new chat", () => {
    getChatRooms();
  });

  // onUnmounted(() => {
  //   socket.disconnect();
  // });
});

const joinRoom = (chatId) => {
  console.log("Joining Room");
  socket.emit("joinRoom", chatId);
  navigateTo(`/chats/${chatId}`);
};

const createNewChat = () => {
  console.log("New chat commit");
  showModal.value = true;
};
</script>

<style scoped></style>
