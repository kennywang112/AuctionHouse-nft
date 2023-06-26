<script setup>
import RequestAirdrop from '../views/NftBuy';
import store from '../vuex'
import pkg from '../../package.json';
import profile from '../components/MyProfile'
import { WalletMultiButton } from 'solana-wallets-vue'
</script>

<template>
<div>
  <div>
    <div class="header">
    <h1 class="game-tit1">
      <img src="../assets/images/favicon.png" alt="Auction House" class="img-size" />
    <span class="focus"> Auction </span>
    House
  </h1>
  <div class="profile">
    <profile />
    <div class="header-right">
        <div>
        </div >
        <wallet-multi-button></wallet-multi-button>
      </div>
  </div>
  <hr>
  </div>
    <div class="text-center">
        <request-airdrop></request-airdrop>
    </div>
  </div>
</div>
</template>
<style>
.img-size {
    width: 30px; /* 设置宽度 */
    height: 30px; /* 设置高度 */
}
.text-center {
  display: flex;
  justify-content: center;
}
.profile {
  position: absolute;
  right: 0;
}
.header {
  display: flex;
  justify-content: space-between; /* 左右排列 */
  align-items: center;
}
</style>
