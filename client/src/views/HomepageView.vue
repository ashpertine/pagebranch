<script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import StoryCreationWindow from "../components/StoryCreationWindow.vue";
  import StoryTile from "../components/StoryTile.vue"; 
  import StoryUpdateWindow from "../components/StoryUpdateWindow.vue";
  import StoryDeleteButton from "../components/StoryDeleteButton.vue";
  import StoryDeleteModal from "../components/StoryDeleteModal.vue";

  const stories = ref([]);
  const router = useRouter(); 

  const deleteModalHidden = ref(true);
  const selectedDeleteStoryId = ref(0);

  function openDeleteModal(story_id) {
    deleteModalHidden.value = false;
    selectedDeleteStoryId.value = story_id;
  }

  function closeDeleteModal(story_id) {
    deleteModalHidden.value = true;
  }

  async function createLogoutRequest() {
   const response = await fetch('/api/logOut', {
    method: "POST",
   }) ;

    const body = await response.json();
    if (!body.currentUser) {
      router.replace({name: "Login"});
    } else {
      return false;
    }
  }

  async function createGetStoriesRequest() {
    const response = await fetch('/api/stories', {
      method: "GET",
    });

    const body = (await response.json())  
    if(response.ok) {
      stories.value = body;
    }else {
      return {
        responseError: "Server error. Please try again later."  
      }
    }
  } 

  onMounted(async () => {
    await createGetStoriesRequest(); 
  })

</script>
<template>
  <div>
    Homepage
  </div>
  <button type="button" @click="createLogoutRequest">Log Out</button>
  <StoryCreationWindow @stories-updated="createGetStoriesRequest"/>
  <StoryDeleteModal :is-hidden="deleteModalHidden" @stories-updated="createGetStoriesRequest" @close-delete-modal="closeDeleteModal" :story-id="selectedDeleteStoryId"/>
  <div class="stories-view">
    <div v-for="story in stories" class="story-card">
      <StoryTile :title="story.story_title" :key="story.id" :story-id="story.id" :created-at=story.created_at :updated-at=story.updated_at />
      <StoryUpdateWindow :story-id="story.id" :current-story-title="story.story_title" @stories-updated="createGetStoriesRequest"/>
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
    border: 2px solid black; 
  }
   
</style>
