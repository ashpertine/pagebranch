import { ref } from "vue";

const flash = ref({});

export function useFlash() {
  function setFlash(type, message) {
    flash.value.type = type;
    flash.value.message = message;
  }

  function consumeFlash() {
    const current = flash.value;
    flash.value = {};
    return current;
  }

  return { flash, setFlash, consumeFlash };
}
