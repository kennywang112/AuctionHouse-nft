<script setup>
import { WalletMultiButton } from 'solana-wallets-vue'
import store from '../vuex'


function flipAutoConnect (balance) {
  store.commit('setAutoConnect')
}
</script>

<template>
  <div>
    <!-- NavBar / Header -->
    <!-- <div class="navbar flex flex-row md:mb-2 shadow-lg bg-neutral text-neutral-content">
      <div class="navbar-start">
        <router-link to="/" class="text-xl font-bold text-gray-800 md:text-2xl hover:text-blue-400">
          <div class="hidden sm:inline w-22 h-22 md:p-2">
          </div>
        </router-link>
      </div> -->

      <!-- Nav Links -->
      <!-- <div class="hidden md:inline md:navbar-center">
        <div class="flex items-stretch">
          <router-link to="/">
            <a class="btn btn-ghost btn-sm rounded-btn">
              Home
            </a>
          </router-link>
          <router-link to="/basic">
            <a class="btn btn-ghost btn-sm rounded-btn">
              Basics
            </a>
          </router-link>
        </div>
      </div> -->

      <!-- Wallet & Settings -->
      <!-- <div class="header-right">
        <div>
        </div >
        <wallet-multi-button></wallet-multi-button>
      </div> -->
    </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
    };
  },
};
</script>