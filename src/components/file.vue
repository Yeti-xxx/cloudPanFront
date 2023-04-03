<template>
    <div class="container">
        <div class="FileContainer">
            <img :src="`http://127.0.0.1:5173/src/assets/${fileLogo(fileInfo?.type)}`" alt="">
            <span class="name">{{ fileInfo?.filename }}</span>
            <sapn class="createTime">{{ timer(fileInfo?.created_at) }}</sapn>
            <div class="more moreActive" @click="showMoreBoxs" ref="moreIcon" data-more="1">
                <el-icon style="color: #b0b1b3;" data-more="1">
                    <MoreFilled />
                </el-icon>
            </div>
            <Transition name="moreShow">
            <div class="moreBox" v-show="showMore" ref="moreBoxs" data-more="1">
                <div class="item" data-more="1">下载</div>
                <div class="item" data-more="1">分享</div>
                <div class="item recycle" data-more="1">移入回收站</div>
            </div>
        </Transition>
        </div>
    </div>
</template>

<script setup>
import { timer } from '../utils/timeStr'
import { toRefs, ref, onMounted } from 'vue';

const props = defineProps({
    fileInfo: {
        type: Object,
    }
})

const { fileInfo } = toRefs(props)

// 获取文件类型 展示对应图标
const fileLogo = (type) => {
    const imageRegex = /^(jpg|jpeg|png|gif|bmp)$/
    const mp4Regex = /^mp4$/
    const textRegex = /^(doc|docx|pdf|ppt|pptx|txt)$/
    const zipRegex = /^(zip|rar|tar|gz|7z)$/

    return imageRegex.test(type) ? 'img.png' : mp4Regex.test(type) ? 'mp4.png' : textRegex.test(type) ? 'text.png' : zipRegex.test(type) ? 'zip.png' : 'no'
}

const moreIcon = ref(null)
const moreBoxs = ref(null)
let showMore = ref(false)
// 显示多功能菜单
const showMoreBoxs = (e) => {
    const positionInfo = e.target.getBoundingClientRect()
    moreBoxs.value.setAttribute("data-more", "1");
    moreBoxs.value.style.top = 10 + 'px'
    moreBoxs.value.style.left = 100 + 'px'
    showMore.value = true
}

document.addEventListener('click', (e) => {
    console.log(e.target);
    if (e.target.hasAttribute("data-more") || e.target.hasAttribute("xmlns")) {

    } else {
        showMore.value = false
    }
})









</script>

<style lang='less' scoped>
.container {
    position: relative;

    .FileContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 165px;
        width: 120px;
        user-select: none;
        border-radius: 7%;

        img {
            height: 65px;
            width: 54px;
        }

        .name {
            display: inline-block;
            white-space: nowrap;
            width: 100px;
            /* 防止文本换行 */
            overflow: hidden;
            /* 隐藏多余文本 */
            text-overflow: ellipsis;
            /* 显示省略号 */
            font-size: 14px;
            text-align: center;
        }

        .createTime {
            font-size: 12px;
            transform: scale(0.8);
        }

        &:hover {
            cursor: pointer;
            background-color: #f5f5f6;

        }

        &:hover .moreActive {
            opacity: 100%;
        }

        .moreActive {
            transition: all .3s;
            opacity: 0;
        }

    }

    .more {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 2px;
        right: 2px;
        width: 20px;
        height: 20px;
        background-color: #ffffff;
        border-radius: 25%;

    }

    .moreBox {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 105px;
        height: 125px;
        background-color: #ffffff;
        border-radius: 7%;
        box-shadow: 5px 3px 14px #aaa8a8;
        z-index: 999;

        .item {
            box-sizing: border-box;
            width: 100px;
            height: 35px;
            font-size: 14px;
            margin-left: 2px;
            line-height: 35px;
            padding-left: 5px;
            color: #25262b;
            cursor: pointer;
            border-radius: 7%;
        }

        .item:hover {
            background-color: #f5f5f6;
        }
    }
}

.moreShow-enter-active,
.moreShow-leave-active {
    transition: opacity 0.3s ease;
}

.moreShow-enter-from,
.moreShow-leave-to {
    opacity: 0;
}
</style>
