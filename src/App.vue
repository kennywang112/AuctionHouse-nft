<script setup>
import { useRoute } from 'vue-router';
import store from './vuex';
import 'solana-wallets-vue/styles.css'
import AppBar from './components/AppBar';
import BasicPage from './views/BasicPage'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { initWallet } from 'solana-wallets-vue';

const route = useRoute()

const wallets = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
];

initWallet({ wallets, autoConnect: store.state.autoConnect});
</script>

<template>
  <div>
        <!-- Main -->
        <main class="flex flex-col h-screen">
          <header>
              <title>Claim token</title>
          </header>
          <!-- AppBar -->
          <app-bar class="block"></app-bar>
          <router-view class="mx-auto h-5/6 block"></router-view>
        </main>
    </div>
</template>

<style>
@import url("./assets/css/style.css");
@import url("./assets/css/modify.css");
@import url("./assets/css/display.css");
</style>