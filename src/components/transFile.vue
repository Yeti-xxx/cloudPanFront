<template>
  <div class="container">
    <img :src="`http://127.0.0.1:5173/src/assets/${fileLogo(fileInfo.type)}`" alt="">
    <div class="fileName">{{ fileInfo.filename }}</div>
    <div class="controll" style="">
      <div class="startOrpause">
        <el-icon class="icon" :size="18" color="#a9aaad" v-if="1" style="cursor: pointer;">
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
    <div class="percent">
      <el-progress percentage="50" color="#6d7dfc" :show-text="false" :format="formats" />
    </div>
  </div>
</template>

<script setup>
import { fileLogo } from '../utils/regExp'
const props = defineProps({
  fileInfo: {
    type: Object,
  },
  typeNum: {
    type: Number
  }
})

const formats = () => {
  return '已暂停'
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
}</style>
