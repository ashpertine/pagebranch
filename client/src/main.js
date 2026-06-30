import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "unfonts.css";

// Vuetify
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: "#534AB7",
          secondary: "#3C3489",
          accent: "#AFA9EC",
          success: "#1D9E75",
          warning: "#BA7517",
          error: "#E24B4A",
          info: "#378ADD",
        },
      },
      dark: {
        colors: {
          primary: "#7b72df",
          secondary: "#645cb1",
          accent: "#c3bdff",
          success: "#45c69d",
          warning: "#d89335",
          error: "#ff7372",
          info: "#5fb2ff",
        },
      },
    },
  },
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
  },
  components,
  directives,
});

createApp(App).use(router).use(vuetify).mount("#app");
