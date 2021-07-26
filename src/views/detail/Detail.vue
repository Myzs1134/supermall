<template>
<div id="detail">
  <detail-nav-bar
    ref="nav"
    class="detail-nav"
    @titleClick="titleClick">
  </detail-nav-bar>
  <scroll class="content"
          ref="scroll"
          :probe-type="3" @scroll="contentScroll">
    <div>{{$store.state.cartList.count}}</div>
<!--    <ul class="ul">-->
<!--      <li v-for="item in $store.state.cartList">-->
<!--        {{item}}-->
<!--      </li>-->
<!--    </ul>-->
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shops"/>
    <detail-goods-info
      :detail-info="detailInfo"
      @imageLoad="imageLoad"/>
    <detail-param-info ref="params" :param-info="paramInfo"/>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods="recommends"/>
  </scroll>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  <detail-bottom-bar @addToCart="addToCart"/>
<!--  <toast :message="message" :show="isShow"/>-->

</div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import GoodsList from "@/components/content/goods/GoodsList";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import BackTop from "@/components/content/backtop/BackTop";

import Scroll from "@/components/common/scroll/Scroll";
// import Toast from "@/components/common/toast/Toast";

//所使用到的整合好的接收数据的类
import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "@/network/detail";

import {itemListenerMixin} from "@/common/mixin"
import {debounce} from "@/common/utils";

import {mapActions} from 'vuex'

export default {
name: "Detail",
  components:{
    GoodsList,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    BackTop,
    // Toast,
    Scroll
  },
  mixins:[itemListenerMixin],
  data() {
  return {
    iid:null,
    topImages:[],
    goods:{},
    shops:{},
    detailInfo:{},
    paramInfo:{},
    commentInfo:{},
    recommends:[],
    themeTopYs:[],
    getThemeTopY:{},
    currentIndex:0,
    isShowBackTop:false,
    // message:'',
    // show:false
  }
  },
  methods:{
  ...mapActions(['addCart']),
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
    },
    contentScroll(position){
      // console.log(position)
    //  1.获取y值
      const positionY = -position.y

      //1.if方法（比较笨）
      // if (positionY>=0 && positionY< this.themeTopYs[1]) {
      //   this.$refs.nav.currentIndex = 0
      // }
      // else if (positionY>= this.themeTopYs[1] && positionY < this.themeTopYs[2])
      // {
      //   this.$refs.nav.currentIndex = 1
      // }
      // else if (positionY>= this.themeTopYs[2] && positionY < this.themeTopYs[3])
      // {
      //   this.$refs.nav.currentIndex = 2
      // }
      // else if (positionY>= this.themeTopYs[3])
      // {
      //   this.$refs.nav.currentIndex = 3
      // }

    //  2.循环的方法
      for (let i =0;i < this.themeTopYs.length -1;i++)
      {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]))
        {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //1.判断backTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.goods.iid;

    //  2.将商品添加到购物车里
    //   this.$store.commit('addCart',product)
    //   this.$store.dispatch('addCart',product).then(res => {
    //     console.log(res)
    //   })

      //使用mapActions映射之后的调用方式
      this.addCart(product).then(res => {
        // console.log(res)
        // this.show = true
        // this.message = res
        //
        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // },1500)

        this.$toast.show(res, 1500)
      })
    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.id
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res)
      //1.获取数据
      const data =res.result
      // console.log(data)
      //  2.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

    //  3.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

    //  4.获取店铺信息
      this.shops = new Shop(data.shopInfo)

    //  5.获取商品详情信息
      this.detailInfo = data.detailInfo

    //  6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

    //  7.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      //8.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      //9.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        // console.log('----------')
        this.themeTopYs = []

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop -44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop -44);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop -44);
        //给数组赋一个最大值
        this.themeTopYs.push(Number.MAX_VALUE)

        // console.log(this.themeTopYs)
      },100)
      //第一次获取，值不对
      //原因是：this.$refs.params.$el没有渲染
      // this.themeTopYs = []
      //
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop -44);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop -44);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop -44);
      //
      // console.log(this.themeTopYs)


      //$nextTick函数的作用是确保网页资源刷新完毕后再计算滑动位置
      // this.$nextTick(() => {
      //   //2.第二次获取：值不对
      //   // 原因：图片没有计算在类
      //   //根据最新的数据，对应的DOM是已经被渲染出来
      //   //但是图片依然没有加载完
      //   //offsetTop值不对的时候都是因为图片的问题
      //   this.themeTopYs = []
      //
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop -44);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop -44);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop -44);
      //
      //   console.log(this.themeTopYs)
      // })
    })


  },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 80px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #ffffff;
}
</style>
