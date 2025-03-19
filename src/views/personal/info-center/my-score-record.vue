<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <!-- <el-form :inline="true" :model="queryForm">
            <el-form-item label="打分来源">
                <el-select v-model="queryForm.source_type" :clearable="true" size="small" class="max-width-150" placeholder="打分来源">
                    <el-option label="平台" value="1"></el-option>
                    <el-option label="实验室" value="2"></el-option>
                    <el-option label="课题组" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button round size="small" @click="resetQuery">查询</el-button>
            </el-form-item>
        </el-form> -->
    <grade
      :target_type="1"
      :target_id="queryForm.user_id"
      :user_name="queryForm.user_name"
      :factory_id="queryForm.factory_id"
      :add_auth="0"
      :edit_auth="0"
      :delete_auth="0"
    />
  </div>
</template>
<script>
import { userScoreList } from '@/api/user';
import { mapGetters } from 'vuex';
import Grade from '@/components/Grade';
import Empty from '@/components/Empty';

export default {
  components: {
    Grade,
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        source_type: '',
        type: '',
        user_id: '',
        factory_id: '',
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryForm.user_name = this.member.user_name;
    this.queryForm.factory_id = this.currentFactoryId;
  },
  methods: {
    queryList() {
      this.loading = true;
      userScoreList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.list = res.data.data;
            this.total = res.data.total;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
