<template>
<div id="cart">
<!--  导航-->
  <nav-bar class="navbar">
      <div slot="center">购物车({{ length }})</div>
  </nav-bar>

  <scroll class="content"
          ref="scroll">
    <!--  商品列表-->
    <cart-list/>
  </scroll>
<!--  底部汇总-->
  <cart-bottom-bar/>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

import {mapGetters} from 'vuex';
import {debounce} from "@/common/utils";

import Scroll from "@/components/common/scroll/Scroll";

export default {
name: "Cart",
  components:{
    NavBar,
    CartList,
    CartBottomBar,
    Scroll
  },
  computed:{
    //mapGetters的两种语法
    //第一种：
    // ...mapGetters(['cartLength','cartList'])

  //  第二种：
    ...mapGetters({
      length:'cartLength',
      list:'cartList'
    })
  },
  activated() {
    // console.log('进入home')
    // this.$refs.scroll.refresh()
    const refresh = debounce(() => {
      this.$refs.scroll.refresh()
    },200)
    refresh()
  },
}
</script>

<style scoped>
#cart {
//padding-top: 44px;
  height: 100vh;
  position: relative;
}
.content {
  height: calc(100% - 44px - 83px);
  overflow: hidden;
}
 .nav-bar {
   background-color: var(--color-tint);
   color: #ffffff;
 }

</style>
