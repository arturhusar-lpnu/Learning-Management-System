<template>
  <!-- <div>
    <h2>Chats</h2>
    <div class="grid grid-cols-4 gap-5">
      <div v-for="ch in products">
        <ChatCard :chat="ch" />
      </div>
    </div>
  </div> -->
</template>

<script setup>
definePageMeta({
  layout: "chats",
  middleware: "auth",
});
// const { data: products } = await useFetch("https://fakestoreapi.com/products");

// useHead({
//   title: "Student LMS | Chats",
//   meta: [
//     {
//       name: "description",
//       content: "Chats",
//     },
//   ],
// });
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
