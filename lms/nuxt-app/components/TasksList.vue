<template>
  <div class="tasks-container">
    <div
      v-for="task in tasks"
      :key="task._id"
      class="task-card"
      @click="selectTask(task)"
    >
      <h3 class="task-title">{{ task.name }}</h3>
      <div class="task-meta">
        <span class="task-date"
          >Due: {{ new Date(task.dueDate).toLocaleDateString() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["taskSelected"]);

const selectTask = (task) => {
  emit("taskSelected", task);
};
</script>

<style scoped>
.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.task-description {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #718096;
}
</style>
