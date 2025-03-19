<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="姓名" prop="user_id">
        {{ queryInfoForm.user_name }}
      </el-form-item>
      <el-form-item label="子平台/实验室" prop="platform_id">
        {{ queryInfoForm.platform_name }}
      </el-form-item>
      <el-form-item label="打分日期" prop="date">
        <el-date-picker
          v-if="!form.id"
          size="small"
          v-model="form.date"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="请选择打分日期"
        >
        </el-date-picker>
        <span v-else>{{ form.date }}</span>
      </el-form-item>
      <el-form-item label="评分项">
        <div class="question-answer" v-for="(item, index) in scoreList" :key="item.id">
          <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
          <div>
            <el-radio-group v-model="item.answer">
              <el-radio
                v-for="item1 in JSON.parse(item.items)"
                :key="item1.name"
                :label="item1.name"
                >{{ item1.name }}:{{ item1.score }}分</el-radio
              >
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  platformScoreItemList,
  platformUserInfo,
  platformScoreRecordInfo,
  addPlatformScoreRecord,
  editPlatformScoreRecord,
} from '@/api/platform';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        platform_id: '',
        user_id: '',
        date: '',
        data: [],
      },
      queryInfoForm: {
        id: '',
        is_deleted: 0,
        user_name: '',
        platform_name: '',
      },
      scoreList: [],
      rules: {
        date: [
          {
            required: true,
            message: '请选择打分日期',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  created() {
    if (this.$route.params.platform_user_id) {
      this.queryInfoForm.id = this.$route.params.platform_user_id;
      platformUserInfo(this.queryInfoForm)
        .then((res) => {
          if (res.status === 200) {
            this.form.user_id = res.data.user_id;
            this.form.platform_id = res.data.platform_id;
            this.queryInfoForm.user_name = res.data.user_name;
            this.queryInfoForm.platform_name = res.data.platform_name;
          } else {
            this.returnToList();
          }
        })
        .catch((_) => {
          this.returnToList();
        });
    }
    this.getScoreList();
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        platformScoreRecordInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.platform_id = data.platform_id;
            this.queryInfoForm.platform_name = data.platform_name;
            this.form.user_id = data.user_id;
            this.queryInfoForm.user_name = data.user_name;
            this.form.date = data.date;
            data.data.forEach((item) => {
              this.scoreList.forEach((score) => {
                if (item.score_item_id === score.id) {
                  score.answer = item.name;
                }
              });
            });
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let msg = '',
            that = this;
          this.form.data = [];
          this.scoreList.forEach((item, index) => {
            if (item.answer) {
              that.form.data.push({
                name: item.answer,
                score_item_id: item.id,
              });
            } else {
              msg += index + 1 + '，';
            }
          });
          if (msg) {
            this.$message.error('第 ' + msg.substring(0, msg.length - 1) + ' 项未打分');
            return false;
          }
          this.form.data = JSON.stringify(this.form.data);
          this.loading = true;
          if (this.form.id) {
            editPlatformScoreRecord(this.form)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addPlatformScoreRecord(this.form)
              .then((response) => {
                this.loading = false;
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    getScoreList() {
      platformScoreItemList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            item.answer = '';
            this.scoreList.push(item);
          });
          if (this.$route.params.id) {
            this.getInfo();
          }
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/platform-user/list' });
    },
  },
};
</script>
