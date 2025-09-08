import { createRouter, createWebHistory, type Router } from "vue-router";
import Home from "../components/Home/Home.vue";
import Login from "../components/auth/login.vue";
import Register from "../components/auth/register.vue";
import Stats from "../components/Stats/Stats.vue";
import games from "../components/games/games.vue";
import profile from "../components/profile/profile.vue";
import createCourse from "../components/games/create-course.vue";

const routes = [
  { path: "/", redirect: "login" },
  { path: "/home", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/stats", name: "stats", component: Stats },
  { path: "/games", name: "games", component: games },
  { path: "/profile", name: "profile", component: profile },
  { path: "/create-course", name: "create-course", component: createCourse },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function routeTo(route: string, router: Router) {
  router.replace(route);
}

export { router, routeTo };
