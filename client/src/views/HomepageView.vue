<script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";

  // Components 
  import StoryCreationWindow from "../components/stories/StoryCreationWindow.vue";
  import StoryTile from "../components/stories/StoryTile.vue"; 
  import StoryUpdateWindow from "../components/stories/StoryUpdateWindow.vue";
  import StoryDeleteButton from "../components/stories/StoryDeleteButton.vue";
  import StoryDeleteModal from "../components/stories/StoryDeleteModal.vue";

  // Composables
  import { deleteModalBridge } from "../composables/delete-modal-bridge.js";

  // API Request functions
  import { createLogoutRequest } from "../api/auth-api.js";
  import { createMakeStoryRequest, createGetStoriesRequest } from "../api/stories-api.js";

  const router = useRouter(); 
  const stories = ref([]);
  const globalErrorMsg = ref("");

  const {
    deleteModalHidden,
    selectedDeleteStoryId,
    openDeleteModal,
    closeDeleteModal,
  } = deleteModalBridge();

  async function logout() {
    const response = await createLogoutRequest(); 
    const body = await response.json();
    if (!body.currentUser) {
      router.replace({ name: "Login" });
    } else {
      return false;
    }
  }

  async function getStories() {
    const response = await createGetStoriesRequest();
    if(response.responseErr) {
      globalErrorMsg.value = response.responseErr;
    }
    const body = await response.json();
    if (response.ok) {
      stories.value = body;
    } else {
      globalErrorMsg.value = response.responseErr;
    }
  }

  onMounted(async () => {
    await getStories(); 
  })

</script>
<template>
  <div>
    Homepage
  </div>
  <button type="button" @click="logout">Log Out</button>
  <StoryCreationWindow @stories-updated="getStories"/>
  <StoryDeleteModal :is-hidden="deleteModalHidden" @stories-updated="getStories" @close-delete-modal="closeDeleteModal" :story-id="selectedDeleteStoryId"/>
  <div v-if="globalErrorMsg.length !== 0">{{ globalErrorMsg }}</div>
  <div class="stories-view">
    <div v-for="story in stories" class="story-card">
      <StoryTile :title="story.story_title" :key="story.id" :story-id="story.id" :created-at=story.created_at :updated-at=story.updated_at />
      <StoryUpdateWindow :story-id="story.id" :current-story-title="story.story_title" @stories-updated="getStories"/>
      <StoryDeleteButton @popup-delete-modal="openDeleteModal(story.id)"/>
    </div>
  </div>
</template>
<style scoped>
  .stories-view {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .story-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid var(--light-color-border);
    border-radius: 5px;
    background-color: var(--light-background-muted);
  }

  @media (prefers-color-scheme: dark) {
    .story-card {
      background-color: var(--dark-background-muted);
      border: 1px solid var(--dark-color-border);
    }
  }
</style>
