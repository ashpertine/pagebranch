import { useRouter } from "vue-router";

async function getAuthStatus() {
  const router = useRouter();
  try {
    const response = await fetch("/api/loginStatus", {
      method: "GET",
    });

    const body = await response.json();
    if (body.currentUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export { getAuthStatus };
