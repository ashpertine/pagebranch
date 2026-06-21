async function createGetStoryContentRequest(story_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}`, {
      method: "GET",
    });

    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

async function createMakePassageRequest(story_id, title, description) {
  try {
    const response = await fetch(`/api/stories/${story_id}/passages/new`, {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
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
export { createGetStoryContentRequest, createMakePassageRequest };
