<template>
  <div class="bottom-menu">
    <check-button class="select-all"
                 :is-checked="isSelectAll"
                  @click.native="checkClick"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product">去计算({{goodsCount}})</span>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";

import {mapGetters} from 'vuex'

export default {
name: "CartBottomBar",
  components:{
  CheckButton
  },
  methods:{
  checkClick() {
    //如果之前购物车里的商品全部选中了
    if (this.isSelectAll) {
      this.cartList.forEach(item => item.checked = false)
    } else {
      //部分或全部商品还没选中
      this.cartList.forEach(item => item.checked = true)
    }
  }
  },
  computed:{
  ...mapGetters(['cartList']),
  totalPrice() {
    return this.cartList.filter(item => {
      return item.checked
    }).reduce((preValue,item) => {
      return preValue + item.price * item.count
    },0)
  },
    goodsCount() {
    return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      //1.高阶函数方法实现
      // return !(this.cartList.filter(item => !item.checked).length)

      //购物车里没有商品
      if(this.cartList.length === 0) return false
      //如果购物车里还有没有选中的商品，返回false
      return !this.cartList.find(item => !item.checked)

      //  2.循环方法实现
      //   for(let item of this.cartList) {
      //     if (!item.checked) {
      //       return false
      //     }
      //     else return true
      //   }
    }
  },

}
</script>

<style scoped>
.bottom-menu {
  width: 100%;
  height: 44px;
  background-color: #eee;
  position: fixed;
  bottom: 44px;
  left: 0;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
  font-size: 14px;
  color: #888;
  line-height: 44px;
  padding-left: 35px;
  box-sizing: border-box;
}

.bottom-menu .select-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
}

.bottom-menu .total-price {
  margin-left: 15px;
  font-size: 16px;
  color: #666;
}

.bottom-menu .buy-product {
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  float: right;
}
</style>
