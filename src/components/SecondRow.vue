<template>
    <div class="find">
        <a @click="redirectToProfile" class="lb">Listing</a>
        <a @click="showBlock('Bids')" class="lb">Bids</a>
        <a @click="redirectToProfile" class="lb">Traits</a>
    </div>
    <hr />
</template>
<script>
export default {
   methods: {
    redirectToProfile() {
        this.$router.push({ path: '/profile' });
    },
    showBlock(blockName) {
        this.currentBlock = blockName;
        }
 }
}
</script>
<style>
.find {
    display: flex;
    gap: 30px;
}
.lb {
    align-items: center; 
    display: flex;
    gap: 30px; 
    /* background-color: #C5A46E; */
    /* border-radius: 10px; */
    height: 25px;
    width: 50px;
}
</style>