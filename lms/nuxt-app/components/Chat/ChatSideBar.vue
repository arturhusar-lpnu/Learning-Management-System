<template>
  <div class="w-64 border-r border-gray-200 h-full">
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Chat room</h2>
        <button
          @click="$emit('new-room')"
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          + New chat room
        </button>
      </div>
      <div class="space-y-2">
        <div
          v-for="room in rooms"
          :key="room._id"
          @click="$emit('select-room', room)"
          class="p-2 rounded hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-gray-100': selectedRoom?._id === room._id }"
        >
          {{ room.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
  selectedRoom: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped></style>
