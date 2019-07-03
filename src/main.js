// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from 'vuex'
Vue.filter("currency",currency)
Vue.config.productionTip = false
Vue.use(Vuex);
/* eslint-disable no-new */
Vue.use(VueLazyLoad,{
  loading:'../static/loading-svg/loading-bars.svg'
});
Vue.use(VueInfiniteScroll);
const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount
    }
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
