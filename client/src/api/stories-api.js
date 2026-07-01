async function createDeleteStoryRequest(story_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}/delete`, {
      method: "DELETE",
    });

    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

async function createUpdateStoryRequest(story_title, story_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}/update`, {
      method: "PATCH",
      body: JSON.stringify({ story_title }),
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

async function createMakeStoryRequest(story_title) {
  try {
    const response = await fetch("/api/stories/new", {
      method: "POST",
      body: JSON.stringify({ story_title }),
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

async function createGetStoriesRequest() {
  try {
    const response = await fetch("/api/stories", {
      method: "GET",
    });

    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

async function createUpdatePinRequest(story_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}/pin`, {
      method: "PATCH",
    });

    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

export {
  createDeleteStoryRequest,
  createUpdateStoryRequest,
  createMakeStoryRequest,
  createGetStoriesRequest,
  createUpdatePinRequest,
};
