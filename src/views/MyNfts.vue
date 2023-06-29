<template>
<div>
    <div class="image-container itemBlock type2 hasCorner1">
        <div v-for="(nft, index) in nftImages" :key="index" >
                <img :src="nft.json.image" alt="NFT Image" class="nft-image" :class="{ active: isActive[index] }" @click="toggleActive(index)">
            </div>
    </div>
    <div class="btn gameStartBtn">
        <button @click="find_nft" >Sync NFTs</button>
        <button @click="goBack">Go Back</button>
        <input type="number" v-model="yourListValue" placeholder="Enter your bid" />
        <button @click="List(index,yourListValue)">List</button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity,lamports } from "@metaplex-foundation/js";
import { useRouter } from 'vue-router';

const router = useRouter();
const nftImages = ref([]);
const isActive = ref([]);
const wallet = useWallet();
const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
const metaplex = new Metaplex(connection);
metaplex.use(walletAdapterIdentity(wallet));
let infos = [];
let selectedNFTIndex = null;

async function find_nft() {
    if (!wallet.publicKey) {
        console.log('error', `Send Transaction: Wallet not connected!`);
        return;
    }
    const all_nft = await metaplex.nfts().findAllByOwner({
        owner: metaplex.identity().publicKey.value
    });
    const nftImagesPromises = all_nft.map(async (nft) => {
        if(nft.collection !==null){
            if (nft.collection.address.toString()==='GWqTyimCmP7oFSP2uzxfAGWoCkv38sKPF6jkYEiFqJBz'){
                const nftData = await metaplex.nfts().findByMint({
                    mintAddress: new PublicKey(nft.mintAddress.toString())
                    });
                return nftData
                }
        }
    });

    const profilenfts = await Promise.all(nftImagesPromises);
    const filteredprofilenft = profilenfts.filter(function(value) {
    return value !== undefined;
    });
    infos = filteredprofilenft 
    nftImages.value = filteredprofilenft

    isActive.value = Array(filteredprofilenft.length).fill(false);
  }

function goBack() {
  router.push('/');
}
function find_index(index) {
  selectedNFTIndex = index
}
function toggleActive(index) {
  isActive.value = isActive.value.map((value, idx) => idx === index);
  find_index(index); // 执行Get_NFT_Info函数
}

async function List(index,yourListValue) {
  wallet.signTransaction = wallet.signTransaction.value
  wallet.publicKey = metaplex.identity().publicKey.value
  const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey("DrLvt1M5qENHS6g9LSwzcWygo2Hb84a4AaSACvoS4a1") });
  const list = await metaplex
      .auctionHouse()
      .list({
        auctionHouse:auctionHouse,  
        seller: metaplex.identity(),
        authority: auctionHouse.authorityAddress,
        //printReceipt:true,
        bookkeeper:metaplex.identity(),     
        mintAccount:infos[selectedNFTIndex].address,
        price:lamports(yourListValue*1000000000)
      })
  console.log(list)
}
</script>

<style>
.image-container {/*放置所有nft的區塊*/
  gap: 0px;/* 照片中間的空格 */
  /* flex-direction: row;  改成下面的wrap讓他可以換行*/
  flex-wrap: wrap;
  display: flex;
  overflow-x: auto; /*滾動*/
  height: 700px;
  width: 1500px;
}
.container {
  display: flex;
  flex: 1;
}
.collect {
  display: flex; 
  align-items: center; 
  text-align: left;
  padding-left: 20px;
}
.nft-image.active {
  border: 2px solid rgb(151, 151, 228); /* 添加选中时的边框样式 */
}
</style>