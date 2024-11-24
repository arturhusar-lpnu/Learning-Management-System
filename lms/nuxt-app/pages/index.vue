<template>
  <div v-if="store.isAuthenticated">
    <h2>Hello, {{ store.user.username }}</h2>
    <p>If you want to log out press on the button in the header</p>
  </div>
  <div v-if="!store.isAuthenticated">
    <h2>Welcome to our site</h2>
    <p>To proceed please log in</p>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/user";
const store = useUserStore();
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  font-size: 30px;
}
p {
  margin: 20px 0;
}
</style>
