<template>
  <div class="flex flex-wrap gap-2 mt-4">
    <div
      v-for="member in members"
      :key="`selected-${member._id}`"
      class="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full"
    >
      <i class="material-icons mt-2 rounded-full object-cover">person</i>
      <span class="text-sm text-blue-700">{{ member.username }}</span>
      <button
        type="button"
        @click="removeMember(member)"
        class="text-blue-700 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["remove"]);
const removeMember = (member) => {
  emit("remove", member);
};
</script>

<style scoped></style>
