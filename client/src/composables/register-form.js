import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFlash } from "./flash.js";
import { capitalizeFirstLetter } from "./helpers.js";
import { createRegisterRequest } from "../api/auth-api.js";

export function useRegisterForm() {
  const router = useRouter();
  const { setFlash } = useFlash();

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

  function validateField(field_ref, field_name) {
    let error = false;
    if (field_ref.length === 0) {
      errorMsgs.value[field_name] =
        `${capitalizeFirstLetter(field_name)} is empty!`;
      error = true;
    } else {
      if (field_name === "username" && field_ref.length > 20) {
        errorMsgs.value[field_name] =
          `${capitalizeFirstLetter(field_name)} cannot be more than 20 characters.`;
        error = true;
      } else if (
        (field_name === "password" || field_name === "confirmPassword") &&
        (field_ref.length < 8 || field_ref.length > 30)
      ) {
        errorMsgs.value[field_name] =
          `${capitalizeFirstLetter(field_name)} cannot be more than 30 characters or less than 8 characters.`;
        error = true;
      } else {
        errorMsgs.value[field_name] = "";
      }
    }

    return error;
  }

  const formMapping = ref({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const errorMsgs = ref({
    global: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  return {
    router,
    formMapping,
    validateField,
    errorMsgs,
    submitRegister,
  };
}
