<script setup>
import { ref } from "vue"
import { apiLogin } from "@/api/loginView.js"
import useInfo from "@/pinia/index"
import { useRouter } from "vue-router"
const username = ref("")
const password = ref("")
const router = useRouter()
const info = useInfo();
let debounce = false;
async function login() {
  if (debounce) return;
  debounce = true;
  const { data } = await apiLogin({ username: username.value, password: password.value })
  debounce = false;
  if (data.status == 200) {
    localStorage.setItem("token", data.token);
    console.log(info);
    info.updateToken(data.token)
    ElMessage({
      message: '登录成功',
      type: 'success',
    })
    router.push({
      name: 'home'
    })
  } else {
    ElMessage({
      message: '登录失败',
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="container">
    <div class="title">用户登录</div>
    <div class="container_inner">
      <form class="box">
        <div class="mt-2">
          <el-input v-model="username" placeholder="请输入用户名" autocomplete="user-name" />
        </div>
        <div class="mt-2">
          <el-input v-model="password" type="password" placeholder="请输入密码" show-password autocomplete="password" />
        </div>
        <div class="mt-2" style="text-align: center">
          <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.container {
  margin-top: 20vh;

}

.title {
  margin: 20px;
  font-size: 2.5rem;
  text-align: center;
}

.container_inner {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.mt-2 {
  margin: 2rem;
}

.box input {
  margin: 2rem;
}
</style>