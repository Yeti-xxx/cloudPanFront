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
import { verifyFile } from '../api/files'
import { forEach } from 'lodash';
import { getFilesInfo } from '../api/files'

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
// axios中止的返回值
const CancelToken = axios.CancelToken;
// 上传进度
let curPercent = ref(0)
// 存储axios返回的中止方法
const cancelArr = ref([])
// 记录上传过程中失败的文件切片index的数组
const lostArray = ref([])

const { fileInfo, transType } = toRefs(props)
console.log(fileInfo.value);
// 用于接收每个切片axios返回的取消函数
const formats = () => {
  return '已暂停'
}
const filePinia = useFilePinia()
// 已完成的文件数组
const myFileArray = ref([])

onMounted(async () => {
  const fileType = fileInfo.value.filename.split('.')[(fileInfo.value.filename.split('.').length - 1)]
  const fileName = fileInfo.value.filename
  // 如果当前需要上传的是本文件
  if ((fileName + fileType) === filePinia.needUploadFile) {
    // 通过此处可获得file 但由于浏览器安全限制，页面一旦刷新文件对象就将丢失！
    filePinia.setUploadFile('') //置空标志，避免重复上传
    const file = fileInfo.value.file
    const createTime = fileInfo.value.createTime
    const chunkList = sliceFile(file, createTime)
    let promiseList = createChunkPromiseList(chunkList, file.name, createTime, chunkList.length);
    const resPromise = await createLimitPromise(2, promiseList)
    // 完成后发送合并操作
    const res = await mergeFiles(createTime, chunkList.length, fileName, fileType)
    console.log(res);
    if (res.data.code !== 200) {
      return ElMessage({
        message: res.data.message,
        type: 'error',
      })
    }
    // 将仓库中的该条文件上传记录删除
    filePinia.popUploadFile(fileName + fileType)
    // 更新文件信息
    const temp = await getFiles()
    myFileArray.value = filterFiles(temp, 0)
    filePinia.addOverFileArray(myFileArray.value)
    return ElMessage({
      message: '上传完成',
      type: 'success',
    })
  }

})

// 获取文件基本信息
const getFiles = async () => {
  const res = await getFilesInfo()

  return res.data.FilesInfo
}

// 传入不同的type值筛选出不同文件 0 表示已完成 1表示未完成
const filterFiles = (arr, type) => {
  // 筛选出已经上传完成的文件
  const resArr = arr.reduce(function (pre, curr, array) {
    if (curr.isUploadOver !== type) {
      return pre
    }
    pre.push(curr)
    return pre
  }, [])
  return resArr
}


// 验证并重新上传操作
const VerifyAndUpload = async () => {
  // 发送验证文件
  const resVerify = await verifyFile({ FileType: fileType, FileName: fileName })
  lostArray.value = resVerify.data.resArray
  // 如果lostArray长度大于0则重新发送一次
  if (lostArray.value.length > 0) {
    let lostList = lostChunkUpload(file, lostArray.value)
    console.log(lostList);
    let promiseList = createLostChunkPromiseList(lostList, file.name, createTime, chunkList.length, lostArray.value);
    const resPromise = await createLimitPromise(2, promiseList)
  }
}

// 根据lostArray重新上传丢失的切片
const lostChunkUpload = (file, lostArray) => {
  const chunkList = sliceFile(file)
  return chunkList
}

// 文件合并操作
const mergeFiles = (createTime, totalChunk, filename, fileType) => {
  let mergeFormData = new FormData();
  mergeFormData.append("type", "merge");
  mergeFormData.append("token", createTime);
  mergeFormData.append("chunkCount", totalChunk);
  mergeFormData.append("fileName", filename);
  mergeFormData.append("Filetype", fileType)
  //结束后发送合并请
  return axios.post(UPLOAD_URL, mergeFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
    },
  })
}

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


// 分割数据
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

const createLostChunkPromiseList = (chunkList, name, creatTime, totalLength, lostArray) => {
  return chunkList.map((element) => {
    let Lostformdata = new FormData();
    Lostformdata.append("type", "upload")
    Lostformdata.append("name", name)
    Lostformdata.append("Filetype", name.split('.')[name.split('.').length - 1])
    Lostformdata.append("token", creatTime);
    Lostformdata.append("chunk", chunkList[element]);
    Lostformdata.append("index", element);
    Lostformdata.append('totalLength', totalLength)
    return Lostformdata
  })
    .map((formdata, index) => {
      return axios.post(UPLOAD_URL, formdata, axiosConfig).then(res => {
      }).catch(err => {
        console.log(err);
      });
    })
}

//封装formdata 并上传
const createChunkPromiseList = (chunkList, name, creatTime, totalLength, lostArray = []) => {
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
