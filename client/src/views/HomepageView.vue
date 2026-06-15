<script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import StoryCreationWindow from "../components/StoryCreationWindow.vue";
  import StoryTile from "../components/StoryTile.vue"; 

  const stories = ref([]);
  const router = useRouter(); 
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

    const body = await response.json();
    if(response.ok) {
      console.log(body);
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
  <div>
    <div v-for="story in stories">
      <StoryTile :title="story.story_title" :key="story.id" :story-id="story.id" :created-at=story.created_at :updated-at=story.updated_at />
    </div>
  </div>
</template>
<style scoped>
  
</style>
