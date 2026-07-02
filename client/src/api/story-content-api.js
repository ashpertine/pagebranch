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

async function createMakePassageRequest(
  story_id,
  title,
  description,
  pos_x,
  pos_y,
) {
  try {
    const response = await fetch(`/api/stories/${story_id}/passage/new`, {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        pos_x,
        pos_y,
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

async function createMakeChoiceRequest(
  story_id,
  label,
  from_passage_id,
  to_passage_id,
) {
  try {
    const response = await fetch(`/api/stories/${story_id}/choice/new`, {
      method: "POST",
      body: JSON.stringify({
        label: label,
        from_passage_id: from_passage_id,
        to_passage_id: to_passage_id,
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

async function createUpdateChoiceRequest(
  story_id,
  choice_id,
  label,
  from_passage_id,
  to_passage_id,
) {
  try {
    const response = await fetch(
      `/api/stories/${story_id}/choice/${choice_id}/update`,
      {
        method: "PATCH",
        body: JSON.stringify({
          label: label,
          from_passage_id: from_passage_id,
          to_passage_id: to_passage_id,
        }),
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

async function createUpdateChoiceSortOrderRequest(
  story_id,
  choice_id,
  sort_order,
) {
  try {
    const response = await fetch(
      `/api/stories/${story_id}/choice/${choice_id}/update-sort`,
      {
        method: "PATCH",
        body: JSON.stringify({
          sort_order: sort_order,
        }),
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

async function createDeleteChoiceRequest(story_id, choice_id) {
  try {
    const response = await fetch(
      `/api/stories/${story_id}/choice/${choice_id}/delete`,
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

async function createSetStartPassageRequest(story_id, passage_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}/update-start/`, {
      method: "PATCH",
      body: JSON.stringify({
        passageId: passage_id,
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

async function createGetStartPassageRequest(story_id) {
  try {
    const response = await fetch(`/api/stories/${story_id}/get-start/`, {
      method: "GET",
    });

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
  createMakeChoiceRequest,
  createUpdateChoiceRequest,
  createUpdateChoiceSortOrderRequest,
  createDeleteChoiceRequest,
  createSetStartPassageRequest,
  createGetStartPassageRequest,
};
