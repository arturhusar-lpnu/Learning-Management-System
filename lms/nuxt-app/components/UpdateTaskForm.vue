<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Update Task</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="Name" v-model="formData.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="board">Status</label>
          <select id="board" v-model="formData.board">
            <option value="ToDo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input id="dueDate" v-model="formData.dueDate" type="date" required />
        </div>

        <div class="button-group">
          <button type="submit" class="btn-submit">Update Task</button>
          <button type="button" class="btn-cancel" @click="closeForm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/user";

const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "updateTasks"]);

const formData = ref({
  name: "",
  description: "",
  board: "",
  dueDate: "",
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = {
        name: newTask.name,
        description: newTask.description,
        board: newTask.board,
        dueDate: new Date(newTask.dueDate).toISOString().split("T")[0],
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/tasks/${props.task._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    if (response.status === "success") {
      emit("updateTasks", response.data.task);
      closeForm();
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const closeForm = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  background: #12b488;
  color: white;
  border: none;
}

.btn-cancel {
  background: #e2e8f0;
  border: none;
}
</style>
