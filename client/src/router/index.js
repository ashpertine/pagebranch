import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
//import HomepageView from "../views/HomepageView.vue";

const routes = [
  { path: "/register", component: RegisterView },
  { path: "/login", component: LoginView },
  //{ path: "/home", component: HomepageView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
