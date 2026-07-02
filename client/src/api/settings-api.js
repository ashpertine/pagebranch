async function createUpdateSettingsRequest(settings) {
  try {
    const response = await fetch(`/api/settings`, {
      method: "PATCH",
      body: JSON.stringify({
        preferences: settings,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

async function createGetSettingsRequest() {
  try {
    const response = await fetch(`/api/settings`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

export { createUpdateSettingsRequest, createGetSettingsRequest };
