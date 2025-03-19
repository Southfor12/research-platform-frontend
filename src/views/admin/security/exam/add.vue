<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="试卷名称" prop="name">
        <el-input size="small" class="width-200" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-select :disabled="form.id>0" v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子平台/实验室">
        <el-select :disabled="form.id > 0" v-model="form.platform_id" size="small" class="width-200"
          @change="platFormChange" placeholder="请选择子平台/实验室">
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span class="tips" v-if="form.id == 0">不选择子平台/实验室，默认为平台题组</span>
      </el-form-item>
      <el-form-item label="仪器" prop="apparatus_id">
        <el-select v-model="form.apparatus_id" size="small" clearable class="width-200" @change="apparatusChange"
          placeholder="请选择仪器" :disabled="form.id > 0">
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目" prop="ids">
        <el-checkbox-group v-model="form.ids" @change="examQuestionChange">
          <el-checkbox v-for="(item, index) in examQuestions" :key="index" :label="item.id">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <span v-if="examQuestions.length === 0">暂无该类型题目</span>
      </el-form-item>
      <el-form-item label="当前总分" prop="pass_score"> {{ totalScore }} 分 </el-form-item>
      <el-form-item label="合格分数" prop="pass_score">
        <el-input type="number" v-model="form.pass_score" size="small" class="width-200" />
      </el-form-item>
      <el-form-item v-if="form.id" label="归属">
        {{ pertainTo }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    examInfo,
    addExam,
    editExam,
    examQuestionList
  } from '@/api/security';
  import {
    apparatusList,
    apparatusInfo
  } from '@/api/apparatus';
  import {
    platformList,
    platformInfo
  } from '@/api/platform';

  export default {
    data() {
      return {
        loading: false,
        form: {
          id: 0,
          name: '',
          ids: [],
          exam_question_ids: '',
          pass_score: '',
          platform_id: 0,
          apparatus_id: 0,
          factory_id: '',
        },
        pertainTo: '',
        currentIds: [],
        totalScore: 0,
        examQuestions: [],
        searchExamQuestionForm: {
          page: 1,
          size: 1000,
          apparatus_id: '',
          platform_id: 0,
          is_deleted: 0,
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
          platform_id: '',
          name: '',
        },
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          }, ],
          pass_score: [{
            required: true,
            message: '请输入合格分数',
            trigger: 'blur',
          }, ],
          ids: [{
            required: true,
            message: '请选择题目',
            trigger: 'change',
          }, ],
        },
        platforms: [],
        apparatus: [],
      };
    },
    created() {
      this.form.factory_id = this.currentFactoryId;
      if (this.$route.params.id) {
        this.getInfo();
      } else {
        this.getExamQuestions();
        this.getPlatforms();
        this.getApparatus();
      }
    },
    methods: {
      getInfo() {
        this.form.id = this.$route.params.id;
        if (this.form.id) {
          examInfo({
            id: this.form.id,
          }).then((response) => {
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
              this.form.factory_id = data.factory_id;

              data.exam_question_ids.split(',').forEach((id) => {
                this.form.ids.push(parseInt(id));
              });
              this.platforms.push({
                id: 0,
                name: '平台',
              });
              this.pertainTo = '平台';
              if (this.form.platform_id) {
                platformInfo({
                  platform_id: this.form.platform_id,
                }).then((res) => {
                  if (res.status === 200) {
                    this.pertainTo = res.data.name + '(子平台/实验室)';
                    this.platforms.push(res.data);
                  }
                });
              }
              if (this.form.apparatus_id) {
                apparatusInfo({
                  id: this.form.apparatus_id,
                }).then((res) => {
                  if (res.status === 200) {
                    this.pertainTo = res.data.name + '(仪器)';
                  }
                  this.apparatus.push(res.data);
                });
              }

              this.searchExamQuestionForm.platform_id = this.form.platform_id;
              this.searchExamQuestionForm.apparatus_id = this.form.apparatus_id;

              this.getExamQuestions();
            }
          });
        } else {
          this.returnToList();
        }
      },
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.form.pass_score = parseInt(this.form.pass_score);
            if (this.form.pass_score < 0 || this.form.pass_score > this.totalScore) {
              this.$message.error('分值在0-' + this.totalScore + '之间');
              return false;
            }
            if (this.form.apparatus_id) this.form.platform_id = 0;
            let ids = [];
            let validExamIds = this.examQuestions.map((exam) => exam.id);
            this.form.ids.forEach((id) => {
              if (validExamIds.indexOf(id) !== -1) {
                ids.push(id);
              }
            });
            ids.sort();
            this.form.exam_question_ids = ids.join(',');

            this.loading = true;
            if (this.form.id) {
              editExam(this.form)
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
              addExam(this.form)
                .then((response) => {
                  this.loading = false;
                  if (response.status === 1) {
                    this.returnToList();
                  } else {
                    this.form = {
                      id: '',
                      name: '',
                      ids: [],
                      exam_question_ids: '',
                      pass_score: '',
                      platform_id: '',
                      apparatus_id: '',
                    };
                    this.totalScore = 0;
                    this.searchExamQuestionForm.apparatus_id = 0;
                    this.getExamQuestions();
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
          this.countExamTotalScore();
        } else {
          this.totalScore = 0;
        }
      },
      platFormChange() {
        this.examQuestions = [];
        this.form.apparatus_id = '';
        this.apparatus = [];
        this.searchApparatusForm.platform_id = this.form.platform_id;
        this.getApparatus();

        this.searchExamQuestionForm.platform_id = this.form.platform_id;
        this.searchExamQuestionForm.apparatus_id = '';

        this.getExamQuestions();
      },
      apparatusChange() {
        this.searchExamQuestionForm.apparatus_id = this.form.apparatus_id;
        this.getExamQuestions();
      },
      getExamQuestions() {
        examQuestionList(this.searchExamQuestionForm).then((res) => {
          if (res.status === 200) {
            this.examQuestions = res.data.data;
            this.apparatus.forEach((item) => {
              if (item.id === this.form.apparatus_id) {
                this.form.apparatus_name = item.name;
              }
            });
            this.countExamTotalScore();
          }
        });
      },
      countExamTotalScore() {
        this.totalScore = 0;
        this.examQuestions.forEach((item) => {
          if (this.form.ids.indexOf(item.id) !== -1) {
            this.totalScore += item.score;
          }
        });
        this.form.pass_score = Math.floor(this.totalScore * 0.8);
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
        apparatusList(this.searchApparatusForm).then((res) => {
          if (res.status === 200) {
            this.apparatus = res.data.data;
          }
        });
      },
      returnToList() {
        this.$router.push({
          path: '/exam/list',
        });
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
