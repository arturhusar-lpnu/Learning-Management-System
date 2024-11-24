<template>
  <div>
    <div v-if="chat">
      <ChatRoom :chat="chat" />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/user";
import ChatRoom from "~/components/Chat/ChatRoom.vue";
const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const chat = ref(null);
onMounted(() => {
  console.log("Room vue");
  fetchRoom();
});

const fetchRoom = async () => {
  const routeParam = useRoute().params;
  const roomId = routeParam.room;
  console.log(roomId);
  try {
    console.log("fetchRoom");
    const response = await $fetch(`${apiUrl}/api/chats/${roomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === "success") {
      // console.log(response.data);
      chat.value = response.data.chat;
    }
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error.message,
      fatal: true,
    });
  }
};
definePageMeta({
  layout: "chats",
});

// if (!chat.value) {
//   throw createError({
//     statusCode: 404,
//     statusMessage: "Chat not found",
//     fatal: true,
//   });
// }
</script>

<style scoped></style>
