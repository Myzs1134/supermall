<template>
  <swiper>
    <swiper-item v-for="item in cbanners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper,SwiperItem} from "components/common/swiper"
export default {
name: "HomeSwiper",
  components:{
    SwiperItem,
    Swiper
  },
  data(){
  return {
    isLoad:false
  }
  },
  props:{
  cbanners:{
    type:Array,
    default(){
      return []
    }
  }
  },
  methods:{
  imageLoad() {
    if(!this.isLoad){
      this.$emit('swiperImageLoad')
      this.isLoad = true
    }

  }
  }
}
</script>

<style scoped>

</style>
