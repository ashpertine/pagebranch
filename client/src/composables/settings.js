import { ref } from "vue";
import {
  createGetSettingsRequest,
  createUpdateSettingsRequest,
} from "../api/settings-api.js";
import { createGetAuthStatusRequest } from "../api/auth-api.js";
import { useRouter } from "vue-router";

const localSettings = ref({});
const globalUserId = ref(null);
const defaultNodePosition = 150;
function useSettings() {
  const router = useRouter();

  async function saveUpdateSettings() {
    const response = await createUpdateSettingsRequest(localSettings.value);

    if (!response.ok) {
      router.replace({ name: "Error" });
    }
  }

  async function initSettings() {
    const response = await createGetSettingsRequest();
    const content = await response.json();
    if (!response.ok) {
      localSettings.value = content.default;
    }

    if (content.results) {
      localSettings.value = content.results.preferences;
    }
  }

  async function storeCurrentUser() {
    const response = await createGetAuthStatusRequest();
    const content = await response.json();
    if (!response.ok) {
      return;
    }
    const currentUser = content.userId;
    globalUserId.value = content.currentUser ? currentUser : null;
  }

  return {
    saveUpdateSettings,
    initSettings,
    localSettings,
    globalUserId,
    storeCurrentUser,
    defaultNodePosition,
  };
}

export { useSettings };
