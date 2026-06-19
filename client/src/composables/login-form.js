import { ref } from "vue";
import { useRouter } from "vue-router";
import { capitalizeFirstLetter } from "./helpers.js";
import { createLoginRequest } from "../api/auth-api.js";

export function LoginForm() {
  const router = useRouter();

  async function submitLogin() {
    try {
      const response = await createLoginRequest(
        formMapping.value.username,
        formMapping.value.password,
      );

      if (!response.ok) {
        const responseErrorMsg = (await response.json()).errorMsg;
        if (Number(response.status) !== 200) {
          globalErrorMsg.value = `Login request rejected. Correct your values and try again.`;
        }
      } else {
        router.replace({ path: "/home" });
      }
    } catch (error) {
      globalErrorMsg.value = `HTTP error ${response.status}: ${responseErrorMsg}`;
    }
  }

  const formMapping = ref({
    username: "",
    password: "",
  });

  const globalErrorMsg = ref("");
  const form = ref();

  return {
    router,
    formMapping,
    form,
    globalErrorMsg,
    submitLogin,
  };
}
