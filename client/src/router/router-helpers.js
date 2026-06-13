import { useRouter } from "vue-router";

async function guard(to, from, next) {
  const router = useRouter();
  try {
    const response = await fetch("/api/loginStatus", {
      method: "GET",
    });

    const body = await response.json();
    if (body.currentUser) {
      next();
    } else {
      router.replace({ path: "/login" });
    }
  } catch (error) {
    router.replace({ path: "/login" });
  }
}

export { guard };
