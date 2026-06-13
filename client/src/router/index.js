import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import HomepageView from "../views/HomepageView.vue";
import { guard } from "./router-helpers.js";

const routes = [
  {
    path: "/register",
    component: RegisterView,
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/home",
    component: HomepageView,
    beforeEnter: (to, from, next) => {
      guard(to, from, next);
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
