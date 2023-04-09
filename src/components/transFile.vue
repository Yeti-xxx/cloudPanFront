<template>
  <div class="container">
    <img :src="`http://127.0.0.1:5173/src/assets/${fileLogo(fileInfo.type)}`" alt="">
    <div class="fileName">{{ fileInfo.filename }}</div>
    <div class="controll" style="" v-if="transType !== 2">
      <div class="startOrpause">
        <el-icon class="icon" :size="18" color="#a9aaad" v-if="0" style="cursor: pointer;">
          <VideoPlay />
        </el-icon>
        <el-icon class="icon" :size="18" color="#a9aaad" v-else style="cursor: pointer;">
          <VideoPause />
        </el-icon>
      </div>
      <div style="margin-left: 15px;cursor: pointer;">
        <el-icon class="cancel" :size="18" color="#a9aaad">
          <CircleClose />
        </el-icon>
      </div>
    </div>
    <div class="percent" v-if="transType !== 2">
      <el-progress :percentage="curPercent" color="#6d7dfc" :show-text="false" :format="formats" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { fileLogo } from '../utils/regExp'
import { useFilePinia } from '../pinia/file';
import axios from 'axios'
const props = defineProps({
  fileInfo: {
    type: Object,
  },
  transType: {
    type: Number
  }
})
const UPLOAD_URL = "http://127.0.0.1:5007/api/uploadFiles"  //请求地址
const CHUNK_SIZE = 15 * 1024 * 1024 //每个切片大小
let loadedLen = 0
let fileChunkLen = 0
const CancelToken = axios.CancelToken;
let curPercent = ref(0)
const cancelArr = ref([])

const { fileInfo, transType } = toRefs(props)
console.log(fileInfo.value);
// 用于接收每个切片axios返回的取消函数
const formats = () => {
  return '已暂停'
}
const filePinia = useFilePinia()

onMounted(async () => {
  // 如果当前需要上传的是本文件
  if ((fileInfo.value.filename + fileInfo.value.filename.split('.')[(fileInfo.value.filename.split('.').length - 1)]) === filePinia.needUploadFile) {
    // 通过此处可获得file 但由于浏览器安全限制，页面一旦刷新文件对象就将丢失！
    filePinia.setUploadFile('') //置空标志，避免重复上传
    const file = fileInfo.value.file
    const createTime = fileInfo.value.createTime
    const chunkList = sliceFile(file, createTime)
    let promiseList = createChunkPromiseList(chunkList, file.name, createTime, chunkList.length);
    await createLimitPromise(2, promiseList)

  }
})

//axios 配置
const axiosConfig = {
  onUploadProgress: progressEvent => {
    curPercent.value = (loadedLen / fileChunkLen * 100).toFixed(2)

  },
  cancelToken: new CancelToken(function executor(c) {
    cancelArr.value.push(c);
  }),
  headers: {
    'Content-Type': 'multipart/form-data',
    'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
  },
};

const sliceFile = (file) => {
  let chunkList = []
  let start = 0
  let end = CHUNK_SIZE
  while (true) {
    let curChunk = file.slice(start, end)
    if (!curChunk.size) {
      break;
    }
    chunkList.push(curChunk)
    start += CHUNK_SIZE
    end = start + CHUNK_SIZE
  }
  fileChunkLen = chunkList.length + 1
  return chunkList
}

//封装formdata 并上传
const createChunkPromiseList = (chunkList, name, creatTime, totalLength) => {
  return chunkList.map((chunk, index) => {
    let formdata = new FormData();
    formdata.append("type", "upload")
    formdata.append("name", name)
    formdata.append("Filetype", name.split('.')[name.split('.').length - 1])
    formdata.append("token", creatTime);
    formdata.append("chunk", chunk);
    formdata.append("index", index);
    formdata.append('totalLength', totalLength)
    return formdata
  })
    .map((formdata, index) => {
      return axios.post(UPLOAD_URL, formdata, axiosConfig).then(res => {
      }).catch(err => {
        console.log(err);
      });
    })

}

//并发控制 上传 
const createLimitPromise = (limitNum, promiseListRaw) => {
  let resArr = [];
  let handling = 0;
  let resolvedNum = 0;
  let promiseList = [...promiseListRaw]
  let runTime = promiseListRaw.length
  return new Promise(resolve => {
    //并发执行limitNum 次
    for (let i = 1; i <= limitNum; i++) {
      run();
    }

    function run() {
      if (!promiseList.length) return
      handling += 1;
      handle(promiseList.shift())
        .then(res => {
          resArr.push(res);
          loadedLen = resArr.length
        })
        .catch(e => {
          //ignore
          console.log("catch error");
        })
        .finally(() => {
          handling -= 1;
          resolvedNum += 1;
          if (resolvedNum === runTime) {
            resolve(resArr)
          }
          run();
        });
    }
    function handle(promise) {
      return new Promise((resolve, reject) => {
        promise.then(res => resolve(res)).catch(e => reject(e));
      });
    }
  });
}

</script>

<style lang='less' scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 13px;
  height: 50px !important;
  width: 100%;
  font-size: 13px;
  border-bottom: 1px solid #f6f6f6;
  padding-top: 3px;
  padding-bottom: 3px;
  transition: all .4s;

  img {
    height: 30px;
  }

  .fileName {
    margin-left: 10px;
  }

  &:hover {
    background-color: #f5f5f6;
  }

  &:hover>.controll {
    position: absolute;
    height: 57px;
    display: flex;
    right: 500px;
    align-items: center;
    transition: all .4s;
  }

  .percent {
    position: absolute;
    width: 200px;
    // height: 50px;
    right: 100px;
  }

  .controll {
    display: none;

    .icon:hover {
      color: #25262b;
    }

    .cancel:hover {
      color: #f15a50;
    }

  }
}
</style>
