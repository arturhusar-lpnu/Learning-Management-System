<template>
  <div>
    <nav class="flex p-4 flex-col">
      <ul class="flex flex-col gap-4">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li v-if="store.isAuthenticated">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </li>
        <li v-if="store.isAuthenticated">
          <NuxtLink to="/chats">Chats</NuxtLink>
        </li>
        <li v-if="store.isAuthenticated">
          <NuxtLink to="/tasks" class="btn">Tasks</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/user";

const store = useUserStore();
</script>

<style lang="scss" scoped></style>
