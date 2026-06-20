<script setup> 
  import { ref } from 'vue';
  import { createLogoutRequest } from "../api/auth-api.js";
  import { useRouter } from 'vue-router';
  async function logout() {
    const response = await createLogoutRequest(); 
    const body = await response.json();
    if (!body.currentUser) {
      router.replace({ name: "Login" });
    } else {
      return false;
    }
  }

  const dialog = ref(false);
  const router = useRouter();
</script>
<template>
  <v-btn
    text="Logout"
    color="red"
    variant="tonal"
    rounded="xl"
    class="py-5"
    @click="dialog = true"
  ></v-btn>
  <v-dialog max-width="500" v-model="dialog">
    <v-card title="Are you sure?">
      <v-form class="px-5" @submit.prevent="logout">
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn
            text="Close"
            color="primary"
            size="large"
            @click="dialog = false"
          ></v-btn>
          <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-exit-to-app" color="red" >Log Out</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
