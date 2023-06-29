<script setup>
import { ref, onMounted,toRefs,computed } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, PublicKey ,Keypair,Transaction} from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity,lamports,keypairIdentity,guestIdentity } from "@metaplex-foundation/js";
import bs58 from 'bs58'
import jsonData from '../../k.json';
import { initWallet } from 'solana-wallets-vue';
const web3 = require('@solana/web3.js')

const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
const metaplex = new Metaplex(connection);
const wallet = useWallet();
// const mysecret = bs58.decode("2jgPdKQQE9fqgj8jtj6hESw8z7ibv7b6rQVxpPgxrTjGqyeq61uVcqGbm7JQ7egiD3cwFYbtPcQotyJEX9QbUXdv")
// const auth = Keypair.fromSecretKey(mysecret)
// metaplex.use(keypairIdentity(auth));
metaplex.use(walletAdapterIdentity(wallet))

const nftImages = ref([]);
let auctionHouse = null;
let listings = null;
let nft = null;
let infos = []; // nftImages結果為proxy，所以新增一個
const floor_price = ref(100000000000);
const { publicKey, connected, sendTransaction } = useWallet();

async function AH(index) {
  if (!wallet.publicKey) {
        console.log('error', `Send Transaction: Wallet not connected!`);
        return;
    }
    auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("DrLvt1M5qENHS6g9LSwzcWygo2Hb84a4AaSACvoS4a1") });
    listings = await metaplex
      .auctionHouse()
      .findListings({ auctionHouse });
  //console.log(listings);
  const nftinfoPromises = listings.map(async (listing) => {
    nft = await metaplex
      .auctionHouse()
      .findListingByReceipt({ auctionHouse, receiptAddress: new PublicKey(listing.receiptAddress.toString()) });
    if (!nft.purchaseReceiptAddress & nft.asset.collection.address.toString()==='GWqTyimCmP7oFSP2uzxfAGWoCkv38sKPF6jkYEiFqJBz') { //過濾已經售出和titanium collection
      return nft;
    }
  });
  const nftinfo = await Promise.all(nftinfoPromises);
  //nftImages.value = images.filter(Boolean);
  const filterednftinfo = nftinfo.filter(function(value) {
    return value !== undefined;
    });
  nftImages.value = filterednftinfo
  infos = filterednftinfo 
  for (let i = 0; i < infos.length; i++) {
    const price = infos[i].price.basisPoints.words[0];
    if (price < floor_price.value) {
      floor_price.value = price; 
    }
  }
  floor_price.value = floor_price.value /100000000
  //console.log(toRefs(metaplex.identity())._driver.value.walletAdapter)

  wallet.signTransaction = wallet.signTransaction.value
  wallet.publicKey = metaplex.identity().publicKey.value
  console.log( wallet )
  console.log( metaplex.identity() )
}
async function Buy_NFT(index) {
  console.log(metaplex.identity())
  const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("DrLvt1M5qENHS6g9LSwzcWygo2Hb84a4AaSACvoS4a1") });
  const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({ receiptAddress:new PublicKey(infos[index].receiptAddress), auctionHouse:auctionHouse });
  const directBuyResponse = await metaplex
      .auctionHouse()
      .buy({
        auctionHouse:auctionHouse, 
        // buyer:toRefs(metaplex.identity())._driver._object,
        buyer:metaplex.identity(),
        authority: auctionHouse.authorityAddress, 
        listing: listing,               
        // price: lamports(infos[index].price.basisPoints.words[0]),   
        // bookkeeper: metaplex.identity(),
        // printReceipt: true                   
      });
  console.log('success')
}
async function Bid_NFT(index,yourBidValue) {
  console.log(infos[index])
  const auctionHouse = await metaplex
      .auctionHouse()
      .findByAddress({ address: new PublicKey("DrLvt1M5qENHS6g9LSwzcWygo2Hb84a4AaSACvoS4a1") });
  const bid = await metaplex
    .auctionHouse()
    .bid({
      auctionHouse:auctionHouse, 
      seller:new PublicKey('F4rMWNogrJ7bsknYCKEkDiRbTS9voM7gKU2rcTDwzuwf'),  
      buyer : metaplex.identity(),
      authority: auctionHouse.authorityAddress,
      // printReceipt:true,
      mintAccount: new PublicKey(infos[index].asset.address),                     
      price:lamports(yourBidValue*1000000000),
      // //tokens: 1,    
      bookkeeper: metaplex.identity()   
    });
}
onMounted(AH);
</script>
<script>
export default {
  // components: { SecondRow },
  data() {
    return {
      showOverlay: false, // 控制是否显示弹出区块
      currentBlock: 'List',
      bidValue: '', 
    };
  },
  methods: {
    redirectToProfile() {
      this.$router.push({ path: '/profile' });
    },
    showOverlayBlock(index) {
      if (this.showOverlay && this.selectedNFTIndex === index) {
        // 如果新视窗已经显示，并且点击的是已选中的 NFT 图像，隐藏新视窗
        this.showOverlay = false;
        this.selectedNFTIndex = null;
      } else {
        // 点击新的 NFT 图像，显示对应的新视窗
        this.showOverlay = true;
        this.selectedNFTIndex = index;
      }
    },
    showBlock(blockName) {
      this.currentBlock = blockName;
    }
  }
};
</script>

<template>
  <div class="container">
      <div class="left-content">
        <div class="collect">
          <img src="../assets/images/favicon.png" alt="Auction House" class="collection_image"/>
            <p class="game-tit1">Titanium collections</p>
            <div class="informations">
              <p >{{ floor_price }}<br>floor price</p>
              <p >{{ floor_price }}<br>sell now</p>
              <p >{{ infos.length }}/5000 ({{ infos.length/5000*100 }}%)<br>listed</p>
              <p >{{ floor_price }}<br>volume</p>
              <p >{{ floor_price }}<br>sales</p>
              <p >{{ floor_price }}<br>price 24hr</p>
            </div>
        </div>
        <hr />
        <div class="find">
          <a @click="showBlock('List')" class="lb">Listing</a>
          <a @click="showBlock('Bids')" class="lb">Bids</a>
          <a @click="showBlock('Traits')" class="lb">Traits</a>
        </div>
        <hr />
      <div class="image-container itemBlock type2 hasCorner1" v-if="currentBlock ==='List'">
          <div v-for="(nft, index) in nftImages" :key="index" class="Product_block_hot" >
            <!-- <div ><img :src="nft.asset.json.image" alt="NFT Image" class="nft-image" @click="Buy_NFT(index)"></div> -->
            <div ><img :src="nft.asset.json.image" alt="NFT Image" class="nft-image" @click="showOverlayBlock(index)"></div>
            <div>
              <img src="../assets/images/favicon.png" alt="Auction House" class="img-size" />
              <p >{{ nftImages[index].asset.name.replace('Number', '').trim() }}<br>{{ nftImages[index].price.basisPoints/100000000 }}</p>
            </div>
          </div>
      </div>
      <div class="image-container itemBlock type2 hasCorner1" v-if="currentBlock==='Bids'">
        <table>
        <tr>
            <th>BID PRICE</th>
            <th>QUANTITY</th>
            <th>BIDDER</th>
            <th>TIME</th>
        </tr>
        <tr>
            <td>內容1</td>
            <td>內容2</td>
            <td>內容3</td>
            <td>內容3</td>
        </tr>
        <tr>
            <td>內容4</td>
            <td>內容5</td>
            <td>內容6</td>
            <td>內容3</td>
        </tr>
        <tr>
            <td>內容4</td>
            <td>內容5</td>
            <td>內容6</td>
            <td>內容3</td>
        </tr>
    </table>
      </div>
      <div class=" itemBlock type2 hasCorner1" v-if="currentBlock==='Traits'">
        char<br />
        {{jsonData["char"]}}<hr />
        time horizon<br />
        {{jsonData["time horizon"]}}<hr />
        mechanism <br />
        {{jsonData["mechanism"]}}<hr />
        hair<br />
        {{jsonData["hair"]}}<hr />
        eyes<br />
        {{jsonData["eyes"]}}<hr />
        mouth<br />
        {{jsonData["mouth"]}}<hr />
        facial accessories<br />
        {{jsonData["facial accessories"]}}<hr />
        clothe<br />
        {{jsonData["clothe"]}}<hr />
        hand accessories<br />
        {{jsonData["hand accessories"]}}<hr />
      </div>
      </div>
      <div class="right-content" v-if="showOverlay">
        <div class="overlay">
          <!-- 彈出區塊內容 -->
          <div ><img :src="nftImages[selectedNFTIndex].asset.json.image" alt="NFT Image" class="nft-image-info"></div>
          <div class="show_trait">
            <span style="color:chocolate">Traits</span>
            <div>
              <div v-for="attribute in nftImages[selectedNFTIndex].asset.json.attributes" :key="attribute.trait_type">
                <span style="color:rgb(168, 83, 22)">{{ attribute.trait_type }}: </span>
                <span>{{ attribute.value }}</span>
              </div>
            </div>
          </div>
          <div class="show_owner">
            OWNER :{{ nftImages[selectedNFTIndex].sellerAddress.toString() }}
            MINT ADDRESS : {{ nftImages[selectedNFTIndex].asset.address.toString() }}
          </div>
          <div class="btn gameStartBtn">
            <input type="number" v-model="yourBidValue" placeholder="Enter your bid" />
            <button @click="Bid_NFT(selectedNFTIndex,yourBidValue)">
                Bid
            </button>
          </div>
          <div class="btn gameStartBtn">
            <button @click="Buy_NFT(selectedNFTIndex)">
                Buy
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<style>
/* 新視窗跳出處理*/
.container {
  display: flex;
  flex: 1;
}
.left-content {
  flex: 1;
  padding: 20px;
}
.right-content {
  flex: 0.3;
  position: relative;
  display: flex; /* 將父元素設置為 flex 容器 */
  justify-content: center; /* 將內容水平置中 */
}
.overlay {
  /*點擊nft的新區塊*/
  position: absolute;
  top: 0;
  right: 0;
  width: 100%; /* 调整弹出区块的宽度 */
  height: 100%;
  background-color: rgb(55, 38, 9);
  color: #fff;
  z-index: 1;
  flex-direction: column; /* 將顯示的內容置中 */
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}
/* 新視窗跳出處理*/

.image-container {/*放置所有nft的區塊*/
  gap: 0px;/* 照片中間的空格 */
  /* flex-direction: row;  改成下面的wrap讓他可以換行*/
  flex-wrap: wrap;
  display: flex;
  overflow-x: auto; /*滾動*/
  height: 700px;
}

.collect div.informations{
  color:#C5A46E;
  display: flex;
  gap: 50px;
}
.collect {
  display: flex; 
  align-items: center; 
  text-align: left;
  padding-left: 20px;
}
.collection_image{
  width: 100px;
  height: 100px; 
}
.collect p {
  margin-left: 30px; /* 在左側添加 10px 的間隔 */
}

.Product_block_hot{ /* nft底下區塊 */
  position: relative;
  text-align: center;
  background-color: #C5A46E;
  border:2px solid #41321b;
  display: inline-block; 
  width: fit-content;
  border-radius: 10px;
  height: 210px;
  margin: 5px;
  padding: 8px;/* 區塊寬 */
}
/* 全部nft */
.nft-image {
  width: 150px;
  height: auto;
  border-radius: 10px;
}
/*彈出視窗nft*/
.nft-image-info {
  width: 300px;
  height: auto;
  border-radius: 10px;
}
.Product_block_hot img.img-size {
  position: absolute;
  right: 0;
  bottom: 2;
  margin-right: 5px;
}
.Product_block_hot p {
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: left;
  margin: 5px;
  font-size: 18px;
}
.show_trait {
  background-color: #C5A46E;
  border:2px solid #000000;
  height: 330px;
  border-radius: 10px;
  overflow-x: auto;
  width: 300px;
  margin: 0 auto; /*左右均分*/
}
.show_owner {
  background-color: #C5A46E;
  border:2px solid #000000;
  height: 130px;
  border-radius: 10px;
  overflow-x: auto;
  width: 300px;
  margin: 0 auto; /*左右均分*/
}
/* 第二區塊 */
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
/* 第二區塊 */

table {
    width: 100%;
    position: absolute;
    top: 0;
}
th:first-child,/* 最左邊屏幕開始 */
td:first-child {
    text-align: left;
}

</style>