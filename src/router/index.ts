import { createRouter, createWebHistory, type Router } from "vue-router";

import Home from "../components/Home/Home.vue";
import Login from "../components/auth/login.vue";
import Register from "../components/auth/register.vue";
import Stats from "../components/range-shots/Stats.vue";
import games from "../components/games/games.vue";
import profile from "../components/profile/profile.vue";
import createCourse from "../components/games/create-course.vue";
import createGame from "../components/games/create-game.vue";
import gameViewEight from "../components/games/game-components/game-views/game-view-eight.vue";
import gameViewNine from "../components/games/game-components/game-views/game-view-nine.vue";
import statsMain from "../components/range-shots/stats-main.vue";

const routes = [
  { path: "/", redirect: "login" },
  { path: "/home", name: "home", component: Home },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/stats", name: "stats", component: Stats },
  { path: "/stats-main", name: "stats-main", component: statsMain },
  { path: "/games", name: "games", component: games },
  { path: "/profile", name: "profile", component: profile },
  { path: "/create-course", name: "create-course", component: createCourse },
  { path: "/create-game", name: "create-game", component: createGame },
  {
    path: "/game-view-eight/:game_id",
    name: "game-view-eight",
    component: gameViewEight,
  },
  {
    path: "/game-view-nine/:game_id",
    name: "game-view-nine",
    component: gameViewNine,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function routeTo(route: string, router: Router) {
  router.push(route);
}

export { router, routeTo };
