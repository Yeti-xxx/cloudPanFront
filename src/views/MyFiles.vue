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
// 文件数组
let myFileArray = ref([])
const getFiles = async () => {
    const res = await getFilesInfo()
    console.log(res);
    // 筛选出已经上传完成的文件
    const arr = res.data.FilesInfo.reduce(function (pre, curr, array) {
        if (curr.isUploadOver !== 0) {
            return
        }
        pre.push(curr)
        return pre
    }, [])
    return arr

}

onBeforeMount(async () => {
    myFileArray.value = await getFiles()

})
const container = ref(null)
onMounted(() => {
    // container.value
})


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
