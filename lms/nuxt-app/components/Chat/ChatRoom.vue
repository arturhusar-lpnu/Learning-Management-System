<template>
  <div class="chat-room border rounded p-4 w-full h-full flex flex-col">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="font-bold text-lg">Chat Room {{ chat.roomName }}</h2>
    </div>

    <!-- Members Section -->
    <div class="mb-4">
      <span>Members</span>
      <SelectedUsers
        :members="selectedMembers"
        @remove="removeSelectedMember"
      />
      <button @click="handleShowUserSelection" type="button" class="btn">
        <i class="material-icons mr-2">person_add</i>
        <span>Select Members</span>
      </button>

      <UsersSelectionForm
        v-if="showUserSelection"
        :members="availableMembers"
        :initial-selected-members="selectedMembers"
        @close="showUserSelection = false"
        @selection-confirmed="updateSelectedMembers"
      />
    </div>

    <!-- Messages Section - This will take remaining space and scroll -->
    <div class="messages-container flex-1 min-h-0">
      <span>Messages</span>
      <div class="messages-scroll">
        <MessagesList :messages="userMessages" />
      </div>
    </div>

    <!-- Input Section -->
    <div class="mt-4">
      <MessageInput :roomId="chat._id" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
  selectedMembers: {
    type: Array,
    required: true,
  },
});

import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";
import MessagesList from "~/components/Chat/Message/MessagesList.vue";
import UsersSelectionForm from "~/components/Chat/AddChat/UsersSelectionForm.vue";
import SelectedUsers from "~/components/Chat/AddChat/SelectedUsers.vue";
import MessageInput from "~/components/Chat/Message/MessageInput.vue";

const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

// const socket = useSocket().getSocket();

const showUserSelection = ref(false);
const selectedMembers = ref([]);

const availableMembers = ref([]);

const userMessages = ref([]);

onMounted(async () => {
  await fetchMembers();
  const chat = props.chat;
  chat.participants.forEach((participant) => {
    selectedMembers.value.push(participant);
  });
  userMessages.value = chat.messages;
  console.log(chat);
});

const fetchMembers = async () => {
  try {
    const roomId = props.chat._id;
    console.log(roomId);
    const response = await $fetch(`${apiUrl}/api/chats/${roomId}/users`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
      },
    });
    if (response.status === "success") {
      availableMembers.value = response.data.availableUsers;
    }
  } catch (error) {
    console.error("Error fetching members:", error);
  }
};

const removeSelectedMember = (member) => {
  selectedMembers.value = selectedMembers.value.filter(
    (m) => m._id !== member._id
  );
};

const updateSelectedMembers = (members) => {
  selectedMembers.value = members;
};

const handleShowUserSelection = () => {
  showUserSelection.value = true;
};
</script>

<style scoped>
.chat-room {
  width: auto;
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.messages-container {
  display: flex;
  flex-direction: column;
}

.messages-scroll {
  flex: 1;
  scrollbar-width: none;
  overflow-y: auto;
  min-height: 0;
  max-height: calc(
    70vh - 200px
  ); /* Adjust this value based on your header/footer heights */
}

.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.messages-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
</style>
