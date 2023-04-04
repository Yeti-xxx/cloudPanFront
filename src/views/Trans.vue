<template>
  <div class="container">
    <div class="top">
      <div class="topItem title">传输列表</div>
      <div class="transIcon topItem">
        <span>上传</span>
        <div class="number">0</div>
      </div>
      <div class="transIcon topItem">
        <span>下载</span>
        <div class="number ">0</div>
      </div>
      <div class="over topItem">
        已完成
      </div>
    </div>
    <div class="transBody">
      <div class="hasFiles">
        <transFile></transFile>
      </div>
      <div class="noFiles">

      </div>
    </div>
  </div>
</template>

<script setup>
import transFile from '../../src/components/transFile.vue'
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
    transition: all .6s;
    border-radius: 12%;

    &:hover {
      background-color: #f5f5f6;
    }

    padding: 5px;
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

.transBody {
  background-color: #b0b1b3;
  height: 100%;
  width: 100%;
  margin-left: 50px;

}


</style>
