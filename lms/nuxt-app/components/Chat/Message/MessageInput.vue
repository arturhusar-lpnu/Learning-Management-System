<template>
  <div class="message-input border rounded p-2 flex">
    <input
      v-model="input"
      type="text"
      placeholder="Send message"
      class="flex-grow p-2 border-none outline-none"
    />
    <button @click="sendMessage" class="send-btn p-2 ml-2">➤</button>
  </div>
</template>

<script setup>
import { useSocket } from "~/store/socket";
import { useUserStore } from "~/store/user";

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
});

const store = useUserStore();
const input = ref("");
const socket = useSocket().getSocket();

function sendMessage() {
  console.log("Sending message");
  if (input.value.trim()) {
    const roomId = props.roomId;
    const email = store.user.email;
    const message = input.value.trim();
    console.log(socket);
    socket.emit("sendMessage", { roomId, email, message });
    input.value = "";
  }
}
</script>

<style scoped>
.send-btn {
  background-color: #e5e7eb;
}
</style>
