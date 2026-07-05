async function createPostRatingsRequest(story_id, rating, description) {
  try {
    const response = await fetch(`/api/rating/new`, {
      method: "POST",
      body: JSON.stringify({
        storyId: story_id,
        rating: rating,
        description: description,
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

async function createGetRatingsRequest(story_id) {
  try {
    const response = await fetch(`/api/rating/${story_id}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    return {
      responseErr: "Server error. Please try again later" + error.toString(),
    };
  }
}

export { createPostRatingsRequest, createGetRatingsRequest };
