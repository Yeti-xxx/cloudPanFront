<template>
    <div class="bg">
        <el-card class="box-card">
            <div class="logo">
                <img src="../assets/logo.png" class="logoImg">
                <div class="logoFont" style="color: #ffffff;">QuickPan</div>
            </div>
            <div class="loginOrReg">
                <div class="tab">
                    <span :class="[tabActive == 1 ? 'activeTab' : '']" @click="changeTab(1)">登录</span>
                    <span :class="[tabActive == 2 ? 'activeTab' : '']" @click="changeTab(2)">注册</span>
                </div>
                <div class="accountBox">
                    <div class="userNameBox">
                        <input type="text" placeholder="用户名" v-model="loginBody.username">
                    </div>
                    <div class="passWordBox">
                        <input type="password" placeholder="密码" v-model="loginBody.password">
                    </div>
                    <div class="goTo" @click="goto">
                        CLICK
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
// 引入api
import { login, register } from '../api/login'
// 引入正则
import { regUserName, regPassword } from '../utils/regExp'
// 引入userPinia
import { useUserPinia } from '../pinia/user'
const router = useRouter()
let tabActive = ref(1)
const loginBody = ref({ username: '', password: '' })
const changeTab = (index) => {
    tabActive.value = index
}
const UserPinia = useUserPinia()
const goto = () => {
    if (!regUserName.test(loginBody.value.username)) {
        return ElMessage({
            message: '用户名长度为4-8位',
            type: 'error',
        })
    }
    if (!regPassword.test(loginBody.value.password)) {
        return ElMessage({
            message: '密码长度为8-16位，包含数字和字母',
            type: 'error',
        })
    }
    // 走登录通道
    if (tabActive.value == 1) {
        login(loginBody.value).then(res => {
            if (res.code !== 200) {
                return ElMessage({
                    message: res.message,
                    type: 'error',
                })
            } else {
                console.log(res);
                UserPinia.setToken(res.token)
                ElMessage({
                    message: res.message,
                    type: 'success',
                })
                return router.push('/home') 
            }
        })
    } else {
        // 走注册通道
        register(loginBody.value).then(res => {
            if (res.code !== 200) {
                return ElMessage({
                    message: res.message,
                    type: 'error',
                })
            } else {
                return ElMessage({
                    message: res.message,
                    type: 'success',
                })
            }
        })
    }
}


</script>

<style lang='less' scoped>
.loginOrReg {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 300px;
    height: 325px;
    background-color: #ffffff;
    border-radius: 4%;
    box-shadow: 2px 3px 11px #333333;
    margin: auto;
    background-color: rgba(255, 255, 255, 0.9);

    input {
        background: none;
        outline: none;
        border: none;
        border-bottom: 1px solid #47a0d3;
        font-size: 16px;
        width: 80%;
    }

    input:focus {
        border-bottom: 1px solid #4806ff;
    }

    .tab {
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding-top: 20px;
        font-size: 16px;
        color: #5c5b5b;

        span {
            cursor: pointer;
        }

        .activeTab {
            display: inline-block;
            color: #000;
            font-weight: 600;
        }
    }

    .accountBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width: 230px;
        height: 240px;
        
        .userNameBox,
        .passWordBox {
            display: flex;
            justify-content: center;
        }

        .aginPassWord {
            display: none;
        }

        .goTo {
            width: 100px;
            height: 30px;
            font-size: 18px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
            color: #4768d3;
        }

        .goTo:hover {
            color: #6919c5;
        }
    }
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;

    .logoImg {
        // position: absolute;
        transform: scale(0.35);
        margin-left: -40px;
    }

    .logoFont {
        // position: absolute;
        font-size: 36px;
        font-weight: 600;
        font-family: Arial, sans-serif;
        width: 180px;
        line-height: 46px;
        margin-left: -50px;
    }
}

.box-card {
    position: absolute;
    height: 560px;
    width: 500px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-60%);
    background-color: #ffffff;
    border: 0;
    border-radius: 1.8%;
    padding: 0;
    background-image: url('../assets/logBg.jpg');
    background-size: cover;

}

.bg {
    width: 100%;
    height: 100%;
    position: fixed;
}

@property --colorA {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(174, 83, 182);
}

@property --colorC {
    syntax: '<color>';
    inherits: false;
    initial-value: #bd8a85;
}

@property --colorF {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(72, 124, 155);
}

.bg {
    background: linear-gradient(45deg,
            var(--colorA),
            var(--colorC),
            var(--colorF));
    animation: change 10s infinite linear;
}

@keyframes change {
    // 20% {
    //     --colorA: #CCD5AE;
    //     --colorC: #E9EDC9;
    //     --colorF: #FEFAE0;
    // }

    40% {
        --colorA: #144272;
        --colorC: #205295;
        --colorF: #2C74B3;
    }

    // 60% {
    //     --colorA: #ECF2FF;
    //     --colorC: #E3DFFD;
    //     --colorF: #E5D1FA;
    // }

    80% {
        --colorA: #645CBB;
        --colorC: #A084DC;
        --colorF: #BFACE2;
    }
}
</style>
