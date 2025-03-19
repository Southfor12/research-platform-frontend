<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="单位">
        <el-select v-model="form.factory_id" :clearable="false" size="small" class="width-200" placeholder="选择单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目" prop="name">
        <el-input
          type="textarea"
          size="small"
          class="width-500"
          :rows="5"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-if="!form.id"
          v-model="form.type"
          :clearable="true"
          size="small"
          class="width-200"
          placeholder="类型"
        >
          <el-option label="单选题" :value="1"></el-option>
          <el-option label="判断题" :value="2"></el-option>
          <el-option label="多选题" :value="3"></el-option>
        </el-select>
        <span v-else>{{ form.type === 1 ? '单选题' : form.type === 2 ? '判断题' : '多选题' }}</span>
      </el-form-item>
      <el-form-item label="选项" prop="singleAnswer" v-if="form.type === 1">
        <el-radio-group v-model="form.singleAnswer">
          <el-radio label="A"
            >A.
            <el-input v-model="form.a" size="small" class="width-200" />
          </el-radio>
          <el-radio label="B"
            >B.
            <el-input v-model="form.b" size="small" class="width-200" />
          </el-radio>
          <br />
          <el-radio label="C"
            >C.
            <el-input v-model="form.c" size="small" class="width-200" />
          </el-radio>
          <el-radio label="D"
            >D.
            <el-input v-model="form.d" size="small" class="width-200" />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="答案" prop="answer" v-if="form.type === 2">
        <el-select
          v-model="form.answer"
          :clearable="true"
          size="small"
          class="width-200"
          placeholder="答案"
        >
          <el-option label="正确" value="1"></el-option>
          <el-option label="错误" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选项" v-if="form.type === 3">
        <el-checkbox-group v-model="form.checkAnswer">
          <el-checkbox label="A"
            >A.
            <el-input v-model="form.a" size="small" class="width-200" />
          </el-checkbox>
          <el-checkbox label="B"
            >B.
            <el-input v-model="form.b" size="small" class="width-200" />
          </el-checkbox>
          <br />
          <el-checkbox label="C"
            >C.
            <el-input v-model="form.c" size="small" class="width-200" />
          </el-checkbox>
          <el-checkbox label="D"
            >D.
            <el-input v-model="form.d" size="small" class="width-200" />
          </el-checkbox>
          <br />
          <el-checkbox label="E"
            >E.
            <el-input v-model="form.e" size="small" class="width-200" />
          </el-checkbox>
        </el-checkbox-group>
        <span class="tips">说明：勾选选项为题目答案， 输入框为选项内容</span>
      </el-form-item>
      <el-form-item label="分值" prop="score">
        <el-input-number
          v-model="form.score"
          :min="1"
          size="small"
          label="课题经费金额"
          class="width-200"
        ></el-input-number>
        分
      </el-form-item>
      <el-form-item v-if="!form.id" label="子平台/实验室" prop="platform_id">
        <el-select
          v-if="!form.id || form.platform_id !== 0"
          v-model="form.platform_id"
          size="small"
          :disabled="form.id !== ''"
          clearable
          class="width-200"
          @change="platFormChange"
          placeholder="请选择子平台/实验室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="(!form.id && form.platform_id) || form.id"
        label="仪器"
        prop="apparatus_id"
      >
        <el-select
          v-model="form.apparatus_id"
          size="small"
          :disabled="form.id !== ''"
          clearable
          class="width-200"
          placeholder="请选择仪器"
        >
          <el-option v-for="item in apparatus" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-if="!form.id" class="tips">说明：不选择仪器则为入室考核试题</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { examQuestionInfo, addExamQuestion, editExamQuestion } from '@/api/security';
import { apparatusList, apparatusInfo } from '@/api/apparatus';
import { platformList, platformInfo } from '@/api/platform';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        name: '',
        type: '',
        answer: '',
        items: '',
        score: '',
        platform_id: '',
        apparatus_id: '',
        singleAnswer: '',
        checkAnswer: [],
        a: '',
        b: '',
        c: '',
        d: '',
        e: '',
        factory_id: '',
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
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          {
            min: 2,
            message: '长度至少 2个字',
            trigger: 'blur',
          },
        ],
        score: [
          {
            required: true,
            message: '请输入分值',
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change',
          },
        ],
        answer: [
          {
            required: true,
            message: '请选择判断题答案',
            trigger: 'change',
          },
        ],
        singleAnswer: [
          {
            required: true,
            message: '请勾选答案',
            trigger: 'change',
          },
        ],
        platform_id: [
          {
            required: true,
            message: '请选择平台',
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
    this.form.factory_id = this.currentFactoryId;
    if (this.$route.params.id) {
      this.getInfo();
    }
    this.getPlatforms();
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        examQuestionInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.type = data.type;
            if (this.form.type === 1) {
              this.form.singleAnswer = data.answer;
            } else if (this.form.type === 2) {
              this.form.answer = data.answer;
            } else {
              this.form.checkAnswer = data.answer.split(',');
            }
            if (this.form.type === 1 || this.form.type === 3) {
              data.items.forEach((item) => {
                switch (item.name) {
                  case 'A':
                    this.form.a = item.content;
                    break;
                  case 'B':
                    this.form.b = item.content;
                    break;
                  case 'C':
                    this.form.c = item.content;
                    break;
                  case 'D':
                    this.form.d = item.content;
                    break;
                  case 'E':
                    this.form.e = item.content;
                    break;
                }
              });
            }
            this.form.score = data.score;
            this.form.platform_id = data.platform_id;
            this.form.apparatus_id = data.apparatus_id;
            this.form.factory_id = data.factory_id;

            if (this.form.platform_id) {
              platformInfo({
                platform_id: this.form.platform_id,
              }).then((res) => {
                if (res.status === 200) {
                  this.platforms.push(res.data);
                }
              });
            }
            if (this.form.apparatus_id) {
              apparatusInfo({
                id: this.form.apparatus_id,
              }).then((res) => {
                if (res.status === 200) {
                  this.apparatus.push(res.data);
                }
              });
            }
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.type === 1 || this.form.type === 3) {
            if (this.form.type === 1) {
              this.form.answer = this.form.singleAnswer;
            } else {
              this.form.answer = this.form.checkAnswer.join(',');
            }
            try {
              if (!this.form.a) {
                throw '请填写A选项';
              } else if (!this.form.b) {
                throw '请填写B选项';
              } else if (!this.form.c) {
                throw '请填写C选项';
              } else if (!this.form.d) {
                throw '请填写D选项';
              }
              if (this.form.type === 3 && this.form.checkAnswer.length <= 1) {
                throw '多选题至少勾选2个答案';
              }
            } catch (err) {
              this.$message.error(err);
              return false;
            }
            this.form.items = [
              {
                name: 'A',
                content: this.form.a,
              },
              {
                name: 'B',
                content: this.form.b,
              },
              {
                name: 'C',
                content: this.form.c,
              },
              {
                name: 'D',
                content: this.form.d,
              },
              {
                name: 'E',
                content: this.form.e,
              },
            ];
            this.form.items = JSON.stringify(this.form.items);
          } else {
            this.form.items = '';
          }
          if (this.form.score < 1 || this.form.score > 100) {
            this.$message.error('分值在1-100之间');
            return false;
          }
          this.loading = true;
          if (this.form.id) {
            editExamQuestion(this.form)
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
            addExamQuestion(this.form)
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
    platFormChange() {
      this.searchApparatusForm.platform_id = this.form.platform_id;
      this.form.apparatus_id = '';
      this.apparatus = [];
      this.getApparatus();
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
        path: '/apparatus-exam-question/list',
      });
    },
  },
};
</script>
<style scoped>
.app-container >>> .el-radio {
  margin: 0 60px 18px 0px;
}
</style>
