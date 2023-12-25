import axios from "axios"
import router from "@/router/index"
console.log(import.meta);
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 3000
})
service.interceptors.response.use(function (config) { // 做项目建议还是用箭头函数：(config) => {} ，属于懒汉加载，提高速度
  //自定义参数名，拦截下来的是请求的配置
  if (config.data.status === 401) {
    router.push('/login')
  }
  return config; //这里必须要返回这个参数! 否则报错!
});



export default service