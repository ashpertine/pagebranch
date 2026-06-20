import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import HomepageView from "../views/HomepageView.vue";
import EditorView from "../views/EditorView.vue";
import { getAuthStatus } from "./router-helpers.js";

const routes = [
  {
    name: "Register",
    path: "/register",
    component: RegisterView,
  },
  {
    name: "Login",
    path: "/login",
    component: LoginView,
  },
  {
    name: "Homepage",
    path: "/home",
    component: HomepageView,
  },
  {
    name: "Editor",
    path: "/edit/:storyId",
    component: EditorView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const isAuthenticated = await getAuthStatus();
  if (isAuthenticated) {
    if (to.path === "/" || to.name === "Login" || to.name === "Register") {
      return { name: "Homepage" };
    }

    return true;
  } else {
    if (to.name === "Login" || to.name === "Register") {
      return true;
    } else {
      return { name: "Login" };
    }
  }
});

export default router;
