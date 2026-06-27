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
    const response = await fetch(`/api/stories/${story_id}/passage/new`, {
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

async function createUpdatePassagesRequest(story_id, passage_arr) {
  try {
    // each passage should ontain id, title, description, pos_x, pos_y
    const response = await fetch(`/api/stories/${story_id}/passage/update`, {
      method: "PATCH",
      body: JSON.stringify({
        passages: passage_arr,
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

async function createDeletePassageRequest(story_id, passage_id) {
  try {
    const response = await fetch(
      `/api/stories/${story_id}/passage/${passage_id}/delete`,
      {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );

    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

export {
  createGetStoryContentRequest,
  createMakePassageRequest,
  createUpdatePassagesRequest,
  createDeletePassageRequest,
};
