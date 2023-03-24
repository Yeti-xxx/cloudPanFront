<template>
  <div class="container">
    <div class="header">
      <img class="logoImg" src="../assets/logo.png" alt="" />
    </div>
    <div class="content">
      <div class="leftMenu">
        <div class="list">
          <div class="listItem">
            <el-icon color="#25262b" :size="25">
              <Folder />
            </el-icon>
            <p style="font-size: 16px;">文件</p>
          </div>
          <div class="listItem">
            <el-icon color="#25262b" :size="25">
              <Delete />
            </el-icon>
            <p style="font-size: 16px;">回收站</p>
          </div>
          <div class="listItem">
            <el-icon color="#25262b" :size="25">
              <Sort />
            </el-icon>
            <p style="font-size: 16px;">传输列表</p>
          </div>
          <div class="listItem" @click="gotoTest">
            <el-icon color="#25262b" :size="25">
              <Odometer />
            </el-icon>
            <p style="font-size: 16px;">测试页面</p>
          </div>
          <div class="userBox">
            <div class="userName">
              <el-avatar :src=userInfo.avatar :fit="fill" />
              <span style="display: block; margin-left: 10px;">{{ userInfo.nickname }}</span>
            </div>
            <div class="userOption">
              <el-dropdown trigger="click" size="large">
                <el-icon>
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="gotoMyCenter">个人中心</el-dropdown-item>
                    <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="rightContent">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import login from './login.vue';
import { useUserPinia } from '../pinia/user';
import { useRouter } from 'vue-router';
import { onBeforeMount, watch } from 'vue';
// 接口
import { getUserInfo } from '../api/user'

// UserPinia
const UserPinia = useUserPinia()
// router
const router = useRouter()
// 用户信息
const userInfo = ref({})
// 退出登录
const loginOut = () => {
  UserPinia.setToken('')
  router.push('/login')
  return ElMessage({
    message: '退出',
    type: 'success',
  })
}
// 监听头像或资料是否发送改变
watch(() => UserPinia.isUpdateInfo, (newV, oldV) => {
  homeGetUserInfo()
})

computed(UserPinia.isUpdateInfo, () => {
  homeGetUserInfo()
})

function homeGetUserInfo() {
  console.log('homeGetUserInfo');
  getUserInfo().then(res => {
    if (res.code === 401) {
      ElMessage({
        message: res.message,
        type: 'error',
      })
      return router.push('/login')
    }
    if (res.code !== 200) {
      return ElMessage({
        message: res.message,
        type: 'error',
      })
    }
    userInfo.value = res.data
    UserPinia.setUserInfo(userInfo.value)
  })
}

onBeforeMount(() => {
  homeGetUserInfo()
})

// 
const gotoMyCenter = () => {
  router.push('/home/myCenter')
}

// 前往test页面
const gotoTest = () => router.push('/home/test')
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

    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;

      .listItem {
        cursor: pointer;
        display: flex;
        align-items: center;
        width: 180px;
        padding-left: 20px;
        border-radius: 11%;
        margin-top: 5px;

        p {
          margin-left: 10px;
        }
      }

      .listItem:hover {
        background-color: #ececee;
      }

      .userBox {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        width: 240px;
        height: 80px;
        // background-color: pink;
        bottom: 0;
        border-top: 1px solid #dedfe1;
        cursor: pointer;

        .userName {
          display: flex;
          align-items: center;
          font-size: 14px;

          span {
            margin-left: 5px;
          }
        }

        .userOption {
          padding: 5px;
          border-radius: 50%;

          &:hover {
            background-color: #e3e3e6;
          }

        }

        &:hover {
          background-color: #ececee;
        }
      }
    }
  }

  .rightContent {
    flex-grow: 1;
  }
}
</style>
<style lang="less">
.el-dropdown-menu__item:not(.is-disabled):focus {
  background-color: #f5f5f6;
  color: #606266;
}
</style>
