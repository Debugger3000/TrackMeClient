import { defineStore } from "pinia";
import type { IUser } from "../types/user";

export const useLoggedStore = defineStore("logged", {
  state: () => ({
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  }),
  actions: {
    login() {
      this.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout() {
      this.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || '{"id": -9, "username": ""}'),
  }),
  actions: {
    setUser(user: IUser) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    getUser() {
      return this.user;
    },
  },
});