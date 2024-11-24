<template>
  <div
    class="card text-center border border-green-600 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white"
  >
    <NuxtLink :to="`/chats/${chat._id}`" class="block p-4">
      <p class="font-semibold text-gray-800 truncate">{{ chat.roomName }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
const { chat } = defineProps(["chat"]);
</script>

<style scoped>
.thumb {
  max-height: 120px;
  max-width: 70%;
  margin: 0 auto;
}
</style>
