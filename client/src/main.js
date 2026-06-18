import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./assets/stylesheets/globals.css";
createApp(App).use(router).mount("#app");
