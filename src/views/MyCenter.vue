<template>
  <div class="container">
    <div class="header">
      <div class="AvatarAndName">
        <el-avatar class="avatar" @click="changeFlagAvatarBox(true)" :src=userInfo.avatar :fit="fill" :size="60" />
        <span style="display: block; margin-left: 10px;color: #ffffff;font-size: 22px;">{{ userInfo.nickname }}</span>
      </div>
    </div>
    <Transition name="select">
      <div class="selectAvatar" v-show="selectFlag">
        <input v-show="false" ref="AvatarInput" type="file" class="getAvatar" accept="image/*" />
        <div class="selectTop">
          <el-icon class="close" :size="24" @click="changeFlagAvatarBox(false)">
            <Close />
          </el-icon>
        </div>
        <div class="selectBody">
          <div class="selectBtnBox">
            <div class="selectMy selectBtn" @click="openFiles">
              选择本地图片
            </div>
            <div class="selectQuick selectBtn" @click="changeFlagQABOX">
              QuicPan提供的头像
            </div>
          </div>
          <div class="preview">
            <!-- <el-avatar ref="previewAvatar" class="avatar" :src="previewUrl" :fit="fill" :size="130" /> -->
            <img class="previewAvatar" ref="previewAvatar" :src="previewAvatarUrl" alt="" />
          </div>
        </div>
        <div class="selectBottom">
          <div :class="['uploadBtn', uploadFlag ? 'canUpload' : 'noUpload']" @click="upload">更新</div>
        </div>
        <Transition name="QuickPABox">
          <div class="QuickPanAvatarBox" v-if="flagQABox">
            <div class="item" v-for="item in QABoxArr" :key="item.avatarId">
              <el-avatar @click="clickQPAvatar(item)" class="el-avatar" :size="100" :src="item.avatar" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useUserPinia } from '../pinia/user';
import { useRouter } from 'vue-router';
// 头像上传api
import { updateAvatar, QPAvatar, useQPAvatar } from '../api/user'
const userPinia = useUserPinia()
// 获取缓存的用户数据
let userInfo = ref({})
// 开启或隐藏头像选中框
let selectFlag = ref(false)
userInfo.value = userPinia.userInfo
let previewAvatarUrl = ref('')
previewAvatarUrl.value = userInfo.value.avatar
const changeFlagAvatarBox = (flag) => {
  selectFlag.value = flag
  if (flag) {
    getQPAvatar()
  }
}
// 头像来源是本地文件还是QA提供
let localOrQA = ref(true)
// input
const AvatarInput = ref(null)
const previewAvatar = ref(null)
// 点击打开文件夹，选择图片
const openFiles = () => {
  AvatarInput.value.click()
  AvatarInput.value.addEventListener('change', () => {
    // 获取图片
    const file = AvatarInput.value.files[0]
    // 创建一个新的FileReader对象
    const reader = new FileReader()
    reader.addEventListener('load', function () {
      previewAvatar.value.src = reader.result
    })
    uploadFlag.value = true
    localOrQA.value = true
    // 读取文件数据
    reader.readAsDataURL(file);
  })

}
// 上传按钮是否允许点击
let uploadFlag = ref(false)
// 创建router
const router = useRouter()
// 点击上传
const upload = () => {
  if (localOrQA.value) {
    // 创建一个FormData对象
    const formData = new FormData();
    // 将文件添加到FormData对象中
    formData.append('file', AvatarInput.value.files[0]);
    updateAvatar(formData).then(res => {
      if (res.code !== 200) {
        return ElMessage({
          message: res.message,
          type: 'error',
        })
      }
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
    })
  } else {
    useQPAvatar({ avatar: previewAvatarUrl.value }).then(res => {
      if (res.code !== 200) {
        return ElMessage({
          message: res.message,
          type: 'error',
        })
      }
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
    })
  }
  // 更新头像状态
  userPinia.changeIsUpdateInfo()
  router.go(-1)

}
// 控制QA头像Box显示
let flagQABox = ref(false)
// QAbox头像数组
const QABoxArr = ref([])
const changeFlagQABOX = () => {
  flagQABox.value = !flagQABox.value
}
const getQPAvatar = () => {
  QPAvatar().then(res => {
    if (res.code !== 200) {
      return ElMessage({
        message: res.message,
        type: 'error',
      })
    }
    QABoxArr.value = res.data
  })
}
const clickQPAvatar = (item) => {
  previewAvatarUrl.value = item.avatar
  localOrQA.value = false
  uploadFlag.value = true
}



</script>

<style lang='less' scoped>
.container {
  position: fixed;
  height: 100%;
  width: 100%;
}

.header {
  position: relative;
  width: 100%;
  height: 110px;
  background-color: #6889fd;

  .AvatarAndName {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    position: absolute;
    bottom: 0;
    padding-left: 20px;
    width: 240px;
    height: 80px;

    .avatar:hover {
      cursor: pointer;
    }

  }
}

.selectAvatar {
  box-sizing: border-box;
  box-shadow: 4px 2px 18px #999999;
  border-radius: 2%;
  position: absolute;
  width: 500px;
  height: 430px;
  left: 50%;
  transform: translateX(-80%);
  margin-top: 100px;
  background-color: #ffffff;

  .selectTop {
    position: relative;
    width: 500px;
    height: 80px;
    color: #ccc;

    .close {
      position: absolute;
      right: 6px;
      top: 2px;
      cursor: pointer;
    }
  }

  .selectBody {
    display: flex;
    height: 245px;
    width: 500px;

    .selectBtnBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-right: 2px solid #e5e9ef;
      height: 100%;
      width: 55%;
    }

    .selectBtn {
      width: 190px;
      height: 85px;
      border-radius: 4%;
      background-color: #f1f2f5;
      transition: background-color .4s;
      color: #5a6267;
      text-align: center;
      line-height: 85px;
      cursor: pointer;

      &:hover {
        background-color: #e5e9ef;
      }
    }

    .preview {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 45%;
      // background-color: #6889fd;
    }

    .previewAvatar {
      height: 160px;
      width: 160px;
      border-radius: 50%;


    }
  }

  .selectBottom {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 105px;
    width: 500px;

    .uploadBtn {
      height: 40px;
      width: 140px;
      border-radius: 5%;
      text-align: center;
      line-height: 40px;
    }

    .noUpload {
      color: #ccd0d7;
      background: #f4f5f7;
      pointer-events: none;
    }

    .canUpload {
      background-color: #00a1d6;
      color: #fff;
      cursor: pointer;
    }
  }

  .QuickPanAvatarBox {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    height: 100%;
    width: 50%;
    background-color: #fff;
    bottom: 0;
    left: 103%;
    border-radius: 2%;
    box-shadow: 4px 2px 18px #aaaaaa;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-basis: 50%;
      box-sizing: border-box;
      cursor: pointer;

      .el-avatar {
        border: 2px solid #e5e9ef;
        transition: box-shadow, .3s;

        &:hover {
          box-shadow: 2px 4px 5px #aaaaaa;
        }
      }
    }
  }
}

.select-enter-active,
.select-leave-active {
  transition: opacity 0.6s ease;
}

.select-enter-from,
.select-leave-to {
  opacity: 0;
}

.QuickPABox-enter-active,
.QuickPABox-leave-active {
  transition: opacity 0.6s ease;
}

.QuickPABox-enter-from,
.QuickPABox-leave-to {
  opacity: 0;
}
</style>
