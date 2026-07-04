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

async function createLoginRequest(username, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  return response;
}

async function createLogoutRequest() {
  const response = await fetch("/api/logOut", {
    method: "POST",
  });

  return response;
}

async function createGetAuthStatusRequest() {
  const response = await fetch("/api/loginStatus", {
    method: "GET",
  });
  return response;
}

export {
  createRegisterRequest,
  createLoginRequest,
  createLogoutRequest,
  createGetAuthStatusRequest,
};
