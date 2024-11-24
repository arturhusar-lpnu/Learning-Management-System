<template>
  <div v-if="userRole !== 'student'">
    <button @click="addTask">Add new Task</button>
    <AsignTaskForm
      :user="store.user"
      :token="store.token"
      :show="showModal"
      @close="showModal = false"
    />
  </div>
  <div class="tasks-layout">
    <div class="tasks-column">
      <h2>ToDo</h2>
      <div class="task-list">
        <TasksList :tasks="toDoTasks" @taskSelected="selectTask" />
      </div>
    </div>
    <div class="tasks-column">
      <h2>In Progress</h2>
      <div class="task-list">
        <TasksList :tasks="inProgressTasks" @taskSelected="selectTask" />
      </div>
    </div>
    <div class="tasks-column">
      <h2>Done</h2>
      <div class="task-list">
        <TasksList :tasks="doneTasks" @taskSelected="selectTask" />
      </div>
    </div>

    <UpdateTaskForm
      v-if="selectedTask"
      :task="selectedTask"
      :show="showUpdateModal"
      @close="closeUpdateForm"
      @updateTasks="updateTasks"
    />
  </div>
</template>

<script setup>
import UpdateTaskForm from "~/components/UpdateTaskForm.vue";
import TasksList from "~/components/TasksList.vue";
import { useUserStore } from "~/store/user";
const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

const userRole = computed(() => store.user.role);

const showModal = ref(false);
const showUpdateModal = ref(false);
const selectedTask = ref(null);
const toDoTasks = ref([]);
const inProgressTasks = ref([]);
const doneTasks = ref([]);

let tasks = [];

onMounted(async () => {
  await fetchTasks();
});

definePageMeta({
  middleware: "auth",
});

const addTask = () => {
  showModal.value = true;
};

const selectTask = (task) => {
  selectedTask.value = task;
  showUpdateModal.value = true;
};

const closeUpdateForm = () => {
  showUpdateModal.value = false;
  selectedTask.value = null;
};

const filterTasks = (tasks) => {
  toDoTasks.value = tasks.filter((task) => task.board === "ToDo");
  inProgressTasks.value = tasks.filter((task) => task.board === "In Progress");
  doneTasks.value = tasks.filter((task) => task.board === "Done");
};

const updateTasks = (task) => {
  const index = tasks.findIndex((t) => t._id === task._id);
  if (index !== -1) {
    tasks[index] = task;
    filterTasks(tasks);
  }
};
const fetchTasks = async () => {
  const userId = store.user._id;
  try {
    const response = await $fetch(`${apiUrl}/api/tasks/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === "success") {
      tasks = response.data.tasks;
      filterTasks(tasks);
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  font-size: 30px;
}
p {
  margin: 20px 0;
}
.tasks-layout {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
.tasks-column {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9f9f9;
}
.tasks-column h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
