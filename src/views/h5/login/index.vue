<template>
  <div class="login-container">
    <van-nav-bar class="login-title" title="科研公共服务平台登录" />
    <div class="form-container">
      <van-cell-group>
        <van-field
          v-model="form.mobile"
          required
          clearable
          :error-message="errorMsg.mobile"
          label="账号"
          placeholder="请输入账号"
        />
        <van-field
          v-model="form.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :error-message="errorMsg.password"
          required
        />
        <van-field
          v-model="form.captcha"
          required
          center
          clearable
          label="验证码"
          placeholder="请输入验证码"
          :error-message="errorMsg.captcha"
        >
          <van-button @click="queryCaptcha" slot="button" size="small" type="primary">
            <img :src="codeUrl" height="100%" width="100%" />
          </van-button>
        </van-field>
      </van-cell-group>
    </div>
    <div class="login-botton-container">
      <van-button @click.native.prevent="handleLogin" class="login-btn" type="info"
        >登录</van-button
      >
      <van-row>
        <van-col span="12" class="login-bottom-left"
          ><van-button @click.native.prevent="toRegister" size="normal" type="default"
            >注册</van-button
          ></van-col
        >
        <van-col span="12" class="login-bottom-right"
          ><span @click="toResetPassword">忘记密码？</span></van-col
        >
      </van-row>
    </div>
  </div>
</template>
<script>
import { getInfo } from '@/api/user';
import { captcha } from '@/api/public';
import { mapGetters } from 'vuex';
import validator from '@/utils/validator.js';
import { checkPhone } from '@/utils/validate';
import { Toast } from 'vant';

export default {
  data() {
    return {
      form: {
        mobile: '',
        password: '',
        captcha: '',
        key: '',
        pub_key: '',
      },
      codeUrl: '',
      errorMsg: {
        password: '',
        mobile: '',
        captcha: '',
      },
      rules: {
        password: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          },
          {
            required: true,
            trigger: 'blur',
            validator: checkPhone,
          },
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['member', 'pub_key']),
  },
  created() {
    // if (this.member && this.member.id) {
    //   Toast.loading({
    //     mask: true,
    //     message: '信息获取中...',
    //   });
    //   getInfo()
    //     .then((res) => {
    //       Toast.clear();
    //       if (res.status === 200) {
    //         window.location.reload();
    //         // this.$router.push({
    //         //   path: '/h5/apparatus/list'
    //         // })
    //       }
    //     })
    //     .catch(() => {
    //       Toast.clear();
    //     });
    // }
    this.queryCaptcha();
    this.validator = validator(this.rules, this.form);
  },
  methods: {
    queryCaptcha() {
      captcha().then((res) => {
        if (res.status === 200) {
          this.codeUrl = res.data.captcha.img;
          this.form.key = res.data.captcha.key;
        }
      });
    },
    handleLogin() {
      this.validate((errors, fields) => {
        let key = this.form.key;
        if (!key || key.length < 18) {
          Toast('请重新填写验证码');
          this.queryCaptcha();
          return;
        }
        let trueCode = key[2] + '' + key[6] + '' + key[11] + '' + key[17];
        if (trueCode != this.form.captcha) {
          Toast('验证码错误');
          this.queryCaptcha();
          return false;
        }

        if (!errors) {
          Toast.loading({
            mask: true,
            message: '登录中...',
          });
          this.form.pub_key = this.pub_key;
          this.$store
            .dispatch('user/login', this.form)
            .then(() => {
              Toast.success('登录成功');
              getInfo().then((res) => {
                Toast.clear();
                if (res.status === 200) {
                  this.$router.push({
                    path: '/h5/apparatus/list',
                  });
                }
              });
            })
            .catch(() => {
              Toast.clear();
              this.queryCaptcha();
            });
        }
      });
    },
    validate(callback, data) {
      this.validator.validate((errors, fields) => {
        this.resetField();
        if (errors) {
          fields.forEach((item) => {
            this.errorMsg[item.field] = item.message;
          });
        }
        callback && callback(errors, fields);
      }, data);
    },
    resetField(attrs) {
      attrs = !attrs ? Object.keys(this.errorMsg) : Array.isArray(attrs) ? attrs : [attrs];
      attrs.forEach((attr) => {
        this.errorMsg[attr] = '';
      });
    },
    toRegister() {
      this.$router.push({
        path: '/h5/register',
      });
    },
    toResetPassword() {
      this.$router.push({
        path: '/h5/reset-password',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  .login-title {
    margin-bottom: 30px;
  }

  .form-container {
    .van-button--small {
      border: none;
      padding: 0;
      margin-top: 6px;
    }
  }

  .login-botton-container {
    text-align: center;

    .login-btn {
      margin-top: 15px;
      width: 90%;
    }

    .login-bottom-left {
      padding: 10px 23px;
      display: table-column;
      text-align: left;
    }

    .login-bottom-right {
      color: #999999;
      padding: 10px 18px;
      text-align: right;
      line-height: 44px;
    }
  }
}
</style>
