<script setup>
import { useWallet } from 'solana-wallets-vue'
import { Connection, SystemProgram,Keypair,clusterApiUrl, Transaction,PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount,createTransferInstruction, transfer } from '@solana/spl-token';
import { Metaplex, walletAdapterIdentity,lamports,keypairIdentity,guestIdentity } from "@metaplex-foundation/js";
import bs58 from "bs58";
import { ref } from 'vue'
import axios from 'axios'
var CryptoJS = require("crypto-js");
const web3 = require("@solana/web3.js");

const token = ref(196)
const user_id = ref(0)
const num = ref(0)
const responseData = ref(null)

async function fetchData() {
    try {
    const response = await axios.get("https://api.tdtn.tw/v2/gamer/info?gamer_id=1&mode=detail&lang=zh-TW")
    responseData.value = response.data
    user_id.value = responseData.value.Result.user_data.user_id
    
    } catch (error) {
    console.error(error)
    }
}
function decreaseToken(num) {
if (num <= token.value) {
    token.value -= num
    console.log('token total decreased')
} else {
    alert("You cannot claim more tokens than your balance.")
}
}

fetchData()
const { publicKey, connected, sendTransaction } = useWallet();
const wallet = useWallet();
const onClick = async () => { 
    if (!publicKey) {
        console.log('error', `Send Transaction: Wallet not connected!`);
        return;
    }
    if (num.value > token.value) {
    console.log('error', 'Number of tokens exceeds the available balance!');
    return;
    }
    let signature = '';
    try {
        // var bytes  = CryptoJS.AES.decrypt(process.env.VUE_APP_SECRET_CRYPTION, process.env.VUE_APP_CRYPTION);
        // var SecretKey = bytes.toString(CryptoJS.enc.Utf8);
        // const myWalletSecretKey = bs58.decode(SecretKey);
        // const fromWallet = Keypair.fromSecretKey(myWalletSecretKey);
        // const mint =new PublicKey('HpgFJcyBpAAFKMHFjp5Lq3KaCiAqhgcV5SLV5GmjAoi9')
        // const QUICKNODE_RPC = process.env.VUE_APP_RPC;
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = useWallet();
        const metaplex = new Metaplex(connection);
        metaplex.use(walletAdapterIdentity(wallet))
        console.log(metaplex.identity())
        // const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     fromWallet,
        //     mint,
        //     fromWallet.publicKey
        //     );
        // const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     fromWallet,
        //     mint, 
        //     publicKey.value
        //     );
        //     console.log(`Creating and Sending Transaction`);
        // console.log(new web3.PublicKey(wallet.publicKey.value.toString()))
        // const transaction = web3.SystemProgram.transfer({
        //     fromPubkey: new web3.PublicKey(wallet.publicKey.value.toString()),
        //     toPubkey: new web3.PublicKey("9MMdJHMK22JtrU8H4QLFYgZUoFcwXtutvjtrVNcjcRc9"),
        //     lamports: web3.LAMPORTS_PER_SOL / 1000*2,
        // });
        // const tx = new Transaction().add(
        //     transaction,
        //     createTransferInstruction(
        //     fromTokenAccount.address,
        //     toTokenAccount.address,
        //     fromWallet.publicKey,
        //     1000000000*num.value,)
        // )
        // const latestBlockHash = await connection.getLatestBlockhash('confirmed');
        // tx.recentBlockhash = latestBlockHash.blockhash;    
        // tx.feePayer = publicKey.value;
        // console.log(tx)
        // signature = await sendTransaction(
        //     tx,
        //     connection,
        //     {
        //     signers: web3.Signer
        //     })
        console.log('finish transfer')

    } catch (error) {
        console.log('error', `Transaction failed! ${error?.message}`, signature);
        return;
    }
}
</script>


<template>
    <div>
        <p>user id : {{ user_id }}</p>
        can claim token balance : {{ token }} <br>
        choose amount : <input type="number" v-model="num" />
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="onClick" :disabled="! publicKey || num > token">
            
            <div v-if="connected">
                <div v-if="token > 0">
                    test
                </div>
                <div v-else>
                    you have no enough token to claim
                    </div>
            </div>

            <div v-else>
                Wallet not connected
            </div>
        </button>
    </div>
</template>