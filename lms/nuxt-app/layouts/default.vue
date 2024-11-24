<template>
  <div class="main">
    <header class="shadow-sm bg-grey-500">
      <SiteHeader />
    </header>
    <div class="flex flex-row mx-auto p-4">
      <NavMenu class="flex-shrink-0" />
      <div class="flex-1 ml-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import SiteHeader from "~/components/SiteHeader.vue";
import NavMenu from "~/components/NavMenu.vue";
</script>

<style scoped>
.router-link-exact-active {
  color: #12b488;
}
.main {
  width: 100vw;
  height: 100vh;
}
</style>
