<template>
  <div class="register-container">
    <van-nav-bar
      title="科研公共服务平台"
      left-text="返回"
      left-arrow
      @click-left="toLogin"
    />
    <div class="register-form-container">
      <div class="register-form-title">重置密码</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
            ref="code"
            v-model="form.code"
            type="text"
            placeholder="验证码"
            name="code"
            tabindex="1"
            maxlength="6"
            clearable
            auto-complete="off"
            class="max-width-100"
          />
          <sms-code-button :mobile="form.mobile" :type="smsType" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" placeholder="确认密码" v-model="form.rePassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            :loading="loading"
            type="primary"
            @click.native.prevent="onSubmit"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { resetPassword } from '@/api/public';
import { validMobile } from '@/utils/validate';
import sha256 from 'js-sha256';
import SmsCodeButton from '@/components/SmsCodeButton';

export default {
  components: {
    SmsCodeButton,
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      platforms: [],
      platformForm: {
        page: 1,
        size: 100,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: '0',
      },
      form: {
        mobile: '',
        password: '',
        rePassword: '',
        code: '',
      },
      smsType: '3',
      rules: {
        mobile: [
          {
            required: true,
            trigger: 'blur',
            validator: validateMobile,
          },
        ],
        code: [
          {
            required: true,
            message: '请填写验证码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 6,
            message: '请正确填写6位验证码',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/,
            message: '密码必须由大小写字母、数字、特殊字符组成的8-16字符组成',
            trigger: 'blur',
          },
        ],
        rePassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur',
          },
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword,
          },
        ],
      },
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          resetPassword({
            mobile: this.form.mobile,
            password: sha256(this.form.password),
            rePassword: sha256(this.form.rePassword),
            code: this.form.code,
          })
            .then((res) => {
              this.loading = false;
              if (res.status === 1) {
                this.toLogin();
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    toLogin() {
      this.$router.push({
        path: '/h5/login',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
body {
  background: #f6f6f6;
}

.register-container {
  width: 100%;
  background: #f6f6f6;

  .register-form-container {
    max-width: 1000px;
    background: #ffffff;
    margin: 30px auto;
    padding: 0.5rem 0;

    .register-form-title {
      width: 100%;
      height: 6rem;
      line-height: 6rem;
      text-align: center;
      font-size: 30px;
      color: #373d41;
    }

    .el-form {
      max-width: 360px;
      margin: 0 auto;
    }
  }
}
</style>
