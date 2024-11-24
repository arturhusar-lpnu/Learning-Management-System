import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    setUserData({ user, token }) {
      this.user = user;
      this.token = token;
      localStorage.setItem("user", user);
      localStorage.setItem("authToken", token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
  },
});
