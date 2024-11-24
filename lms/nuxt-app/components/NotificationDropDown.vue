<template>
  <div v-if="showNotifications">
    <div class="px-4 py-2 border-b border-gray-100">
      <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
    </div>

    <div class="max-h-96 overflow-y-auto">
      <div
        v-if="notifications.length === 0"
        class="px-4 py-3 text-sm text-gray-500"
      >
        No notifications
      </div>

      <a
        v-for="notification in notifications"
        :key="notification._id"
        href="#"
        :class="[
          'block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150',
          { 'bg-blue-50': !notification.read },
        ]"
        @click="markAsRead(notification)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- Notification Icon -->
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-500 mt-1">
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ new Date(notification.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </a>
    </div>

    <div class="border-t border-gray-100 px-4 py-2">
      <button
        v-if="unreadNotifications.length"
        @click="markAllAsRead"
        class="text-sm text-blue-600 hover:text-blue-500"
      >
        Mark all as read
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/store/user";
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const store = useUserStore();

const props = defineProps({
  showNotifications: {
    type: Boolean,
    required: true,
  },
  notifications: {
    type: Array,
    required: true,
  },
});
const unreadNotifications = ref([]);

onMounted(() => {
  if (props.notifications.value);
});

const markAsRead = async (notification) => {
  if (notification.read == true) {
    console.log(1);
    return;
  }
  try {
    const response = $fetch(
      `${apiUrl}/api/users/notifications/update-status/${notification._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${store.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === "success") {
      notification.read = true;
    }
  } catch (err) {}
};

const markAllAsRead = async () => {
  await Promise.all(
    unreadNotifications.value.forEach(async (n) => {
      await markAsRead(n);
    })
  );
};
</script>

<style scoped></style>
