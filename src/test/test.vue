<template>
    <div>
        <input accept=".zip" id="file" ref="testInput" type="file" name="" value="">
        <div @click="gotoServer">上传</div>
        <div @click="abordtoServer">暂停</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
const testInput = ref(null)
const UPLOAD_URL = "http://127.0.0.1:5007/api/uploadFiles ";

onMounted(() => {
    testInput.value.addEventListener('change', async () => {
        submitUpload(UPLOAD_URL, testInput.value.files[0])
    })
})
const CancelToken = axios.CancelToken;
let cancel = ref([]);
let flag = ref(true)
let TOKEN = null

// 暂停上传 本质其实是中断Axios的请求
const abordtoServer = () => {
    try {
        flag.value = false
        localStorage.setItem('time', TOKEN)
        cancel.value.forEach((val) => {
            val();
        });
    } catch (error) {
        console.log(error);
    }
}

async function initUpload(url, file) {
    let initFormData = new FormData()
    let size = parseFloat(file.size / 1024 / 1024).toFixed(2) - 0
    let type = file.name.split('.')[(file.name.split('.').length - 1)]
    initFormData.append('type', 'init')
    initFormData.append('createTime', Date.now())
    initFormData.append('size', size)
    initFormData.append('filetype', type)
    initFormData.append('fileName', file.name)
    initFormData.append('totalChunk', Math.ceil(file.size / 15 / 1024 / 1024))
    axios.post(url, initFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
        },
    })
}

async function submitUpload(url, file) {
    // initUpload(url, file)

    // const CHUNKSIZE = 15 * 1024 * 1024; // 5M
    // // TOKEN = Date.now();
    // TOKEN = localStorage.getItem('time')
    // console.log(TOKEN);
    // //切割数组
    // const chunkList = sliceFile(file, CHUNKSIZE);
    // //创建formdata 并上传
    // let promiseList = createChunkPromiseList(chunkList, file.name, TOKEN, chunkList.length);
    // //并发控制 上传 
    // await createLimitPromise(2, promiseList);

    // 这里的await保证了分片全部传送出去,然后执行合并分片的请求
    //合并分片
    let mergeFormData = new FormData();
    mergeFormData.append("type", "merge");
    mergeFormData.append("token", localStorage.getItem('time'));
    // mergeFormData.append("token", TOKEN);
    mergeFormData.append("chunkCount", 256);
    mergeFormData.append("fileName", file.name);
    mergeFormData.append("Filetype", file.name.split('.')[file.name.split('.').length - 1])
        //结束后发送合并请
    const res = await axios.post(url, mergeFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
        },
    })



}


function createLimitPromise(limitNum, promiseListRaw) {
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

//分片二进制数据
function sliceFile(file, chunkSize) {
    let chunkList = [];
    let start = 0;
    let end = chunkSize;
    while (true) {
        let curChunk = file.slice(start, end);
        if (!curChunk.size) break;
        chunkList.push(curChunk);
        start += chunkSize;
        end = start + chunkSize;
    }
    fileChunkLen = chunkList.length + 1
    return chunkList;
}
let uploadedInfo = getUploadedFromStorage() //获得已上传的分段信息
let sendChunkCount = 0 //记录已经上传的chunk数量,默认为0
let mergeFlag = false //是否发起合并请求，默认为false,只有所有切片传送完成才能发起合并请求
// 断点上传
//获得本地缓存的数据
function getUploadedFromStorage() {
    return JSON.parse(localStorage.getItem('saveChunkKey') || "{}");
}

//写入缓存
function setUploadedToStorage(index) {
    let obj = getUploadedFromStorage()    //获取一下缓存
    obj[index] = true
    localStorage.setItem('saveChunkKey', JSON.stringify(obj))
}
//chunkList => formdata list => PromiseList
//切片数组 封装成 http 请求
function createChunkPromiseList(chunkList, name, TOKEN, totalLength) {
    return chunkList
        .map((chunk, index) => {
            console.log('index', index, uploadedInfo[index] ? '已上传过' : '未上传');
            if (uploadedInfo[index]) {//对比分段
                sendChunkCount += 1;//记录已上传的索引

            } else {
                let formdata = new FormData();
                formdata.append("type", "upload");
                formdata.append("name", name);
                formdata.append("Filetype", name.split('.')[name.split('.').length - 1])
                formdata.append("token", TOKEN);
                formdata.append("chunk", chunk);
                formdata.append("index", index);
                formdata.append('totalLength', totalLength)
                return formdata;
            }
        })
        .map((formdata, index) => {
            return axios.post(UPLOAD_URL, formdata, axiosConfig).then(res => {
                setUploadedToStorage(index)
            }).catch(err => {
                console.log(err);

            });
        });
}

//从limitPromise 函数中获取
let loadedLen = 0
let fileChunkLen = 0
//axios 配置
const axiosConfig = {
    onUploadProgress: progressEvent => {
        const curPercent = (loadedLen / fileChunkLen * 100).toFixed(2)
        console.log(` percentage :${curPercent}%`)
    },
    cancelToken: new CancelToken(function executor(c) {
        cancel.value.push(c);
    }),
    headers: {
        'Content-Type': 'multipart/form-data',
        'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
    },
};





</script>

<style lang='less' scoped></style>
