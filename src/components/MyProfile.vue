<template>
     <div class="btn gameStartBtn">
      <button @click="redirectToProfile">
          Profile
      </button>
  </div>
</template>
<script>
export default {
    methods: {
    redirectToProfile() {
      this.$router.push({ path: '/profile' });
    },
  }
}
</script>
