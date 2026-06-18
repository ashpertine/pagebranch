<script setup>
  import RegisterBox from '../components/RegisterBox.vue';  
</script>
<template>
  <div class="register-box-container">   
    <RegisterBox />
  </div>
</template>
<style scoped>
.register-box-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

}

</style>
