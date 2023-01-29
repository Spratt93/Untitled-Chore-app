import { createRouter, createWebHistory } from "vue-router";
import Root from "../views/Root.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: Root,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/home/dashboard",
      name: "home-dashboard",
      component: () => import("../views/home/HomeDashboard.vue"),
    },
    {
      path: "/home/create",
      name: "create-home",
      component: () => import("../views/home/CreateHome.vue"),
    },
    {
      path: "/chores",
      name: "chores",
      component: () => import("../views/chores/Chores.vue"),
    },
    {
      path: "/chores/create",
      name: "create-chore",
      component: () => import("../views/chores/CreateChore.vue"),
    },
    {
      path: "/help",
      name: "help",
      component: () => import("../views/Help.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../views/User.vue"),
    },
  ],
});

export default router;
