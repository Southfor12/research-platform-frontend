<template>
  <div>
    <div class="news-title">{{ trainInfo.name }}</div>
    <div class="news-time">发布时间： {{ getDate(trainInfo.created_at) }}</div>
    <div class="news-content">
      <div><strong>一、培训时间</strong></div>
      <div class="train-content">{{ trainInfo.start_time }} - {{ trainInfo.end_time }}</div>
      <div><strong>二、培训地点</strong></div>
      <div class="train-content">{{ trainInfo.address }}</div>
      <div><strong>三、归属</strong></div>
      <div class="train-content">{{ trainInfo.platform_name }}</div>
      <div><strong>四、负责人</strong></div>
      <div class="train-content">{{ trainInfo.leader_name }} {{ trainInfo.leader_mobile }}</div>
      <div><strong>五、培训目的</strong></div>
      <div class="train-content" v-html="trainInfo.purpose"></div>
      <div><strong>六、实验计划及方案</strong></div>
      <div class="train-content" v-html="trainInfo.content"></div>
      <div><strong>七、最大报名人数</strong></div>
      <div class="train-content">{{ trainInfo.max_people + '人' }}</div>
      <div><strong>八、培训费用</strong></div>
      <div class="train-content">
        {{ trainInfo.charge ? trainInfo.charge + '元' : '免费' }}
      </div>
      <div v-if="trainInfo.external_charge > 0 || trainInfo.charge > 0">
        <strong>九、是否可以取消报名</strong>
      </div>
      <div v-if="trainInfo.external_charge > 0 || trainInfo.charge > 0" class="train-content">
        {{ trainInfo.can_cancel ? '是' : '否' }}
      </div>
    </div>
    <div v-if="member.id">
      <el-form
        v-if="new Date() < new Date(trainInfo.start_time)"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
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
          <el-button type="primary" size="small" @click="submit('form')">报名</el-button>
        </el-form-item>
      </el-form>
      <span v-else>培训报名已结束</span>
    </div>
    <div style="text-align: right">
      <el-button round @click="back">返回</el-button>
    </div>
    <div v-if="!member.id" style="padding: 30px 100px; text-align: center">
      <el-button type="primary" @click="toLogin">请先登录</el-button>
    </div>
  </div>
</template>
<script>
import { trainInfo, trainEnroll } from '@/api/train';
import { researchGroupAccountAuthIndexFrontList } from '@/api/research';
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
        research_group_account_id: '',
      },
      rules: {
        research_group_account_id: [
          {
            required: true,
            message: '请选择付款账号',
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
      researchGroupAccountAuthIndexFrontList(this.queryAccountForm).then((res) => {
        if (res.status === 200) {
          this.accounts = res.data.data;
        }
      });
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          trainEnroll(this.form).then((res) => {
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
