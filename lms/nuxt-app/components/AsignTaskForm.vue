<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeForm">&times;</span>
      <h3>New Task</h3>

      <form @submit.prevent="createTask">
        <div>
          <label>Task name:</label>
          <input v-model="taskName" type="text" required />
        </div>

        <div>
          <label>Group to assign:</label>
          <select v-model="groupSelected" required>
            <option v-for="group in groups">
              {{ group }}
            </option>
          </select>
        </div>

        <div>
          <label>Task Description:</label>
          <input v-model="description" type="text" required />
        </div>

        <div class="flex flex-row justify-between">
          <label for="dueDate">Select Due Date:</label>
          <client-only>
            <DatePicker
              v-model="dueDate"
              :format="'YYYY-MM-DD'"
              :min-date="new Date()"
              :placeholder="'Select a due date'"
              input-class="custom-date-picker"
            />
          </client-only>
        </div>
        <button type="submit" class="btn float-right">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import DatePicker from "vue3-datepicker";
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const taskName = ref("");
const groups = ref([]);
const groupSelected = ref(null);
const description = ref("");
const dueDate = ref(null);
const emit = defineEmits(["updateTasks", "close"]);

onMounted(async () => {
  await getGroups();
});

const getGroups = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/users/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === "success") {
      const users = response.data.users.filter((u) => u.role === "student");
      console.log(response.data);
      console.log(users.map((u) => u.group));
      groups.value = users.map((u) => u.group);
    }
  } catch (err) {
    console.error(err);
  }
};

const closeForm = () => {
  emit("close");
};

const createTask = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/tasks/attach-task`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
      body: {
        name: taskName.value,
        group: groupSelected.value,
        description: description.value,
        dueDate: dueDate.value,
      },
    });

    if (response.status === "success") {
      const task = response.data.task;
      closeForm();
      emit("updateTasks", task);
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

label {
  font-weight: bold;
}

form div {
  margin-bottom: 15px;
}
</style>
