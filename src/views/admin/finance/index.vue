<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true">
      <el-form-item label="平台总收入">{{ financeTotal }}元</el-form-item>
      <el-form-item label="单位">
        <el-select v-model="queryForm.factory_id" :clearable="false" size="small" class="max-width-150"
          placeholder="单位">
          <el-option :label="factory.name" :value="factory.id" :key="idx"
            v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="实验室" />
      <el-table-column prop="amount" label="余额/元" />
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="toFinance(scope.row.id)">财务详情</el-button>
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
  </div>
</template>

<script>
  import {
    frontResearchGroupList,
    deleteResearchGroup,
    platformInfo,
    applyJoinResearchGroup,
  } from '@/api/platform';
  import {
    total,
    platformList
  } from '@/api/finance';
  import {
    orderList
  } from '@/api/order';
  import {
    findIndexByKeyValue
  } from '@/utils/index';
  import {
    checkNode
  } from '@/utils/validate';
  import {
    mapGetters
  } from 'vuex';
  import Grade from '@/components/Grade';
  import Empty from '@/components/Empty';

  export default {
    components: {
      Empty,
      Grade,
    },
    computed: {
      ...mapGetters(['member']),
    },
    data() {
      return {
        loading: false,
        dialogScoreVisible: false,
        platform: {},
        financeInfo: {},
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          id: '',
          type: '',
          search_type: 2,
          is_deleted: '0',
        },
        queryScoreForm: {
          user_id: '',
          group_id: '',
          group_name: '',
          user_name: '',
          platform_id: '',
          factory_id: '',
        },
        list: [],
        total: 0,
        financeTotal: 0,
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      this.queryList();
    },
    methods: {
      queryList() {
        this.loading = true;
        let params = {
          factory_id: this.queryForm.factory_id,
        };
        platformList(params)
          .then((res) => {
            this.loading = false;
            if (res.status === 200) {
              this.list = res.data;
            }
          })
          .catch((_) => {
            this.loading = false;
          });

        total(params).then((res) => {
          if (res.status === 200) {
            this.financeTotal = res.data.amount;
          }
        });
      },
      resetQuery(type) {
        this.queryForm.type = type;
        this.queryForm.page = 1;
        this.queryList();
      },
      handleDelete(row, status) {
        const text = status === 0 ? '恢复' : '删除';
        this.$confirm('确定要' + text + '课题组"' + row.name + '"吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteResearchGroup({
            id: row.id,
            is_deleted: status
          }).then((response) => {
            if (response.status === 1) {
              this.queryList();
            }
          });
        });
      },
      getType(type) {
        switch (type) {
          case 1:
            return '科研组室';
          case 2:
            return '课题组';
          case 3:
            return '科研个人账户';
        }
      },
      toJoin(id) {
        applyJoinResearchGroup({
          research_group_id: id
        });
      },
      toAdd(id = '') {
        if (!id) {
          this.$router.push({
            path: '/personal/research-group/add'
          });
        } else {
          this.$router.push({
            path: '/personal/research-group/edit/' + id,
          });
        }
      },
      toFinance(id) {
        this.$router.push({
          path: '/finance/platform/' + id
        });
      },
      toScoreList(row) {
        this.scoreList = [];
        this.queryScoreForm.group_id = row.id;
        this.queryScoreForm.group_name = row.name;
        this.queryScoreForm.platform_id = row.platform_id;
        this.dialogScoreVisible = true;
      },
      typeAmount(type) {
        if (!this.financeInfo.detail) return 0;
        var index = findIndexByKeyValue(this.financeInfo.detail, 'type', type);
        if (index > -1) {
          return this.financeInfo.detail[index].amount;
        }
        return 0;
      },
      handleSizeChange(val) {
        this.queryForm.size = val;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
      },
      returnToList() {
        this.$router.push({
          path: '/personal/platform/list'
        });
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
      },
      checkNode(node) {
        return checkNode(node);
      },
    },
  };
</script>
