<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="实验室名称" prop="name">{{ form.name }}</el-form-item>
      <el-form-item label="单选题抽考数量" prop="single_choose_num">
        <el-input-number
          size="small"
          :min="0"
          :precision="0"
          v-model="form.single_choose_num"
          class="width-200"
        />
      </el-form-item>
      <el-form-item label="多选题抽考数量" prop="multi_choose_num">
        <el-input-number
          size="small"
          :min="0"
          :precision="0"
          v-model="form.multi_choose_num"
          class="width-200"
        />
      </el-form-item>
      <el-form-item label="判断题抽考数量" prop="check_num">
        <el-input-number
          size="small"
          :min="0"
          :precision="0"
          v-model="form.check_num"
          class="width-200"
        />
      </el-form-item>
      <el-form-item label="考试通过标准" prop="pass_type">
        <el-select
          v-model="form.pass_type"
          :clearable="true"
          size="small"
          class="width-200"
          @change="form.pass_rate = 60"
          placeholder="考试通过标准"
        >
          <el-option label="按照题数" :value="1"></el-option>
          <el-option label="按照分数" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.pass_type"
        :label="form.pass_type === 1 ? '通过答对题目比例' : '通过分数比例'"
        prop="pass_rate"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-slider v-model="form.pass_rate"></el-slider>
          </el-col>
          <el-col :span="2">{{ form.pass_rate }}%</el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apparatusInfo, updateExamConfig } from '@/api/apparatus';
import { userList } from '@/api/user';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      loading: false,
      searchLoading: false,
      showPlatform: false,
      information_time: 0,
      learning_time: 0,
      form: {
        id: '',
        name: '',
        type: '',
        admin_id: '',
        should_audit: '',
        parent_id: '',
        promise: '',
        single_choose_num: 1,
        multi_choose_num: 1,
        check_num: 1,
        pass_rate: 60,
        pass_type: '',
        information_time: 0,
        learning_time: 0,
        note: '',
      },
      searchForm: {
        page: 1,
        size: 30,
        status: 1,
        name: '',
      },
      searchPlatformForm: {
        page: 1,
        size: 30,
        type: 1,
        is_deleted: 0,
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
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
        parent_id: [
          {
            required: true,
            message: '请选择父平台',
            trigger: 'change',
          },
        ],
        admin_id: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          },
        ],
        should_audit: [
          {
            required: true,
            message: '请选择是否需要预约',
            trigger: 'change',
          },
        ],
        promise: [
          {
            required: true,
            message: '请填写实验室条款',
            trigger: 'blur',
          },
        ],
        single_choose_num: [
          {
            required: true,
            message: '请填写单选题抽考数量',
            trigger: 'blur',
          },
        ],
        multi_choose_num: [
          {
            required: true,
            message: '请填写多选题抽考数量',
            trigger: 'blur',
          },
        ],
        information_time: [
          {
            required: true,
            message: '请填写规章制度学习时间',
            trigger: 'blur',
          },
        ],
        learning_time: [
          {
            required: true,
            message: '请填写学习资料学习时间',
            trigger: 'blur',
          },
        ],
        check_num: [
          {
            required: true,
            message: '请填写判断题抽考数量',
            trigger: 'blur',
          },
        ],
        pass_type: [
          {
            required: true,
            message: '请选择考试通过标准',
            trigger: 'change',
          },
        ],
        pass_rate: [
          {
            required: true,
            message: '请选择通过考核正确比例',
            trigger: 'change',
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getInfo();
    } else {
      this.returnToList();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        apparatusInfo({
          id: this.form.id,
        }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            this.form = response.data;
            this.information_time = parseInt(this.form.information_time / 60);
            this.learning_time = parseInt(this.form.learning_time / 60);
            if (this.form.type == 2) this.showPlatform = true;
          }
        });
      } else {
        this.returnToList();
      }
    },
    typeChange() {
      if (this.form.type == 2) {
        this.showPlatform = true;
      } else {
        this.form.parent_id = '';
        this.showPlatform = false;
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.information_time = this.information_time * 60;
          this.form.learning_time = this.learning_time * 60;
          this.loading = true;
          if (this.form.id) {
            updateExamConfig(this.form)
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
    returnToList() {
      this.$router.push({
        path: '/apparatus-exam-rule/list',
      });
    },
  },
};
</script>
