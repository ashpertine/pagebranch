<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import StoryDeleteDialog from './StoryDeleteDialog.vue';
import StoryUpdateDialog from './StoryUpdateDialog.vue';
const props = defineProps(['title', 'storyId', 'authorId', 'createdAt', 'updatedAt', 'isPinned', 'isPrivate', 'startPassageId', 'shareSlug']);
const emit = defineEmits(['stories-updated']);
const router = useRouter();
const deleteDialog = ref(false);
const updateDialog = ref(false);
import { createUpdatePinRequest, createTogglePrivacyRequest } from "../../api/stories-api";

const titleTruncated = computed(() => {
  if (props.title.length > 22) {
    return (props.title.slice(0, 22) + "...");
  } else {
    return (props.title);
  }
})

async function goToEditor() {
  router.push({
    name: "Editor",
    params: {
      storyId:
        props.storyId,
    },
  });
}

async function viewStory() {
  console.log(props.authorId);
  console.log(props.shareSlug);
  router.push({
    name: "ReadingPage",
    params: {
      userId: props.authorId,
      shareSlug: props.shareSlug
    }
  })
}

const updatedAtFormatted = computed(() => {
  const newDate = new Date(props.updatedAt);
  return newDate.toLocaleString("en-SG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });
})

const createdAtFormatted = computed(() => {
  const newDate = new Date(props.createdAt);
  return newDate.toLocaleString("en-SG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
})

async function savePinUpdate() {
  const response = await createUpdatePinRequest(props.storyId);
  if (response.responseErr) {
    return router.replace({ name: "Error" })
  }
  emit('stories-updated');
}

async function saveTogglePrivacy() {
  const response = await createTogglePrivacyRequest(props.storyId);
  if (response.responseErr) {
    return router.replace({ name: "Error" })
  }
  emit('stories-updated');
}

</script>
<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <v-tooltip v-if="title !== titleTruncated" :text="title">
          <template v-slot:activator="{ props }">
            <span class="text-headline-small" v-bind="props"> {{ titleTruncated }} </span>
          </template>
        </v-tooltip>
        <span v-else class="text-headline-small" v-bind="props"> {{ titleTruncated }} </span>
        <v-icon icon="mdi-pin" v-if="isPinned" color="grey-darken-1" size="x-small"></v-icon>
      </div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon-btn icon="mdi-dots-vertical" v-bind="props"></v-icon-btn>
        </template>
        <v-list>
          <v-list-item value="privacy" prepend-icon="mdi-eye" @click="saveTogglePrivacy" v-if="startPassageId">
            <v-list-item-title>
              Set as {{ isPrivate ? 'public' : 'private' }}
            </v-list-item-title>
          </v-list-item>
          <v-tooltip text="Please set a start passage before changing this settings." v-else>
            <template v-slot:activator="{ props }">
              <v-list-item value="privacy" prepend-icon="mdi-eye" class="text-disabled" v-bind="props"
                @hover="(event) => event.preventDefault()" :ripple="false">
                <v-list-item-title v-bind="props" class="text-disabled">
                  Set as {{ isPrivate ? 'public' : 'private' }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-tooltip>
          <v-list-item value="pin" prepend-icon="mdi-pin-off" @click="savePinUpdate" v-if="isPinned">
            <v-list-item-title>
              Unpin
            </v-list-item-title>
          </v-list-item>
          <v-list-item value="pin" prepend-icon="mdi-pin" @click="savePinUpdate" v-else>
            <v-list-item-title>
              Pin
            </v-list-item-title>
          </v-list-item>
          <v-list-item value="update" @click="updateDialog = true">
            <v-list-item-title>
              Edit Name
            </v-list-item-title>
          </v-list-item>
          <v-list-item value="delete" @click="deleteDialog = true">
            <v-list-item-title>
              Delete
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>
      <span class="text-title-small"> Updated: {{ updatedAtFormatted }} (Created: {{ createdAtFormatted }})</span>
    </v-card-subtitle>
    <v-card-actions class="d-flex justify-end">
      <v-btn variant="flat" class="px-4" color="info" @click="viewStory" v-if="!isPrivate">View
        Story</v-btn>
      <v-btn variant="flat" class="px-4" color="success" @click="goToEditor">Edit</v-btn>
    </v-card-actions>
  </v-card>
  <StoryDeleteDialog v-model="deleteDialog" @close-delete-dialog="deleteDialog = false" :story-id="storyId"
    @stories-updated="$emit('stories-updated')" />
  <StoryUpdateDialog v-model="updateDialog" @close-update-dialog="updateDialog = false" :story-id="storyId"
    :current-story-title="title" @stories-updated="$emit('stories-updated')" />
</template>
<style scoped></style>
