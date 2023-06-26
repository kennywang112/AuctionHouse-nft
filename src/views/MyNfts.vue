<template>
<div class="image-container itemBlock type2 hasCorner1 hasCorner1">
    <div v-for="(nft, index) in nftImages" :key="index" >
            <img :src="nft" alt="NFT Image" class="nft-image" @click="Get_NFT_Info(index)">
        </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

const nftImages = ref([]);
const wallet = useWallet();
const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = new Metaplex(connection);
metaplex.use(walletAdapterIdentity(wallet));

async function find_nft() {
    if (!wallet.publicKey) {
        console.log('error', `Send Transaction: Wallet not connected!`);
        return;
    }

    const all_nft = await metaplex.nfts().findAllByOwner({
        owner: metaplex.identity().publicKey.value
    });
    console.log(all_nft)
    const nftImagesPromises = all_nft.map(async (nft) => {
        const nftData = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(nft.mintAddress.toString())
        });
        return nftData.json.image;
    });

    const profilenfts = await Promise.all(nftImagesPromises);
    nftImages.value = profilenfts
    console.log(nftImages);

  }

onMounted(find_nft);

</script>

<style>

</style>