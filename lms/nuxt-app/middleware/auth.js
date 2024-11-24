import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (
    (!userStore.user || !userStore.isAuthenticated) &&
    (to.path === "/tasks" || to.path === "/chats")
  ) {
    return navigateTo("/login");
  }
});
