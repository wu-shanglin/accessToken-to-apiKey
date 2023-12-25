<script setup>
import { ref } from 'vue';
import { apiAllData, apiAddTranslate, apiDeleteTranslate, apiUpdateTranslate } from "@/api/homeView.js"
import useInfo from "@/pinia/index"
import { useRouter } from 'vue-router';
const router = useRouter()
const info = useInfo()
const tableData = ref(void 0)
// tableData.value = [{
//   access: '十大考古看圣诞节的反革命客观asfsf第三个都会肉体和推荐德国马克第三方好可怜的十分看好法塔赫就第三方框架和返回的发挥他和'
// }]
// 获取数据
function getList() {
  apiAllData()
    .then(res => {
      tableData.value = res.data.data;
      // console.log(res.data.data);
    })

}
getList()
// 复制
function handleCopy(scope) {
  console.log(scope);
  navigator.clipboard.writeText(scope.row.key)
    .then(res => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    }).catch(reason => {
      ElMessage({
        message: '复制失败,请手动复制,或访问https',
        type: 'warning',
      })
      ElMessageBox.alert(`<span style="word-break:break-all">${scope.row.key}</span>`, '手动复制', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '完成',
        center: true,
        dangerouslyUseHTMLString: true
      })
    })
  // navigator.clipboard.copy(scope.row.key);
}

// 删除
const itemsBtnIsDisabled = ref(false)
async function handleDelete(scope) {
  itemsBtnIsDisabled.value = true
  const { data } = await apiDeleteTranslate({
    id: scope.row.id
  });
  if (data.status === 200) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    itemsBtnIsDisabled.value = false
    getList()
  }
}


// 添加转换
const dialogVisible = ref(false)
const form = ref({})
const addLoading = ref(false)
function addTranslate() {
  dialogVisible.value = true
}

async function confirmAdd(e) {
  if (addLoading.value) return;
  addLoading.value = true;
  const { data } = await apiAddTranslate(form.value)
  console.log(data);
  if (data.status === 200) {
    ElMessage({
      message: '添加成功',
      type: 'success',
    })
    form.value = new Object();
    dialogVisible.value = false;
    addLoading.value = false;
    getList()
  }
}

// 编辑 
const updateForm = ref({})
const updateFormVisible = ref(false)
const updateLoading = ref(false)

function handleEdit(scope) {
  updateFormVisible.value = true;
  updateForm.value = scope.row;
}

async function confirmUpdate() {
  if (updateLoading.value) return;
  updateLoading.value = true;
  const { data } = await apiUpdateTranslate(updateForm.value)
  console.log(data);
  if (data.status === 200) {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
    updateForm.value = new Object();
    updateFormVisible.value = false;
    updateLoading.value = false;
    getList()
  }
}

// 注销
function logout() {
  info.updateToken('');
  localStorage.removeItem('token');
  ElMessage({
    message: '注销成功',
    type: 'warning',
  })
  router.push('/login')
}
</script>

<template>
  <main>
    <div class="alert">
      <el-alert :closable="false" title="请添加access token,然后把转换好的key填写到你要请求的服务器,再把代理地址指向本项目/api" type="success" />
    </div>
    <div class="tools">
      <div class="add">
        <el-button type="success" @click="addTranslate">添加转换</el-button>
        <el-button type="warning" @click="logout">注销登录</el-button>
      </div>
    </div>

    <div class="table" style="overflow: hidden;">
      <el-table :data="tableData" border style="width: 100%" table-layout="fixed">
        <el-table-column type="index" :index="1" align="center" />
        <el-table-column prop="access" label="access token" style="max-width: 200px" align="center" />
        <el-table-column prop="name" label="别名" width="100" align="center" />
        <el-table-column prop="key" label="key" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="250">
          <template #default="scope">
            <el-button type="success" @click="handleCopy(scope)">复制key</el-button>
            <el-button type="primary" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope)" :loading="itemsBtnIsDisabled">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog v-model="dialogVisible" title="添加转换" width="45%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="代理名称" />
        </el-form-item>
        <el-form-item label="access token">
          <el-input v-model="form.access" placeholder="请输入access token" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="addLoading" ref="add" @click="confirmAdd">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="updateFormVisible" title="编辑" width="45%">
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="updateForm.name" placeholder="代理名称" />
        </el-form-item>
        <el-form-item label="access token">
          <el-input v-model="updateForm.access" placeholder="请输入access token" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateFormVisible = false">取消</el-button>
          <el-button type="primary" :loading="updateLoading" @click="confirmUpdate">更新</el-button>
        </span>
      </template>
    </el-dialog>
  </main>
</template>


<style scoped>
main {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.alert {
  margin: 2rem 0;
}

.tools {
  margin: 2rem 0;
  text-align: right;
}

.table:deep().el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
</style>