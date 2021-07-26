import axios from "axios"

//最终方案
export function request(config){
//  1.创建axios的实例
  const instance = axios.create({
    baseURL:'http://152.136.185.210:7878/api/m5',
    timeout:5000
  })
  //2.axios的拦截器
  axios.interceptors.request.use(config => {
    console.log(config)
  },err =>{
    console.log(err)
  })

  //2.2响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  },err => {
    console.log(err)
  })


  //3.发送真正的网络请求
  //axios.create返回的就是一个Promise型函数
  return instance(config)
}
