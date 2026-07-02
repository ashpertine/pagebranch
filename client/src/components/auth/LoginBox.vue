<script setup>
import { LoginForm } from '../../composables/login-form.js';
import FlashMessage from '../../components/FlashMessage.vue';
const { form, formMapping, globalErrorMsg, submitLogin } = LoginForm()
import { useTheme } from 'vuetify';
import { useSettings } from '../../composables/settings.js';
import { useRouter } from "vue-router";


const theme = useTheme();
const { initSettings, localSettings } = useSettings();
const router = useRouter();

const usernameRules = [
  value => {
    if (value) return true
    return 'Username is empty!'
  },
  value => {
    if (value?.length <= 20) return true

    return 'Username cannot be more than 20 characters.'
  },
]


const passwordRules = [
  value => {
    if (value) return true;
    return 'Password is empty!';
  },
  value => {
    if (value?.length <= 8) return 'Password cannot be less than 8 characters';
    else if (value?.length >= 30) return 'Password cannot be more than 30 characters';
    return true;
  },
]

async function verifyAndSubmit() {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }

  const response = await submitLogin();
  if (response.ok) {
    await initSettings();
    const userTheme = localSettings.value.theme ?? "dark";
    theme.change(userTheme);
    router.replace({ path: "/home" });
  }
}
</script>
<template>
  <v-card class="w-xxl-25 w-xl-50 w-lg-50 w-100 px-10 py-10">
    <v-container class="d-flex flex-column align-center">
      <v-img :width="100" aspect-ratio="1/1" src="public/pagebranch_optimized.svg"></v-img>
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Welcome to pagebranch!</v-card-subtitle>
    </v-container>
    <v-form ref="form" @submit.prevent="verifyAndSubmit">
      <v-container fluid class="d-flex flex-column ga-2">
        <FlashMessage />
        <div class="text-title-medium text-red-lighten-2 text-decoration-underline py-2 px-1 rounded-md"
          v-if="globalErrorMsg.length !== 0"> {{ globalErrorMsg }}</div>
        <v-text-field v-model="formMapping.username" :rules="usernameRules" :counter="20" label="Username"
          @input="globalErrorMsg = ''"></v-text-field>
        <v-text-field v-model="formMapping.password" :rules="passwordRules" :counter="30" label="Password"
          type="password" @input="globalErrorMsg = ''"></v-text-field>
      </v-container>
      <v-container fluid class="d-flex flex-wrap ga-2">
        <v-container class="d-flex w-auto ga-2 align-center flex-grow-1 pa-0">
          <div text-body-medium class="text-medium-emphasis">No account yet?</div>
          <v-btn to="/register" color="success">Register</v-btn>
        </v-container>
        <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-account-plus" color="primary">Login</v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
<style scoped></style>
