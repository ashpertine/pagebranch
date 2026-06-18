<script setup>
  import FlashMessage from '../components/FlashMessage.vue';
  import LoginBox from '../components/LoginBox.vue';
</script>
<template>
  <div class="login-box-container">
    <FlashMessage />
    <LoginBox />
  </div>
</template>

<style scoped>
.login-box-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0 20px;
}
</style>
