import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFlash } from "./flash.js";
import { capitalizeFirstLetter } from "./helpers.js";
import { createRegisterRequest } from "../api/auth-api.js";

export function RegisterForm() {
  const router = useRouter();
  const { setFlash } = useFlash();

  const globalErrorMsg = ref("");
  const form = ref();

  async function submitRegister() {
    try {
      const response = await createRegisterRequest(
        formMapping.value.username,
        formMapping.value.password,
        formMapping.value.confirmPassword,
      );

      if (!response.ok) {
        const responseErrorMsg = (await response.json()).errorMsg;
        if ([400, 409].includes(Number(response.status))) {
          if (responseErrorMsg.global.includes("exists")) {
            globalErrorMsg.value = responseErrorMsg.global;
          } else {
            globalErrorMsg.value = `Register request rejected. Correct your values and try again.`;
          }
        } else {
          globalErrorMsg.value = `HTTP error ${response.status}: ${responseErrorMsg}`;
        }
      } else {
        // handle ok response
        setFlash("success", "Registration Successful! Please login.");
        router.replace({ path: "/login" });
      }
    } catch (error) {
      globalErrorMsg.value = `Server Error. Please try again later.`;
    }
  }

  const formMapping = ref({
    username: "",
    password: "",
    confirmPassword: "",
  });

  return {
    router,
    form,
    formMapping,
    globalErrorMsg,
    submitRegister,
  };
}
