<template>
  <div>
    <div class="news-title">{{ trainInfo.name }}</div>
    <div class="news-time">发布时间： {{ getDate(trainInfo.created_at) }}</div>
    <div class="news-content">
      <div><strong>一、培训时间</strong></div>
      <div class="train-content">长期</div>
      <div><strong>二、培训地点</strong></div>
      <div class="train-content">{{ trainInfo.address }}</div>
      <div><strong>三、归属</strong></div>
      <div class="train-content">{{ trainInfo.platform_name }}</div>
      <div><strong>四、负责人</strong></div>
      <div class="train-content">{{ trainInfo.leader_name }} {{ trainInfo.leader_mobile }}</div>
      <div><strong>五、培训目的</strong></div>
      <div class="train-content">{{ trainInfo.purpose }}</div>
      <div><strong>六、实验计划及方案</strong></div>
      <div class="train-content">{{ trainInfo.content }}</div>
      <div><strong>七、最大报名人数</strong></div>
      <div class="train-content">不限制</div>
      <div><strong>八、培训费用</strong></div>
      <div class="train-content">
        {{ trainInfo.charge ? trainInfo.charge + '元' : '免费' }}
      </div>
      <div v-if="trainInfo.external_charge > 0 || trainInfo.charge > 0 || trainInfo.config">
        <strong>九、是否可以取消申请</strong>
      </div>
      <div
        v-if="trainInfo.external_charge > 0 || trainInfo.charge > 0 || trainInfo.config"
        class="train-content"
      >
        {{ trainInfo.can_cancel ? '是' : '否' }}
      </div>
    </div>
    <div v-if="member.id">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item v-if="trainInfo.type === 1" label="培训项目" prop="items">
          <el-checkbox-group class="apparatus-project" v-model="form.checked">
            <el-checkbox
              v-for="(item, index) in JSON.parse(trainInfo.config)"
              :key="index"
              :label="item.title"
            >
              {{ item.title }}（院内用户{{ item.charge }}元，院外用户{{ item.external_charge }}元）
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="期望培训时间" prop="train_time">
          <el-date-picker
            size="small"
            style="width: 150px"
            v-model="form.train_time"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择期望培训时间"
          />
        </el-form-item>
        <el-form-item v-if="trainInfo.type === 1" label="预计使用仪器时间" prop="use_time">
          <el-date-picker
            size="small"
            style="width: 150px"
            v-model="form.use_time"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择预计使用仪器时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款账号" prop="research_group_account_id">
          <el-select
            v-model="form.research_group_account_id"
            size="small"
            clearable
            class="max-width-300"
            filterable
            reserve-keyword
            placeholder="请选择付款账号"
          >
            <el-option
              v-for="item in accounts"
              :key="item.research_group_account_id"
              :label="item.research_group_account_name"
              :value="item.research_group_account_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submit('form')">申请培训</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: right">
      <el-button round @click="back">返回</el-button>
    </div>
    <div v-if="!member.id" style="padding: 30px 100px; text-align: center">
      <el-button type="primary" size="small" @click="toLogin">请先登录</el-button>
    </div>
  </div>
</template>
<script>
import { trainInfo, trainApply } from '@/api/train';
import { researchGroupAccountAuthList } from '@/api/research';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      trainInfo: {},
      accounts: [],
      form: {
        train_id: '',
        train_time: '',
        use_time: '',
        research_group_account_id: '',
        checked: [],
        config: '',
      },
      rules: {
        research_group_account_id: [
          {
            required: true,
            message: '请选择付款账号',
            trigger: 'change',
          },
        ],
        train_time: [
          {
            required: true,
            message: '请选择期望培训时间',
            trigger: 'change',
          },
        ],
        use_time: [
          {
            required: true,
            message: '请选择预计使用仪器时间',
            trigger: 'change',
          },
        ],
        checked: [
          {
            required: true,
            message: '请选择培训项目',
            trigger: 'change',
          },
        ],
      },
      queryAccountForm: {
        page: 1,
        size: 100,
        user_id: '',
        is_deleted: 0,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
    };
  },
  created() {
    if (this.member.id) {
      this.queryAccountForm.user_id = this.member.id;
    }
    this.getInfo();
  },
  methods: {
    back() {
      this.$router.back();
    },
    getInfo() {
      if (this.$route.params.id) {
        trainInfo({
          id: this.$route.params.id,
          is_published: 1,
          is_deleted: 0,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            this.getAccounts();
            this.form.train_id = response.data.id;
            this.trainInfo = response.data;
          }
        });
      } else {
        this.returnToList();
      }
    },
    getAccounts() {
      researchGroupAccountAuthList(this.queryAccountForm).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
        }
      });
    },
    submit(form) {
      if (!this.checkAudit('报名参加培训')) {
        return;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.config = {
            train_id: this.form.train_id,
            train_time: this.form.train_time,
          };
          if (this.trainInfo.type === 1) {
            this.form.config.items = this.form.checked.map((title) => {
              return {
                title,
              };
            });
            this.form.config.use_time = this.form.use_time;
          }
          this.form.config = JSON.stringify(this.form.config);
          trainApply(this.form).then((res) => {
            if (res.status === 1) {
              setTimeout(function () {
                window.location.reload();
              }, 1500);
            }
          });
        } else {
          return false;
        }
      });
    },
    toLogin() {
      this.$router.push({
        path: '/',
      });
    },
    returnToList() {
      this.$router.push({
        path: '/instrument-training',
      });
    },
  },
};
</script>
<style lang="scss">
.news-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.news-time {
  text-align: center;
  font-size: 12px;
  color: gray;
  margin: 15px 0 20px;
}

.news-content {
  padding: 0 10px;
  min-height: 300px;
  border-bottom: 1px solid #efefef;
  margin-bottom: 30px;
}

.download {
  width: auto;
  text-align: center;
}

.download-title {
  font-weight: bold;
}

.train-content {
  margin: 18px 0;
  text-indent: 30px;
  font-size: 14px;
}
</style>
