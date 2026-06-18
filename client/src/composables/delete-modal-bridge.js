import { ref } from "vue";

function deleteModalBridge() {
  const deleteModalHidden = ref(true);
  const selectedDeleteStoryId = ref(0);

  function openDeleteModal(story_id) {
    deleteModalHidden.value = false;
    selectedDeleteStoryId.value = story_id;
  }

  function closeDeleteModal() {
    deleteModalHidden.value = true;
  }

  return {
    deleteModalHidden,
    selectedDeleteStoryId,
    openDeleteModal,
    closeDeleteModal,
  };
}

export { deleteModalBridge };
