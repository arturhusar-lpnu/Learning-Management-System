<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeForm">&times;</span>
      <h3>New Chat</h3>

      <form @submit.prevent="createChat">
        <div>
          <label>Chat name:</label>
          <input v-model="chatName" type="text" required />
        </div>

        <div>
          <label>Chat type:</label>
          <select v-model="chatType" required>
            <option value="Group">Group</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <button @click="handleShowUserSelection" type="button" class="btn">
          <i class="material-icons mr-2">person_add</i>
          <span>Select Members</span>
        </button>

        <SelectedUsers
          :members="selectedMembers"
          @remove="removeSelectedMember"
        />

        <UsersSelectionForm
          v-if="showUserSelection"
          :members="availableMembers"
          :initial-selected-members="selectedMembers"
          @close="showUserSelection = false"
          @selection-confirmed="updateSelectedMembers"
        />

        <button type="submit" class="btn float-right">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import UsersSelectionForm from "~/components/Chat/AddChat/UsersSelectionForm.vue";
import SelectedUsers from "~/components/Chat/AddChat/SelectedUsers.vue";

import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "chat-created", "show-selection-form"]);

const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const socket = useSocket().getSocket();

const showUserSelection = ref(false);
const chatName = ref("");
const chatType = ref("Group");
const availableMembers = ref([]);
const selectedMembers = ref([]);

onMounted(() => {
  fetchMembers();
});

const closeForm = () => {
  emit("close");
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

const fetchMembers = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/chats/users`, {
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

const createChat = async () => {
  const newChat = {
    roomName: chatName.value,
    createdBy: store.user,
    members: selectedMembers.value,
  };
  console.log(selectedMembers.value);
  try {
    const response = await $fetch(`${apiUrl}/api/chats/new-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.token}`,
      },
      body: JSON.stringify(newChat),
    });

    if (response.status === "success") {
      closeForm();
      socket.emit("new chat");
      navigateTo(`/chats/${response.data.chat._id}`);
    }
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error.message,
      fatal: true,
    });
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Modal content */
.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

/* Close button */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}

.close:hover {
  color: #333;
}

/* Form header */
h3 {
  text-align: center;
  font-size: 1.5em;
  color: #333;
}

/* Form input fields */
input[type="text"],
select {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
}

input[type="checkbox"] {
  margin-right: 10px;
}

/* Button */
button[type="submit"] {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2em;
  align-self: center;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

/* Members list */
div[v-for="member"] {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

div[v-for="member"] input[type="checkbox"] {
  margin-right: 10px;
}

label {
  font-weight: bold;
}

form div {
  margin-bottom: 15px;
}
</style>
