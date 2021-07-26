<template>
<div id="home">
  <nav-bar class="home-nav">
    <div slot="center">购物街</div>
  </nav-bar>
  <tab-control ref="tabControl1"
               class="tab-control"
               :titles="['流行','新款','精选']"
               @tabClick="tabClick"
               v-show="isTabFFixed"
  />
 <scroll
   class="content"
   ref="scroll"
   :probe-type="3"
   @scroll="contentScroll"
   :pull-up-load="true"
    @pullingUp="loadMore">
   <home-swiper
     :cbanners="banners"
     @swiperImageLoad="swiperImageLoad"
   />
   <recommend-view :recommends="recommends"/>
   <feature-view/>
   <tab-control ref="tabControl2"
                :titles="['流行','新款','精选']"
                @tabClick="tabClick"
   />
   <goods-list :goods="showGoods"/>
 </scroll>
<!--  实现自定义模板的监听点击事件需要在@click后加上.native属性-->
<back-top @click.native="backClick" v-show="isShowBackTop"/>

</div>
</template>

<script>
import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backtop/BackTop";

import {getHomeMultidata,getHomeGoods} from "@/network/home";

import {itemListenerMixin} from "@/common/mixin";

export default {
  name: "Home",
  components:{
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins:[itemListenerMixin],
  data(){
    return{
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0, list:[]},
        'new':{page:0, list:[]},
        'sell':{page:0, list:[]},
      },
      currentType:'pop',
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFFixed:false,
      saveY:0,

    }
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },

  //路由keep-alive时存在activated和deactivated两个函数
  activated() {
    // console.log('进入home')
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('离开home')
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY

    //2.取消全局时间的监听
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  mounted() {
  //  2.获取tabControl的offsetTop,加$el
  //  所有的组件都有一个属性$el:用于获取组件中的元素
  //   this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
  },
  methods:{
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex=index
      this.$refs.tabControl2.currentIndex=index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      //1.判断backTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      //2.决定tabControl是否吸顶（position:fixed）
      this.isTabFFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
      // console.log('加载更多')
    },
    swiperImageLoad(){
      //获取轮播图里图片的高度
      this.tabOffsetTop =this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata(){
      //1.请求多个数据
      getHomeMultidata().then(res => {
        console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        console.log(this.recommends)
      })
    },
    getHomeGoods(type) {
      const page =this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        //实现多次上拉加载（原来只能上拉一次）
        this.$refs.scroll.finishPullUp()
      })
    },

  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    },
  }
}

</script>

<style scoped>
#home {
  //padding-top: 44px;
  height: 100vh;
  position: relative;
}

.home-nav{
  background-color: var(--color-tint);
  color: white;

  //position: fixed;
  //left: 0;
  //right: 0;
  //top: 0;
  //z-index:9;
}
.tab-control {
  position:relative;
  z-index:9;
}
.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/*
.content{
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 51px;
} */
</style>
