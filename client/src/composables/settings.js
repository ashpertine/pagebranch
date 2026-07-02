import { ref } from "vue";
import {
  createGetSettingsRequest,
  createUpdateSettingsRequest,
} from "../api/settings-api.js";
import { useRouter } from "vue-router";

const localSettings = ref({});
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

    localSettings.value = content.results.preferences;
  }

  return { saveUpdateSettings, initSettings, localSettings };
}

export { useSettings };
