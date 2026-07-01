<script setup>
import { RegisterForm } from '../../composables/register-form.js';

const { form, formMapping, globalErrorMsg, submitRegister } = RegisterForm()

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

const confirmPasswordRules = [...passwordRules,
value => {
  if (formMapping.value.confirmPassword !== formMapping.value.password) return 'Passwords do not match.';
  return true;
}
]

async function verifyAndSubmit() {
  const { valid } = await form.value.validate();
  if (!valid) { // not valid...
    return
  }

  await submitRegister();
}

</script>
<template>
  <v-card class="w-xxl-25 w-xl-50 w-lg-50 w-100 px-10 py-10">
    <v-container class="d-flex flex-column align-center">
      <v-img :width="100" aspect-ratio="1/1" src="public/pagebranch_optimized.svg"></v-img>
      <v-card-title>Register</v-card-title>
      <v-card-subtitle>Welcome to pagebranch!</v-card-subtitle>
    </v-container>
    <v-form ref="form" @submit.prevent="verifyAndSubmit">
      <v-container fluid class="d-flex flex-column ga-2">
        <div class="text-title-medium text-red-lighten-2 text-decoration-underline py-2 px-1 rounded-md"
          v-if="globalErrorMsg.length !== 0"> {{ globalErrorMsg }}</div>
        <v-text-field v-model="formMapping.username" :rules="usernameRules" :counter="20" label="Username"
          @input="globalErrorMsg = ''"></v-text-field>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="formMapping.password" :rules="passwordRules" :counter="30" label="Password"
              type="password" @input="globalErrorMsg = ''"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formMapping.confirmPassword" :rules="confirmPasswordRules" counter="30"
              label="Confirm Password" type="password" @input="globalErrorMsg = ''"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid class="d-flex justify-space-between flex-wrap ga-2">
        <v-btn to="/login" color="success">Login</v-btn>
        <v-btn variant="tonal" size="large" type="submit" append-icon="mdi-account-plus"
          color="primary">Register</v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>
<style scoped></style>
