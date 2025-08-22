import { defineStore } from "pinia";
import type { IUser } from "../types/user";

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

// user credentials
export const useUserStore = defineStore("user", {
  state: () => ({
    user: { id: -9, username: "" },
  }),
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
    getUser() {
      return this.user;
    },
  },
});
