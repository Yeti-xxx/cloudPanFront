<template>
  <div class="container">
    <div class="top" style="position: relative;">
      <div class="topItem title">传输列表</div>
      <div :class="['transIcon', 'topItem', transType === 0 ? 'itemActive' : '']" @click="ChangeType(0)">
        <span>上传</span>
        <div class="number">0</div>
      </div>
      <div :class="['transIcon', 'topItem', transType === 1 ? 'itemActive' : '']" @click="ChangeType(1)">
        <span>下载</span>
        <div class="number ">0</div>
      </div>
      <div :class="['over', 'topItem', transType === 2 ? 'itemActive' : '']" @click="ChangeType(2)">
        已完成
      </div>
      <div class="addBtn" style="position: absolute; right: 30px; top: 10px;cursor: pointer;" @click="addUploadFile">
        <!-- <img src="../assets/add.png" alt="" > -->
      </div>
    </div>
    <div class="transBody">
      <!-- v-if="filePinia.AllFile.length!==0" -->
      <div class="hasFiles" v-if="propsFileArray.length !== 0">
        <div class="top">
          <div class="topName">名称</div>
          <div class="topPer">状态</div>
        </div>
        <div class="transFileContainer">
          <div v-for="(item, index) in propsFileArray" :key="index" style="width: 100%; height: 50px;">
            <transFile :typeNum="transType" :fileInfo="item" :transType="transType">{{ index }}</transFile>
          </div>
        </div>
      </div>
      <div class="noFiles" v-else>
        <div class="noImg">
          <img src="../assets/noTrans.png" alt="">
          <span style="margin-top: 8px;">暂无任务</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import transFile from '../../src/components/transFile.vue'
import { useFilePinia } from '../pinia/file';
import { useUserPinia } from '../pinia/user'
// 获取所有文件信息接口
import { getFilesInfo } from '../api/files'
// 导入uploadFile内的函数
import { initUpload } from '../utils/uploadFile'
// 消息通知组件
import { ElNotification } from 'element-plus'

const userPinia = useUserPinia()
const filePinia = useFilePinia()
const transType = ref(0)
// 根据num值进进行切换
const ChangeType = (typeNum) => {
  transType.value = typeNum
  if (typeNum === 0) {
    propsFileArray.value = filePinia.noOverFileArray
  } else if (typeNum === 1) {
    propsFileArray.value = []
  } else {
    propsFileArray.value = filePinia.OverFileArray
  }
}

const propsFileArray = ref([])
// 默认传入未上传完成的文件数组
propsFileArray.value = filePinia.noOverFileArray

// 添加上传文件
const addUploadFile = async () => {
  // 创建一个input元素
  const inputNode = document.createElement("input");
  inputNode.id = "fileName";
  inputNode.type = "file";
  // 触发click事件
  inputNode.click()
  // 监听change事件
  await inputNode.addEventListener('change', async (e) => {
    const file = inputNode.files[0]
    const timer = Date.now()
    const res = await initUpload(file, timer)
    saveFileInfo(file, timer)
    filePinia.setUploadFile(file.name + file.name.split('.')[(file.name.split('.').length - 1)])
    if (res.code !== 200) {
      return ElMessage({
        message: res.message,
        type: 'error',
      })
    }

    return ElMessage({
      message: res.message,
      type: 'success',
    })
  })
  try {
    // 移除该input
    document.removeChild(inputNode)
  } catch (error) {

  }
}


// 保存上传的文件信息
const saveFileInfo = (file, timer) => {
  const temp = {}
  temp.userId = userPinia.userInfo.userId
  temp.filename = file.name
  temp.size = parseFloat(file.size / 1024 / 1024).toFixed(2) - 0
  temp.type = file.name.split('.')[(file.name.split('.').length - 1)]
  temp.createTime = timer
  temp.file = file
  const arr = filePinia.noOverFileArray
  arr.push(temp)
  filePinia.addnoOverFileArray(arr)
}

</script>

<style lang='less' scoped>
.container {
  position: fixed;
  height: 100%;
  width: 1680px;
}

.top {
  display: flex;
  align-items: center;
  // background-color: aquamarine;
  width: 100%;
  height: 60px;
  margin-top: 0;

  .topItem {
    margin-left: 40px;
    cursor: pointer;
    color: #b0b1b3;
    transition: all .4s;
    border-radius: 12%;

    &:hover {
      background-color: #f5f5f6;
    }

    padding: 5px;
  }

  .itemActive {
    color: #5f5f63;
    background-color: #f5f5f6;
  }

  .title {
    margin-left: 50px;
    color: #000;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
  }

  .transIcon {
    display: flex;
    align-items: center;
    justify-content: center;

    .number {
      height: 12px;
      width: 20px;
      margin-left: 5px;
      font-size: 12px;
      line-height: 12px;
      background-color: #f5f5f6;
      text-align: center;
      border-radius: 30%;
    }
  }

}

.hasFiles {
  .top {
    width: 1680px;
    height: 30px;
    display: flex;
    // padding-left: 20px;
    font-size: 14px;
    color: #b0b1b3;
    border-top: 1px solid #f5f5f6;
    border-bottom: 1px solid #f5f5f6;

    .topName {
      margin-left: 20px;
    }

    .topPer {
      margin-left: 1400px;
    }
  }
}

.transBody {
  // background-color: #b0b1b3;
  height: 100%;
  width: 100%;
  margin-left: 50px;

  .hasFiles {
    height: 100%;
    width: 100%;

    .transFileContainer {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

    }
  }
}

.noImg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-70%, -70%);
}

.addBtn {
  cursor: pointer;
  height: 45px;
  width: 45px;
  background-image: url(../assets/add.png);
}

.addBtn:hover {
  background-image: url(../assets/add2.png);
}
</style>
