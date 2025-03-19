<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="名称" prop="name">
        <el-input size="small" class="max-width-200" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="仪器" prop="apparatus_id">
        <el-select
          v-if="!form.id"
          v-model="form.apparatus_id"
          size="small"
          clearable
          class="max-width-200"
          filterable
          @change="apparatusChange"
          placeholder="请选择仪器"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.apparatus_name }}</span>
      </el-form-item>
      <el-form-item v-if="form.apparatus_id" label="题目" prop="ids">
        <!-- <el-select
                    v-model="form.ids"
                    multiple
                    filterable
                    reserve-keyword
                    size="small"
                    style="width: 100%"
                    @change="examQuestionChange"
                    placeholder="请选择添加题目">
                    <el-option
                        v-for="item in examQuestions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select> -->
        <el-checkbox-group v-model="form.ids" @change="examQuestionChange">
          <el-checkbox v-for="(item, index) in examQuestions" :key="index" :label="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
        <span v-if="examQuestions.length === 0">暂无该仪器题目</span>
      </el-form-item>
      <el-form-item label="当前总分" prop="pass_score"> {{ totalScore }} 分 </el-form-item>
      <el-form-item label="合格分数" prop="pass_score">
        <el-input type="number" v-model="form.pass_score" size="small" class="max-width-200" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { examInfo, addExam, editExam, examQuestionList } from '@/api/security';
import { frontApparatusList, apparatusInfo } from '@/api/apparatus';
import { platformList, platformInfo } from '@/api/platform';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        ids: [],
        exam_question_ids: '',
        pass_score: '',
        platform_id: '',
        apparatus_id: '',
        apparatus_name: '',
      },
      pertainTo: '',
      currentIds: [],
      totalScore: 0,
      examQuestions: [],
      searchExamQuestionForm: {
        page: 1,
        size: 1000,
        is_deleted: 0,
        apparatus_id: '',
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 100,
        is_deleted: 0,
        name: '',
      },
      searchApparatusForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        is_admin: 1,
        platform_id: '',
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        pass_score: [
          {
            required: true,
            message: '请输入合格分数',
            trigger: 'blur',
          },
        ],
        ids: [
          {
            required: true,
            message: '请选择题目',
            trigger: 'change',
          },
        ],
        apparatus_id: [
          {
            required: true,
            message: '请选择仪器',
            trigger: 'change',
          },
        ],
      },
      platforms: [],
      apparatus: [],
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.getApparatus();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        examInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.score = data.score;
            this.form.pass_score = data.pass_score;
            this.form.platform_id = data.platform_id;
            this.form.apparatus_id = data.apparatus_id;
            this.form.exam_question_ids = data.exam_question_ids;
            data.exam_question_ids.split(',').forEach((id) => {
              this.form.ids.push(parseInt(id));
            });
            this.getExamQuestions(this.form.apparatus_id);
            // this.examQuestionChange()
            this.getApparatus();
          }
        });
      } else {
        this.returnToList();
      }
    },
    apparatusChange(value) {
      this.examQuestions = [];
      if (value) {
        this.getExamQuestions(value);
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.pass_score = parseInt(this.form.pass_score);
          if (this.form.pass_score <= 0 || this.form.pass_score > this.totalScore) {
            this.$message.error('分值在0-' + this.totalScore + '之间');
            return false;
          }
          this.form.exam_question_ids = this.form.ids.join(',');
          this.loading = true;
          if (this.form.id) {
            editExam(this.form)
              .then((response) => {
                this.loading = false;
                // this.form.platform_id = this.form.platform_id === '0' ? '' : this.form.platform_id
                // this.form.apparatus_id = this.form.apparatus_id === '0' ? '' : this.form.apparatus_id
                if (response.status === 1) {
                  this.returnToList();
                }
              })
              .catch((error) => {
                this.loading = false;
              });
          } else {
            addExam(this.form)
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
    examQuestionChange() {
      if (this.form.ids.length > 0) {
        this.form.exam_question_ids = this.form.ids.join(',');
        this.getTotal();
        // examQuestionList({ page: 1, size: this.form.ids.length, ids: this.form.exam_question_ids }).then(res => {
        //     if (res.status === 200) {
        //         this.totalScore = 0
        //         this.examQuestions = res.data.data
        //         res.data.data.forEach(item => {
        //             this.totalScore += item.score
        //         })
        //     }
        // })
      } else {
        this.totalScore = 0;
      }
    },
    platFormChange() {
      // this.searchApparatusForm.platform_id = this.form.platform_id
      // this.form.apparatus_id = ''
      // this.apparatus = []
    },
    getExamQuestions(id) {
      this.searchExamQuestionForm.apparatus_id = id;
      examQuestionList(this.searchExamQuestionForm).then((res) => {
        if (res.status === 200) {
          this.examQuestions = res.data.data;
          this.getTotal();
        }
      });
    },
    getTotal() {
      this.totalScore = 0;
      this.examQuestions.forEach((item) => {
        if (this.form.ids.indexOf(item.id) !== -1) {
          this.totalScore += item.score;
        }
      });
    },
    getPlatforms(query = '') {
      this.searchPlatformForm.name = query;
      platformList(this.searchPlatformForm).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    getApparatus(query = '') {
      this.searchApparatusForm.name = query;
      frontApparatusList(this.searchApparatusForm).then((res) => {
        if (res.status === 200) {
          this.apparatus = res.data.data;
          this.apparatus.forEach((item) => {
            if (item.id === this.form.apparatus_id) {
              this.form.apparatus_name = item.name;
            }
          });
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/exam/list' });
    },
  },
};
</script>
<style lang="scss">
.tips {
  font-size: 12px;
  color: #888888;
}
</style>
