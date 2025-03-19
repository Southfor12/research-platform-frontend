<template>
  <div class="login-container">
    <div class="common-header">
      <router-link to="/">
        <img src="../../../public/imgs/logo_Institute _2.png" class="common-header__logo">
        <h1 class="common-header__title">科研公共服务平台</h1>
      </router-link>
    </div>
    <div class="title-container">
      <!-- <img src="/imgs/logo.png"> -->
      <span class="title" style="color:white;">欢迎登录科研公共服务平台</span>
    </div>
    <div class="login-form">
      <el-form v-if="!showCodeLogin" ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left">
        <el-form-item prop="mobile">
          <span class="svg-container">
            <svg-icon icon-class="mobile" />
          </span>
          <el-input ref="mobile" v-model="loginForm.mobile" placeholder="手机号" name="mobile" type="text" tabindex="1"
            clearable auto-complete="off" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="密码" name="password" tabindex="1" auto-complete="off" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div class="code-container">
          <el-form-item prop="captcha" class="code">
            <span class="svg-container">
              <svg-icon icon-class="sms" />
            </span>
            <el-input ref="captcha" v-model="loginForm.captcha" type="text" placeholder="验证码" name="captcha"
              tabindex="1" maxlength="4" clearable auto-complete="off" />
          </el-form-item>
          <img @click="queryCaptcha" :src="codeUrl" />
        </div>
      </el-form>
      <el-button :loading="loading" type="primary" style="width:100%; " @click.native.prevent="handleLogin"
        class="LoginBtn">登 录</el-button>
      <el-row>
        <el-col class="user-do" :span="12">
          <el-link type="primary" :underline="false" @click="navTo('/register')">注册</el-link>
        </el-col>
        <el-col class="user-do" :span="12">
          <el-link :underline="false" @click="navTo('reset-password')">忘记密码?</el-link>
        </el-col>
      </el-row>
    </div>
    <app-footer />
    <ul class="bg-bubbles">
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
    </ul>
  </div>
</template>

<script>
  import {
    getInfo,
    isAuditAPI
  } from '@/api/user'
  import {
    captcha
  } from '@/api/public'
  import {
    validMobile
  } from '@/utils/validate'
  import {
    AppFooter
  } from '@/layout/components'
  import SmsCodeButton from '@/components/SmsCodeButton'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'Login',
    components: {
      AppFooter,
      SmsCodeButton
    },
    computed: {
      ...mapGetters([
        'pub_key'
      ])
    },
    data() {
      const validateMobile = (rule, value, callback) => {
        if (!validMobile(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码至少6位'))
        } else {
          callback()
        }
      }
      return {
        activeName: 'passwordLogin',
        smsType: 'login',
        showCodeLogin: false,
        loginForm: {
          mobile: '',
          password: '',
          captcha: '',
          key: '',
          pub_key: ''
        },
        codeUrl: '',
        loginRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateMobile
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }],
          captcha: [{
            required: true,
            message: '请填写验证码',
            trigger: 'blur'
          }, ]
        },
        codeLoginRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateMobile
          }]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      this.queryCaptcha();
    },
    methods: {
      queryCaptcha() {
        captcha().then(res => {
          if (res.status === 200) {
            // this.codeUrl = res.data.captcha.img
            this.codeUrl = res.data.img
            this.loginForm.key = res.data.captcha.key
          }
        })
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            let key = this.loginForm.key;
            if (!key || key.length < 18) {
              this.$message.error('请重新填写验证码');
              this.queryCaptcha()
              return;
            }
            let trueCode = key[2] + '' + key[6] + '' + key[11] + '' + key[17]
            if (trueCode != this.loginForm.captcha) {
              this.$message.error('验证码错误')
              this.queryCaptcha()
              return false;
            }

            this.loading = true
            this.loginForm.pub_key = this.pub_key
            //发送登录请求的代码
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.loading = false
              getInfo().then(async (res) => {
                if (!this.redirect) {
                  this.redirect = localStorage.getItem('login-redirect');
                }
                //如果用户未通过安全考核，先进行安全考核
                this.$router.push({
                  path: this.redirect || '/'
                })
                localStorage.setItem('login-redirect', '')
                const res1 = await isAuditAPI(res.data.member.id)
                localStorage.setItem('isAudit', res1.data.isAudit)
              })
            }).catch((e) => {
              this.queryCaptcha()
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      handleClick(tab, event) {
        if (tab.name === 'passwordLogin') {
          this.showCodeLogin = false
        } else {
          this.showCodeLogin = true
        }
      }
    }
  }
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #888888;
  $cursor: #888888;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  //登录按钮
  .LoginBtn {
    background-color: #144f96 !important;
    border: 1px solid #144f96 !important;
  }

  .LoginBtn:hover {
    background-color: #103770 !important;
    border: 1px solid #103770 !important;
  }

  /* reset element-ui css */
  .login-container {

    .common-header {
      position: relative;
      z-index: 999;

      &__title {
        color: #e8e8e8;
      }

      .el-link {
        color: #e8e8e8;
      }


    }

    .el-tabs__header {
      margin-bottom: 30px !important;
    }

    .code-container {
      .code {
        display: inline-block;
        width: 180px;

        .el-input {
          width: 80%;
        }
      }

      img {
        height: 52px;
        width: 40%;
        vertical-align: middle;
      }
    }

    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      color: #e8e8e8;
    }

    .app-footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #888888;
  $light_gray: #eee;


  .login-container {
    background: #103770; //#1f81f1ab
    background: -webkit-linear-gradient(top left, #103770 0%, #144f96 100%);
    background: linear-gradient(to bottom right, #103770 0%, #144f96 100%);
    opacity: 0.8;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .login-form {
      z-index: 999;
      position: relative;
      width: 420px;
      max-width: 100%;
      padding: 50px 50px 50px;
      margin: 30px auto;
      overflow: hidden;
      background: #fff;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      margin-top: 80px;
      position: relative;
      text-align: center;
      z-index: 999;

      img {
        width: 40px;
        vertical-align: middle;
      }

      .title {
        font-size: 25px;
        color: rgba(0, 0, 0, 1);
        margin: 0px auto;
        text-align: center;
        font-weight: bold;
        line-height: 1px;
        margin-left: 5px;
        vertical-align: middle;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $bg;
      cursor: pointer;
      user-select: none;
    }

    .user-do {
      text-align: right;
      font-size: 16px;
      margin-top: 10px;
    }

    .user-do:first-child {
      text-align: left;
      color: #888888;

      .registerBtn {
        color: #888888;
      }

      .registerBtn :hover {
        color: #103770;
      }

    }

    .forgetBtn {
      color: #888888;
    }

    .forgetBtn:hover {
      color: #103770;
      text-decoration-color: #103770;
    }

    .bg-bubbles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .bg-bubbles li {
      position: absolute;
      list-style: none;
      display: block;
      width: 40px;
      height: 40px;
      background-color: #5588d4;
      bottom: -160px;
      -webkit-animation: square 25s infinite;
      animation: square 25s infinite;
      -webkit-transition-timing-function: linear;
      transition-timing-function: linear;
    }

    .bg-bubbles li:nth-child(1) {
      left: 10%;
    }

    .bg-bubbles li:nth-child(2) {
      left: 20%;
      width: 80px;
      height: 80px;
      -webkit-animation-delay: 2s;
      animation-delay: 2s;
      -webkit-animation-duration: 17s;
      animation-duration: 17s;
    }

    .bg-bubbles li:nth-child(3) {
      left: 25%;
      -webkit-animation-delay: 4s;
      animation-delay: 4s;
    }

    .bg-bubbles li:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      -webkit-animation-duration: 22s;
      animation-duration: 22s;
      background-color: rgba(1, 146, 230, 0.616);
    }

    .bg-bubbles li:nth-child(5) {
      left: 70%;
    }

    .bg-bubbles li:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      -webkit-animation-delay: 3s;
      animation-delay: 3s;
      background-color: rgba(105, 191, 248, 0.61);
    }

    .bg-bubbles li:nth-child(7) {
      left: 32%;
      width: 160px;
      height: 160px;
      -webkit-animation-delay: 7s;
      animation-delay: 7s;
    }

    .bg-bubbles li:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      -webkit-animation-delay: 15s;
      animation-delay: 15s;
      -webkit-animation-duration: 40s;
      animation-duration: 40s;
    }

    .bg-bubbles li:nth-child(9) {
      left: 25%;
      width: 10px;
      height: 10px;
      -webkit-animation-delay: 2s;
      animation-delay: 2s;
      -webkit-animation-duration: 40s;
      animation-duration: 40s;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .bg-bubbles li:nth-child(10) {
      left: 90%;
      width: 160px;
      height: 160px;
      -webkit-animation-delay: 11s;
      animation-delay: 11s;
    }

    @-webkit-keyframes square {
      0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
      }

      100% {
        -webkit-transform: translateY(-1000px) rotate(600deg);
        transform: translateY(-1000px) rotate(600deg);
      }
    }

    @keyframes square {
      0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
      }

      100% {
        -webkit-transform: translateY(-1000px) rotate(600deg);
        transform: translateY(-1000px) rotate(600deg);
      }
    }
  }
</style>

<style lang="scss">
  .login-container .el-input input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #ffffff inset !important;
  }
</style>
