<template>
  <div class="main">
    <header class="shadow-sm bg-white">
      <SiteHeader />
      <!-- <nav class="container p-4">
        <NuxtLink to="/chats" class="font-bold">LMS chats</NuxtLink>
      </nav> -->
    </header>
    <div class="flex flex-row chats-container h-[calc(100vh-120px)]">
      <NavMenu class="flex-shrink-0" />
      <div class="flex-1 p-4 flex flex-col">
        <span class="font-bold text-2xl mb-4">Messages</span>
        <div class="flex flex-row gap-20 flex-1">
          <div class="chats-list">
            <ChatsList />
          </div>

          <div class="chatroom">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatsList from "~/components/Chat/ChatsList.vue";
// import ChatRoom from "~/components/Chat/ChatRoom.vue";
</script>

<style scoped>
.router-link-exact-active {
  color: #12b488;
}

.chats-list {
  border-radius: 4px;
  border: solid 1px #12b488;
  width: 20vw;
  height: 70%;
  overflow-y: auto;
  padding: 10px;
}

.chatroom {
  width: 40vw;
  height: 100%;
  overflow-y: auto;
}

.main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.chats-container {
  flex: 1;
}
</style>
