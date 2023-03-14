<template>
  <div class="container">
    <div class="header">
      <img class="logoImg" src="../assets/logo.png" alt="" />
    </div>
    <div class="content">
      <div class="leftMenu">
        <div class="list">
          <div class="listItem">
            <el-icon color="#25262b" :size="30">
              <Folder />
            </el-icon>
            <p style="font-size: 18px;">文件</p>
          </div>
          <div class="listItem">
            <el-icon color="#25262b" :size="30">
              <Delete />
            </el-icon>
            <p style="font-size: 18px;">回收站</p>
          </div>
          <div class="listItem">
            <el-icon color="#25262b" :size="30">
              <Sort />
            </el-icon>
            <p style="font-size: 18px;">传输列表</p>
          </div>
        </div>
      </div>
      <div class="rightContent">

      </div>
    </div>
  </div>
</template>

<script setup>
import login from './login.vue';

</script>

<style lang='less' scoped>
.container {
  position: fixed;
  height: 100%;
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-end;
  height: 50px;
  width: 100%;
  background-color: #e8e8e9;
  margin: 0;
  padding: 0;

  .logoImg {
    display: block;
    transform: scale(0.55);
    margin-right: 20px;

  }
}

.content {
  display: flex;
  // background-color: pink;
  height: 100%;
  width: 100%;

  .leftMenu {
    flex-basis: 240px;
    height: 100%;
    background-color: #f5f5f6;
    .list{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      .listItem{
        cursor:pointer;
        display: flex;
        align-items: center;
        width: 180px;
        padding-left: 20px;
        border-radius: 11%;
        p{
          margin-left: 10px;
        }
      }
      .listItem:hover{
        background-color: #ececee;
      }
    }
  }

  .rightContent {
    flex-grow: 1;
  }
}</style>
