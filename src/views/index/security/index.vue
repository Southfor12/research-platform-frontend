<template>
  <div>
    <el-steps class="step" :active="active" finish-status="success">
      <el-step title="了解规章制度"></el-step>
      <el-step title="学习相关资料"></el-step>
      <el-step title="参加考试"></el-step>
    </el-steps>
    <div v-show="active === 0">
      <!-- 规章制度 -->
      <el-table :data="regulationsList" border style="width: 100%">
        <el-table-column type="index" :index="indexDdMethod" label="序号" width="50" />
        <el-table-column prop="name" label="标题">
          <template slot-scope="scope">
            <a href="#" @click="navOpen('/regulations/detail/' + scope.row.id)">{{
              scope.row.name
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
        </el-table-column>
        <div slot="empty">
          <empty />
        </div>
      </el-table>
      <el-pagination
        class="dl-pagination"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next, jumper"
        :total="regulationsTotal"
        :current-page="regulationsQueryForm.page"
        :page-size="regulationsQueryForm.size"
        @current-change="regulationsCurrentChange"
      />
    </div>
    <div v-show="active === 1">
      <el-table :data="learningList" border style="width: 100%">
        <el-table-column type="index" :index="indexDdMethod1" label="序号" width="50" />
        <el-table-column label="标题">
          <template slot-scope="scope">
            <a href="#" @click="navOpen('/learning/detail/' + scope.row.id)">{{
              scope.row.name
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1">在线文档资料</el-tag>
            <el-tag v-else-if="scope.row.type == 2">视频资料</el-tag>
            <el-tag v-else>下载资料</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template slot-scope="scope">{{ getDate(scope.row.created_at) }}</template>
        </el-table-column>
        <div slot="empty">
          <empty />
        </div>
      </el-table>
      <el-pagination
        class="dl-pagination"
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next, jumper"
        :total="learningTotal"
        :current-page="learningQueryForm.page"
        :page-size="learningQueryForm.size"
        @current-change="learningCurrentChange"
      />
    </div>
    <!-- 参加考试 -->
    <div
      v-if="active === 2"
      v-loading="loading"
      element-loading-text="提交中..."
      element-loading-spinner="el-icon-loading"
    >
      <div v-if="!member.id" style="padding: 30px 100px; text-align: center">
        <el-button type="primary" @click="toLogin">请先登录</el-button>
      </div>
      <div v-else>
        <div v-if="member.is_trained" style="padding: 30px 100px">
          <el-alert
            title="恭喜你已经通过考试, 请等待管理员审核"
            :closable="false"
            show-icon
            center
            effect="dark"
            type="success"
          >
          </el-alert>
        </div>
        <div v-else>
          <div v-if="judgmentList.length > 0" class="question-type">一、判断题</div>
          <div v-for="(item, index) in judgmentList" :key="item.id">
            <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
            <div class="question-answer">
              <el-radio v-model="item.answer" label="1">正确</el-radio>
              <el-radio v-model="item.answer" label="0">错误</el-radio>
            </div>
          </div>
          <div v-if="choiceList.length > 0" class="question-type">二、选择题</div>
          <div class="question-answer" v-for="(item, index) in choiceList" :key="item.id">
            <div class="question-title">{{ index + 1 }}. {{ item.name }}</div>
            <div>
              <el-checkbox-group v-model="item.answer">
                <el-checkbox
                  v-for="item1 in item.items"
                  v-show="item1.content"
                  :key="item1.name"
                  :label="item1.name"
                  >{{ item1.name }}. {{ item1.content }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <el-button @click="submit" class="step-botton" size="small" type="primary"
            >提交</el-button
          >
        </div>
      </div>
    </div>
    <el-button v-if="active !== 0 && active !== 2" @click="preStep" class="step-botton" round
      >上一步</el-button
    >
    <el-button v-if="active !== 2" @click="nextStep" class="step-botton" round>下一步</el-button>
  </div>
</template>

<script>
import { newsList } from '@/api/news';
import { trainDocList, examInfo, examSubmit } from '@/api/security';
import Empty from '@/components/Empty';
import { mapGetters } from 'vuex';

export default {
  components: {
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      active: 0,
      choiceList: [],
      judgmentList: [],
      loading: false,
      regulationsQueryForm: {
        page: 1,
        size: 10,
        // type:1,
        types: '1,13,14,15,20',
        platform_id: '0',
        sort: 'created_at',
        is_deleted: 0,
        sort_type: 'desc',
      },
      learningQueryForm: {
        page: 1,
        size: 10,
        is_deleted: 0,
        is_published: 1,
        sort: 'created_at',
        sort_type: 'desc',
      },
      submitForm: {
        exam_id: '',
        answers: [],
      },
      regulationsList: [],
      learningList: [],
      regulationsTotal: 0,
      learningTotal: 0,
    };
  },
  created() {
    this.queryNewsList();
    this.queryLearningList();
    examInfo({
      platform_id: 0,
      apparatus_id: 0,
    }).then((res) => {
      if (res.status === 200) {
        var that = this;
        this.submitForm.exam_id = res.data.id;
        res.data.questions.forEach((item) => {
          if (item.type === 1 || item.type == 3) {
            item.answer = [];
            that.choiceList.push(item);
          } else if (item.type === 2) {
            item.answer = '';
            that.judgmentList.push(item);
          }
        });
      }
    });
  },
  methods: {
    queryNewsList() {
      newsList(this.regulationsQueryForm).then((res) => {
        if (res.status === 200) {
          this.regulationsList = res.data.data;
          this.regulationsTotal = res.data.total;
        }
      });
    },
    queryLearningList() {
      trainDocList(this.learningQueryForm).then((res) => {
        if (res.status === 200) {
          this.learningList = res.data.data;
          this.learningTotal = res.data.total;
        }
      });
    },
    submit() {
      let msg = '',
        checkPass = true,
        that = this;
      this.submitForm.answers = [];
      this.judgmentList.forEach((item, index) => {
        that.submitForm.answers.push({
          question_id: item.id,
          answer: item.answer,
        });
        if (!item.answer) msg += index + 1 + '，';
      });
      if (msg) {
        checkPass = false;
        this.$message.error('判断题第' + msg.slice(0, msg.length - 1) + '题未作答');
      }
      msg = '';
      this.choiceList.forEach((item, index) => {
        that.submitForm.answers.push({
          question_id: item.id,
          answer: item.answer.join(','),
        });
        if (item.answer.length === 0) msg += index + 1 + '，';
      });
      if (msg) {
        if (checkPass) {
          checkPass = false;
          that.$message.error('选择题第' + msg.slice(0, msg.length - 1) + '题未作答');
        } else {
          setTimeout(function () {
            that.$message.error('选择题第' + msg.slice(0, msg.length - 1) + '题未作答');
          }, 500);
        }
      }
      if (!checkPass) return false;
      this.submitForm.answers = JSON.stringify(this.submitForm.answers);
      this.loading = true;
      examSubmit(this.submitForm)
        .then((res) => {
          var that = this;
          this.loading = false;
          if (res.status === 1) {
            this.member.is_trained = true;
          } else if (res.status === 200) {
            that
              .$confirm(res.msg + '，是否重新开始考试？', '提示', {
                confirmButtonText: '重新考试',
                cancelButtonText: '去复习',
                type: 'warning',
              })
              .then(() => {
                that.choiceList.forEach((item) => {
                  item.answer = [];
                });
                that.judgmentList.forEach((item) => {
                  item.answer = '';
                });
                that.submitForm.answers = [];
              })
              .catch(() => {
                this.active = 0;
              });
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    toLogin() {
      this.$router.push({
        path: '/',
      });
    },
    regulationsCurrentChange(val) {
      this.regulationsQueryForm.page = val;
      this.queryNewsList();
    },
    learningCurrentChange(val) {
      this.learningQueryForm.page = val;
      this.queryLearningList();
    },
    preStep() {
      this.active--;
    },
    nextStep() {
      this.active++;
    },
    indexDdMethod(index) {
      return index + (this.regulationsQueryForm.page - 1) * this.regulationsQueryForm.size + 1;
    },
    indexDdMethod1(index) {
      return index + (this.learningQueryForm.page - 1) * this.learningQueryForm.size + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.step {
  margin: 10px 0 20px;
}

.step-botton {
  margin-top: 20px;
}
</style>
