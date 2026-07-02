<script setup>
import { ref, onMounted } from "vue";
import AppBar from "../components/AppBar.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import { useTheme } from "vuetify";
import { Debounce } from "../composables/debounce";
import { useSettings } from "../composables/settings.js";
const { saveUpdateSettings, localSettings, defaultNodePosition } = useSettings();
const theme = useTheme();

const themes = ['system', 'dark', 'light'];
const selectedTheme = ref(localSettings.value.theme ?? 'dark');

async function changeTheme(variant) {
  theme.change(variant);
  localSettings.value.theme = variant;
  await saveUpdateSettings();
}

const nodePosForm = ref();
const nodePosRules = [
  value => {
    if (Number(value) > 1000) return 'Invalid value';
    return true;
  }, value => {
    if (Number(value) < -1000) return 'Invalid value';
    return true;
  },
  value => {
    const regex = /^-?[0-9]*$/;
    if (!regex.test(value)) {
      return 'Invalid value';
    }
    return true;
  },
]

const defaultPos = ref({
  X: defaultNodePosition,
  Y: defaultNodePosition
})

async function setDefaultNodePos() {
  Debounce.cancelDebounce();
  localSettings.value.default_pos_x = defaultPos.value.X === "" ? defaultNodePosition : Number(defaultPos.value.X);
  localSettings.value.default_pos_y = defaultPos.value.Y === "" ? defaultNodePosition : Number(defaultPos.value.Y);
  Debounce.saveDebounce(500, async () => await saveUpdateSettings());
}

onMounted(() => {
  defaultPos.value.X = localSettings.value.default_pos_x ?? defaultNodePosition;
  defaultPos.value.Y = localSettings.value.default_pos_y ?? defaultNodePosition;
})

</script>
<template>
  <v-app>
    <AppBar bar-title="Settings" />
    <v-main>
      <v-container>
        <v-select label="Theme" :items="themes" @update:modelValue="value => changeTheme(value)"
          v-model="selectedTheme">
        </v-select>
        <div class="text-title-medium text-medium-emphasis">Default node position</div>
        <div class="text-body-medium text-medium-emphasis pb-4">Set the default spawning position for passage nodes.
        </div>
        <v-form ref="nodePosForm" @keyup="setDefaultNodePos">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="x-axis" :rules="nodePosRules" :placeholder="defaultNodePosition.toString()"
                v-model="defaultPos.X"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="y-axis" :rules="nodePosRules" :placeholder="defaultNodePosition.toString()"
                v-model="defaultPos.Y"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <LogoutButton />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped></style>
