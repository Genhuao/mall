<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods" >Price <span class="iconfont icon-jiantou" :class="{'change':!sortFlag}"></span></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterby}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur': priceChecked =='ALL'}" @click="priceChecked='ALL'">All</a></dd>
              <dd v-for="(price,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="javascript:;"><img v-lazy="'/static/'+item.productImage" :key="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlayFlag" @click="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModel">
      <p slot="message">
        请先登录，否则无法加购物车
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="closeModel">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModel">
      <p slot="message">
        <span class="iconfont icon-xiaolian"></span>
        加入购物车成功！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart = false" href="javascript:;">继续购物</a>
        <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .load-more{
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .icon-jiantou{
    display: inline-block;
    transform:rotate(180deg);
    transition:all 0.3s ease-out;
  }
  .change{
    /*transform:rotate(180deg);*/
    transform:rotate(360deg);
    transition:all 0.3s ease-out;
  }
  .btn:hover{
    background-color: #ffe5e6;
    transition:all 0.3s linear;
  }
</style>
<script>
import './../assets/css/base.css';
import './../assets/css/product.css';
import './../assets/css/checkout.css';
import './../assets/css/login.css';
import './../assets/css/iconfont.css'

import Axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';

import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter';
import NavBread from '@/components/NavBread';
import Modal from '@/components/Modal'


  export default{
    data(){
      return {
        goodsList:[],
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:false,
        loading:false,
        mdShow:false,
        mdShowCart:false,
        priceFilter:[
          {
            startPrice:"0",
            endPrice:"100"
          },
          {
            startPrice:"100",
            endPrice:"500"
          },
          {
            startPrice:"500",
            endPrice:"1000"
          },
          {
            startPrice:"1000",
            endPrice:"5000"
          }
        ],
        priceChecked:'ALL',
        filterby:false,
        overlayFlag:false
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      InfiniteLoading,
      Modal
    },
    mounted: function(){
      this.getGoodsList();
    },
    methods:{
      getGoodsList(flag){
        var params = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        };
        this.loading = true;
        Axios.get('/goods/list',{params:params}).then((response) => {
        let res = response.data;
        this.loading = false;
        if(res.status === '0'){
          if(flag){
            this.goodsList = this.goodsList.concat(res.result.list);
            if(res.result.count = 0){
              this.busy = true;
            }else{
              this.busy = false;
            }
          }else{
            this.goodsList = res.result.list;
            this.busy = false
          }
        }else{
          this.goodsList = [];
        }
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore: function() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        },500);
      },
      showFilterPop(){
        this.filterby = true;
        this.overlayFlag = true;
      },
      setPriceFilter(index){
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
        this.closePop()
      },
      closePop(){
        this.overlayFlag = false;
        this.filterby = false;
      },
      addCart(productId){
        Axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          if(res.data.status === '0'){
            this.mdShowCart = true
            this.$store.commit('updateCartCount',1)
          }else{
            this.mdShow = true
          }
        })
      },
      closeModel(){
        this.mdShow = false;
        this.mdShowCart = false
      }
    }
  }
</script>
