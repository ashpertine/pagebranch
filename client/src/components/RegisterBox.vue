<script setup>
  import { useRegisterForm } from '../composables/register-form.js';
  const { formMapping, validateField, errorMsgs, submitRegister } = useRegisterForm()

  async function verifyAndSubmit() {
    let errors = [];
    for(const value of Object.keys(errorMsgs.value).filter(el => el !== "global")) {
        errors.push(validateField(formMapping.value[value], value));
    }

    if(errors.includes(true)) return;
 
    await submitRegister();
  }
</script>
<template>
  <div class="register-box">
    <h2>Register</h2>
    <form @input="errorMsgs.global = ''">
      <span class="error-msg global" v-if="errorMsgs.global.length !== 0">{{ errorMsgs.global }}</span>
      <div class="form-field">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" v-model="formMapping.username" @input="validateField(formMapping.username, 'username')" :class="{'input-error': errorMsgs.username.length !== 0}">
        <span class="error-msg" v-if="errorMsgs.username.length !== 0">{{ errorMsgs.username }}</span>
      </div>
      <div class="form-field">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" v-model="formMapping.password" @input="validateField(formMapping.password, 'password')" :class="{'input-error': errorMsgs.password.length !== 0}">
        <span class="error-msg" v-if="errorMsgs.password.length !== 0">{{ errorMsgs.password }}</span>
      </div>
      <div class="form-field">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirmPassword" v-model="formMapping.confirmPassword" @input="validateField(formMapping.confirmPassword, 'confirmPassword')" :class="{'input-error': errorMsgs.confirmPassword.length !== 0}">
        <span class="error-msg" v-if="errorMsgs.confirmPassword.length !== 0">{{ errorMsgs.confirmPassword }}</span>
      </div>
      <button type="submit" @click.prevent="verifyAndSubmit">Register</button>
    </form>
  </div>
</template>
<style scoped>
  .register-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
    padding: 48px;
    background-color: var(--light-background-muted);
    border: 1px solid var(--light-color-border);
    border-radius: 5px;
  }

  .register-box > h2 {
    font-weight: 100;
    font-size: 3rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background-color: var(--light-background-bright);
    border-radius: 5px;
    border: 1px solid var(--light-color-border);
  }

  button {
    background-color: var(--light-color-primary);
    color: var(--light-color-text);
    border-radius: 10px;
    padding: 0.8em 1em;
    border: 0;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
  }

  .error-msg {
    color: var(--color-error);
    font-size: 0.85rem;
  }

  .input-error {
    border: 2px solid var(--color-error);
    color: var(--color-error);
  }


  @media (prefers-color-scheme: dark) {
    body {
      background-color: var(--dark-background);
      color: var(--dark-color-text);
    }

    .register-box {
      background-color: var(--dark-background-muted);
      border: 1px solid var(--dark-color-border);
    }

    input {
      background-color: var(--dark-background);
      color: var(--dark-color-text);
      border: 1px solid var(--dark-color-border);
    }

    button {
      background-color: var(--dark-color-primary);
      color: var(--dark-color-text);
    }
  }
</style>
