<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <div class="font-bold">
          <span>LMS</span>
        </div>
        <div class="flex flex-row gap-10">
          <div
            div
            v-if="store.isAuthenticated"
            class="relative flex items-center"
          >
            <button
              @click="openCloseNotifications"
              class="flex hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <i class="material-icons mr-2">notifications</i>
            </button>
            <div class="notifications">
              <NotificationDropDown
                :showNotifications="showDropDown"
                :notifications="notifications"
                class="absolute right-0 mt-4 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
              />
            </div>
          </div>
          <div v-if="store.isAuthenticated" class="flex items-center">
            <div
              class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
            >
              {{ store.getUser.username.charAt(0).toUpperCase() }}
            </div>
            <span class="ml-3 font-medium text-gray-900">
              {{ store.getUser.username }}
            </span>
          </div>
          <button
            v-if="!store.isAuthenticated && routeName != 'login'"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            @click="logIn"
          >
            Log In
          </button>
          <button
            v-if="store.isAuthenticated"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            @click="logOut"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";
const showDropDown = ref(false);
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const notifications = ref([]);
let routeName = ref(useRoute().name);
const route = useRoute();
const socket = useSocket().getSocket();
const store = useUserStore();
watch(
  route,
  (value) => {
    routeName.value = value.name;
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  socket.on("notification", (notification) => {
    notifications.value.push(notification);
  });
});

const fetchNotifications = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/users/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === "success") {
      notifications.value = response.data.notifications;
    }
  } catch (error) {}
};

const openCloseNotifications = async () => {
  if (showDropDown.value == true) {
    showDropDown.value = false;
    return;
  }
  await fetchNotifications();
  showDropDown.value = true;
};

const logOut = () => {
  navigateTo("/");
  store.logout();
};
const logIn = () => {
  navigateTo("/login");
};
</script>

<style scoped>
.bg-green {
  background-color: #12b488;
  color: white;
}
</style>
