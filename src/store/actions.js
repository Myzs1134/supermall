export default {
  addCart(context,payload) {
    //数组常用的方法有哪些？push/pop/unshift/shift/sort/reverse/map/filter/reduce

    // payload新添加的商品
    // let oldProduct = null;
    // for (let i =0;i< state.cartList.length;i++) {
    //   //判断新添加的商品在购物车里是不是已经存在了
    //   if (state.cartList[i].iid === payload.iid) {
    //     oldProduct = state.cartList[i];
    //   }
    // }

    return new Promise((resolve,reject) => {
      //  1.查看是否添加过这个商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      //  2.判断oldProduct,如果是购物车里已有同样商品，给同样商品自加
      //  如果没有同样商品另起一行数量为1
      if(oldProduct) {
        // oldProduct.count += 1
        context.commit('addCounter',oldProduct)
        resolve('当前的商品数量+1')
      } else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit('addToCart',payload)
        resolve('添加新的商品')
      }
    })


  }
}
