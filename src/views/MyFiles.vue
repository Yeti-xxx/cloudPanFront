<template>
    <div class="container" ref="container">
        <div class="fileItemContainer clear">
            <div class="fileItem" v-for="(item, index) in myFileArray" :key="index">
                <FileComponent :fileInfo="item"></FileComponent>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onBeforeMount, ref, onMounted } from 'vue';
import { getFilesInfo } from '../api/files'
import FileComponent from '../components/file.vue'
import { useFilePinia } from '../pinia/file';
// 上传完成文件数组
let myFileArray = ref([])
// 未上传完成文件数组
let noOverArray = ref([])
const getFiles = async () => {
    const res = await getFilesInfo()

    return res.data.FilesInfo
}
// 获取container DOM
const container = ref(null)

// 获取file仓库
const filePinia = useFilePinia()

onBeforeMount(async () => {
    const temp = await getFiles()
    myFileArray.value = filterFiles(temp, 0)
    noOverArray.value = filterFiles(temp, 1)
    filePinia.addOverFileArray(myFileArray.value)
    // filePinia.addnoOverFileArray(noOverArray.value)

})


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




</script>

<style lang='less' scoped>
.fileItemContainer {
    // display: flex;
    // flex-flow: wrap;
    height: 900px;
    width: 1600px;

    .fileItem {
        float: left;
        margin-top: 50px;
        margin-left: 70px;

    }
}

.clear:after {
    content: '.';
    height: 0;
    display: block;
    clear: both;
}
</style>
