<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="账号名称" prop="name">
        <el-input v-model="form.name" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item label="课题组" prop="research_group_id">
        <el-select
          v-model="form.research_group_id"
          size="small"
          clearable
          class="max-width-300"
          filterable
          remote
          reserve-keyword
          :remote-method="getResearch"
          :loading="searchLoading"
          placeholder="输入姓名搜索选择"
        >
          <el-option v-for="item in research" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" size="small" class="max-width-200" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { userList } from '@/api/user';
import {
  researchGroupList,
  researchGroupAccountInfo,
  addResearchGroupAccount,
  editResearchGroupAccount,
} from '@/api/research';

export default {
  data() {
    return {
      loading: false,
      searchLoading: false,
      form: {
        id: '',
        name: '',
        research_group_id: '',
        note: '',
      },
      searchForm: {
        page: 1,
        size: 30,
        is_deleted: 0,
        name: '',
      },
      research: [],
      rules: {
        name: [
          {
            required: true,
            message: '请输入账号名称',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        research_group_id: [
          {
            required: true,
            message: '请选择课题组',
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
      this.getResearch();
    }
  },
  methods: {
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        researchGroupAccountInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.name = data.name;
            this.form.research_group_id = data.research_group_id;
            this.form.note = data.note;
            this.getResearch(data.research_group_name);
          }
        });
      } else {
        this.returnToList();
      }
    },
    submit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.form.id) {
            editResearchGroupAccount(this.form)
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
            addResearchGroupAccount(this.form)
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
    getResearch(query = '') {
      this.searchForm.name = query;
      this.searchLoading = true;
      researchGroupList(this.searchForm)
        .then((res) => {
          this.searchLoading = false;
          if (res.status === 200) {
            this.research = res.data.data;
          }
        })
        .catch((_) => {
          this.searchLoading = false;
        });
    },
    returnToList() {
      this.$router.push({ path: '/personal/research-group-account/list' });
    },
  },
};
</script>
<style lang="scss"></style>
