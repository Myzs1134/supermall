<template>
  <div class="tab-bar-item" @click="itemClick">
<!--    <slot v-if="!isActive" name="item-icon"></slot>-->
<!--    <slot v-else name="item-icon-active"></slot>-->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>

  </div>
</template>

<script>
export default {
name: "TabBarItem",
  props:{
  path:String,
    activeColor:{
    type:String,
      default:'pink'
    }
  },
  data(){
  return{

  }
  },
  computed:{
  isActive(){
    //实现点击组件后组件活跃，其他组件不活跃的外观
    // /home -> item1(/home) = true
    // /home -> item1(/category) = false
    // /home -> item1(/cart) = false
    // /home -> item1(/profile) = false

    //!==-1的意思是从this.$route.path（当前活跃页面）中找到了与this.path（传过来的4个页面）中有相同的页面
    return this.$route.path.indexOf(this.path) !== -1
  },
    activeStyle(){
      return this.isActive?{color:this.activeColor}:{}
    }
  },
  methods:{
    itemClick(){
      this.$router.replace(this.path).catch(err=>{err})
    }
  }
}
</script>

<style scoped>
.tab-bar-item{
  flex: 1;
  text-align: center;
  height: 49px;
  font-size:14px ;
}
.tab-bar-item img{
  width: 24px;
  height: 24px;
  margin-top:3px ;
  vertical-align: middle;
  margin-bottom:2px ;
}
</style>
