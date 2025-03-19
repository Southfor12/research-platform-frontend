<template>
  <div class="home-container">
    <div v-if="hideUpdatePwd" class="home-text">
      {{ member.name }}，您是{{ member.role_name }}， 欢迎来到科研公共服务平台！
    </div>
    <el-row :gutter="15">
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="待审预约"
          :endVal="statistics.appointment"
          iconClass="appointment-icon"
          url="/apparatus-booking/list"
        />
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="实验室数"
          :endVal="statistics.platform"
          iconClass="platform-icon"
          url="/platform/list"
        />
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="用户数量"
          :endVal="statistics.users"
          iconClass="users-icon"
          url="/system/verify/list"
        />
      </el-col>
      <!-- <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel title="待审注册" :endVal="statistics.audit_user_count" iconClass="users-icon"
        url="/system/verify/list"/>
      </el-col> -->
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="仪器数量"
          :endVal="statistics.apparatus"
          iconClass="apparatus-icon"
          url="/apparatus/list"
        />
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <!-- <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel title="耗材数量" :endVal="statistics.reagent" iconClass="reagent-icon"
        url="/reagent/list"/>
      </el-col> -->
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="总预约时间"
          :endVal="statistics.during"
          iconClass="reagent-icon"
          url="/apparatus-booking/list"
        />
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="总预约次数"
          :endVal="statistics.during_count"
          iconClass="reagent-icon"
          url="/apparatus-booking/list"
        />
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="培训数量"
          :endVal="statistics.training"
          iconClass="training-icon"
          url="/train-enroll/list"
        />
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel
          title="危化品数"
          :endVal="statistics.hcs"
          iconClass="hcs-icon"
          url="/hcs/list"
        />
      </el-col>
      <!-- <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <card-panel title="待审培训" :endVal="statistics.train_user_audit" iconClass="appointment-icon"
        url="/apply-train/apply-list"/>
      </el-col> -->
    </el-row>
    <el-row :gutter="15">
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <!-- <card-panel title="新闻数量" :endVal="statistics.news" iconClass="news-icon"
        url="/news-notice/list"/> -->
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <!-- <card-panel title="培训数量" :endVal="statistics.training" iconClass="training-icon" /> -->
      </el-col>
      <el-col class="edl-detail-col" :xs="12" :sm="12" :lg="6">
        <!-- <card-panel title="新闻数量" :endVal="statistics.news" iconClass="news-icon" /> -->
      </el-col>
    </el-row>
    <el-card>
      <div slot="header" class="clearfix">
        <span>今日统计</span>
      </div>
      <el-row :gutter="15">
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          新增注册：{{ statistics.register }}
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          入室申请：{{ statistics.apply }}
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          培训报名：{{ statistics.enroll }}
        </el-col>
        <el-col class="edl-detail-col bottom-10" :xs="12" :sm="12" :lg="6">
          申请采购：{{ statistics.chemical }}
        </el-col>
      </el-row>
    </el-card>
    <div class="home-action">
      <el-button v-if="false" @click="hideUpdatePwd = false">修改密码</el-button>
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
import CardPanel from '@/components/CardPanel';
import { platformList } from '@/api/platform';
import { apparatusList, bookingList } from '@/api/apparatus';
import { reagentList } from '@/api/reagent';
import { hcsList } from '@/api/hcs';
import { trainList } from '@/api/train';
import { newsList } from '@/api/news';
import { statistics } from '@/api/public';
import { checkPassword, updatePassword, userList } from '@/api/user';

export default {
  name: 'Home',
  components: {
    CardPanel,
  },
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
      statistics: {
        appointment: 0,
        apparatus: 0,
        platform: 0,
        users: 0,
        reagent: 0,
        hcs: 0,
        training: 0,
        news: 0,
        register: 0,
        apply: 0,
        enroll: 0,
        chemical: 0,
        during: 0,
        during_count: 0,
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
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
          // { pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}$/, message: '必须包含含数字、字母、特殊符号', trigger: 'blur' }
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
  created() {
    userList({
      page: 1,
      size: 1,
      status: 1,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.users = res.data.total;
      }
    });
    platformList({
      page: 1,
      size: 1,
      type: 2,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.platform = res.data.total;
      }
    });
    bookingList({
      page: 1,
      size: 1,
      status: 0,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.appointment = res.data.total;
      }
    });
    apparatusList({
      page: 1,
      size: 1,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.apparatus = res.data.total;
      }
    });
    reagentList({
      page: 1,
      size: 1,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.reagent = res.data.total;
      }
    });
    hcsList({
      page: 1,
      size: 1,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.hcs = res.data.total;
      }
    });
    trainList({
      page: 1,
      size: 1,
      permanent: 0,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.training = res.data.total;
      }
    });
    newsList({
      page: 1,
      size: 1,
      type: 3,
    }).then((res) => {
      if (res.status === 200) {
        this.statistics.news = res.data.total;
      }
    });
    statistics().then((res) => {
      if (res.status === 200) {
        this.statistics.register = res.data.register_user_count;
        this.statistics.apply = res.data.platform_apply_count;
        this.statistics.enroll = res.data.train_user_count;
        this.statistics.chemical = res.data.chemical_order_count;
        this.statistics.train_user_audit = res.data.train_user_audit;
        this.statistics.audit_user_count = res.data.audit_user_count;
        this.statistics.during = res.data.during;
        this.statistics.during_count = res.data.during_count;
        this.$forceUpdate();
      }
    });
  },
  methods: {
    submitForm(updatePwdForm) {
      this.$refs[updatePwdForm].validate((valid) => {
        if (valid) {
          if (this.step === 1) {
            checkPassword(this.updatePwdForm).then((response) => {
              if (response.status === 200) {
                this.step++;
                this.active++;
              }
            });
          } else if (this.step === 2) {
            updatePassword(this.updatePwdForm).then((response) => {
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
    ...mapGetters(['member']),
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
    margin-bottom: 15px;
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
