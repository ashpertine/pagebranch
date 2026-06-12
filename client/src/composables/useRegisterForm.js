import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFlash } from "./useFlash.js";

export function useRegisterForm() {
  const router = useRouter();
  const { setFlash } = useFlash();

  async function createRegisterRequest(username, password, confirmPassword) {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, password, confirmPassword }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    return response;
  }

  async function submitRegister() {
    try {
      const response = await createRegisterRequest(
        username.value,
        password.value,
        confirmPassword.value,
      );

      if (!response.ok) {
        const responseErrorMsg = (await response.json()).errorMsg;
        if ([400, 409].includes(Number(response.status))) {
          for (const [field, message] of Object.entries(responseErrorMsg)) {
            errorMsgs.value[field] = message;
          }
        } else {
          errorMsgs.value.global = `HTTP error ${response.status}: ${responseErrorMsg}`;
        }
      } else {
        // handle ok response
        setFlash("success", "Registration Successful! Please login.");
        router.replace({ path: "/login" });
      }
    } catch (error) {
      errorMsgs.value.global = `Server Error. Please try again later.`;
    }
  }

  const username = ref("");
  const password = ref("");
  const confirmPassword = ref("");

  const errorMsgs = ref({
    global: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  return {
    router,
    username,
    password,
    confirmPassword,
    errorMsgs,
    submitRegister,
  };
}
