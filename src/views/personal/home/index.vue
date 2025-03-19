<template>
  <div class="home-container">
    <!-- <div v-if="hideUpdatePwd" class="home-text">{{ member.name }}， 欢迎来到科研公共服务平台！</div> -->
    <div class="home-action">
      <el-button v-if="hideUpdatePwd" @click="hideUpdatePwd = false">修改密码</el-button>
      <div v-if="!hideUpdatePwd">
        <el-steps :active="active" finish-status="success" class="up-step">
          <el-step title="输入旧密码" />
          <el-step title="输入新密码" />
          <el-step title="完成" />
        </el-steps>
        <el-form
          v-if="step != 3"
          ref="updatePwdForm"
          :model="updatePwdForm"
          :rules="rules"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item v-if="step == 1" label="旧密码" prop="oldPassword">
            <el-input
              v-model="updatePwdForm.oldPassword"
              size="small"
              show-password
              clearable
              class="max-width-200"
            />
          </el-form-item>
          <el-form-item v-if="step == 2" label="新密码" prop="newPassword">
            <el-input
              v-model="updatePwdForm.newPassword"
              size="small"
              show-password
              clearable
              class="max-width-200"
            />
          </el-form-item>
          <el-form-item v-if="step == 2" label="确认密码" prop="reNewPassword">
            <el-input
              v-model="updatePwdForm.reNewPassword"
              size="small"
              show-password
              clearable
              class="max-width-200"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('updatePwdForm')"
              >提 交</el-button
            >
            <el-button size="small" @click="returnBack">取 消</el-button>
          </el-form-item>
        </el-form>
        <el-button v-if="step == 3" @click="returnBack">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { checkPassword, updatePassword } from '@/api/user';
import { aesEncrypt, rsaEncrypt, aesRandomKey } from '@/utils/encrypt';
import sha256 from 'js-sha256';

export default {
  name: 'Home',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.updatePwdForm.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      hideUpdatePwd: true,
      active: 0,
      step: 1,
      updatePwdForm: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
          },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/,
            message: '密码必须由大小写字母、数字、特殊字符组成的8-16字符组成',
            trigger: 'blur',
          },
        ],
        reNewPassword: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    submitForm(updatePwdForm) {
      this.$refs[updatePwdForm].validate((valid) => {
        if (valid) {
          var form = {
            oldPassword: this.encrypt(this.updatePwdForm.oldPassword),
            newPassword: this.encrypt(this.updatePwdForm.newPassword),
            reNewPassword: this.encrypt(this.updatePwdForm.reNewPassword),
          };
          if (this.step === 1) {
            checkPassword(form).then((response) => {
              if (response.status === 200) {
                this.step++;
                this.active++;
              }
            });
          } else if (this.step === 2) {
            updatePassword(form).then((response) => {
              if (response.status == 1) {
                this.step++;
                this.active++;
                this.active++;
              }
            });
          }
        }
      });
    },
    returnBack() {
      this.step = 1;
      this.active = 0;
      this.hideUpdatePwd = true;
      this.updatePwdForm.oldPassword = '';
      this.updatePwdForm.newPassword = '';
      this.updatePwdForm.reNewPassword = '';
    },
  },
  computed: {
    ...mapGetters(['member', 'pub_key']),
  },
};
</script>
<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    color: #006699;
    font-size: 18px;
    font-weight: 600;
    line-height: 46px;
  }
  &-action {
    margin-top: 15px;
    max-width: 800px;
  }
}
.up-step {
  margin: 50px 0 30px;
}
</style>
