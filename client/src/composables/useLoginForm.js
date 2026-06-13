import { ref } from "vue";
import { useRouter } from "vue-router";
import { capitalizeFirstLetter } from "./helpers.js";

export function useLoginForm() {
  const router = useRouter();

  async function createLoginResponse(username, password) {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    return response;
  }

  function validateField(field_ref, field_name) {
    let error = false;
    if (field_ref.length === 0) {
      errorMsgs.value[field_name] =
        `${capitalizeFirstLetter(field_name)} is empty!`;
      error = true;
    } else {
      errorMsgs.value[field_name] = "";
    }

    return error;
  }

  async function submitLogin() {
    try {
      const response = await createLoginResponse(
        formMapping.value.username,
        formMapping.value.password,
      );

      if (!response.ok) {
        const responseErrorMsg = (await response.json()).errorMsg;
        if (Number(response.status) !== 200) {
          errorMsgs.value.global = `${responseErrorMsg}`;
        }
      } else {
        router.replace({ path: "/home" });
      }
    } catch (error) {
      errorMsgs.value.global = `Server Error. Please try again later.`;
    }
  }

  const formMapping = ref({
    username: "",
    password: "",
  });

  const errorMsgs = ref({
    global: "",
    username: "",
    password: "",
  });

  return {
    router,
    formMapping,
    errorMsgs,
    validateField,
    submitLogin,
  };
}
