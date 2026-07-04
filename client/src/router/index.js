import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import HomepageView from "../views/HomepageView.vue";
import EditorView from "../views/EditorView.vue";
import { createGetAuthStatusRequest } from "../api/auth-api";
import ErrorView from "@/views/ErrorView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ReadingView from "@/views/ReadingView.vue";

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
    name: "ReadingPage",
    path: "/read/:userId/:shareSlug",
    component: ReadingView,
  },
  {
    name: "Settings",
    path: "/settings",
    component: SettingsView,
  },
  {
    name: "Editor",
    path: "/edit/:storyId",
    component: EditorView,
  },
  {
    name: "Error",
    path: "/error",
    component: ErrorView,
  },
  {
    name: "FallbackError",
    path: "/:pathName(.*)*",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  if (to.name === "ReadingPage") {
    return true;
  }

  const response = await createGetAuthStatusRequest();
  const body = await response.json();
  const isAuthenticated = body.currentUser ? true : false;

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
