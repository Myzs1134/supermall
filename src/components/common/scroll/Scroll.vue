<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
    <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
name: "Scroll",
  data() {
  return {
    scroll: {}
  }
  },
  props:{
    probeType: {
      type:Number,
      default:0
    },
    pullUpLoad: {
      type:Boolean,
      default: true
    }
  },
  methods:{
    scrollTo(x,y,time=300) {
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      // console.log('refresh调用')
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll?this.scroll.y:0
    }
  },
  mounted() {
  //1.创建BScroll对象
  this.scroll = new BScroll(this.$refs.wrapper,{
    probeType:this.probeType,
    click:true,
    pullUpLoad:this.pullUpLoad,
    // observeDOM: true,
    // observeImage:true

  })

    // console.log(this.scroll)

    //2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll',(position) => {
        this.$emit('scroll',position)
      })
    }

    //3.监听scroll滚动到底部
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
      })
    }
  }
}
</script>

<style scoped>

</style>
