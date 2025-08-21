import { defineStore } from "pinia";

export const useLoggedStore = defineStore("logged", {
  state: () => ({
    isLoggedIn: false as boolean,
  }),
  actions: {
    login() {
      this.isLoggedIn = true;
    },
    logout() {
      this.isLoggedIn = false;
    },
  },
});
