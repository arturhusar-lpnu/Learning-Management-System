<template>
  <div class="list">
    <div ref="messagesConatainer" v-for="(msg, index) in messages" :key="index">
      <MessageCard
        :message="msg"
        :isMyMessage="msg.username === store.user.username"
        :showDate="shouldShowDate(msg, messages[index - 1])"
      />
    </div>
  </div>
</template>

<script setup>
import MessageCard from "~/components/Chat/Message/MessageCard.vue";
import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";
const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const socket = useSocket().getSocket();
const messages = ref([...props.messages]);
watch(
  () => props.messages,
  (newMessages) => {
    messages.value = [...newMessages];
  },
  { immediate: true }
);
const addNewMessage = (message) => {
  messages.value.push(message);
  nextTick(() => {
    if (messagesConatainer.value) {
      messagesConatainer.value.scrollTop =
        messagesConatainer.value.scrollHeight;
    }
  });
};
const messagesConatainer = ref(null);
onMounted(() => {
  console.log(messages);
  if (socket) {
    socket.on("newMessage", addNewMessage);
  }
});

onUnmounted(() => {
  if (socket) {
    socket.off("newMessage", addNewMessage);
  }
});

const shouldShowDate = (currentMessage, previousMessage) => {
  if (!previousMessage) return true;

  const currentDate = new Date(currentMessage.timestamp);
  const previousDate = new Date(previousMessage.timestamp);

  return !isSameDay(currentDate, previousDate);
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
// socket.on("newMessage", (message) => {
//   //{content, createdBy, timestamp}
//   messages.value.push(message);
// });
</script>

<style scoped>
.list {
  overflow-y: auto;
}
</style>
