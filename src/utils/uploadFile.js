import axios from 'axios'
import { initFilesAxios } from '../api/files'

const UPLOAD_URL = "http://127.0.0.1:5007/api/uploadFiles"  //请求地址
const CHUNK_SIZE = 15 * 1024 * 1024 //每个切片大小
let loadedLen = 0
let fileChunkLen = 0
let cancelArr = []
const CancelToken = axios.CancelToken;
let curPercent = []

export const getConfigCancelArr = () => {
    return cancelArr
}

export const getCurPercent = ()=>{
    return curPercent
}

//axios 配置
const axiosConfig = {
    onUploadProgress: progressEvent => {
        const num = (loadedLen / fileChunkLen * 100).toFixed(2)
        curPercent[0] = num
    },
    cancelToken: new CancelToken(function executor(c) {
        cancelArr.push(c);
    }),
    headers: {
        'Content-Type': 'multipart/form-data',
        'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
    },
};

export const initUpload = async (file, timer) => {
    let size = parseFloat(file.size / 1024 / 1024).toFixed(2) - 0
    let type = file.name.split('.')[(file.name.split('.').length - 1)]
    const res = await initFilesAxios(size, type, file.name, file.size, UPLOAD_URL, timer)
    return res
}

// 切割数据
export const sliceFile = (file) => {
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
export const createChunkPromiseList = (chunkList, name, creatTime, totalLength) => {
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
export const createLimitPromise = (limitNum, promiseListRaw) => {
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