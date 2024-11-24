<template>
  <div
    @click="$emit('selectMember', member)"
    class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border relative group"
    :class="[
      isSelected
        ? 'bg-blue-50 border-blue-200'
        : 'bg-gray-50 hover:bg-gray-100 border-gray-200',
    ]"
  >
    <!-- Avatar -->
    <div class="relative">
      <i class="material-icons">person</i>
      <span
        v-if="isSelected"
        class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-3 h-3 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </div>

    <!-- Username -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">
        {{ member.username }}
      </p>
      <!-- <p v-if="member.status" class="text-xs text-gray-500 truncate">
        {{ member.status }}
      </p> -->
    </div>

    <button
      v-if="isSelected"
      type="button"
      @click.stop="$emit('removeMember', member)"
      class="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
</template>

<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["selectMember", "removeMember"]);
</script>

<style scoped></style>
