<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="课题组名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
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
      <!-- <el-form-item class="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">新建课题组</el-button>
            </el-form-item> -->
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="leader_name" label="负责人姓名" />
      <el-table-column prop="fund_source" label="经费来源" />
      <el-table-column prop="platform_name" label="归属" />
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
                <el-tag type="danger" v-if="scope.row.is_deleted === 1">已删除</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column prop="factory_id" label="单位">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="checkNode('platform')" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button v-if="checkNode('platform') && scope.row.is_deleted === 0" size="mini" type="danger"
            @click="handleDelete(scope.row, 1)">删除</el-button>
          <el-button v-if="checkNode('platform') && scope.row.is_deleted === 1" size="mini" type="info"
            @click="handleDelete(scope.row, 0)">恢复</el-button>
          <!-- <div v-if="scope.row.leader_id !== member.id" style="margin-top: 10px;">
                    <el-button
                        size="mini"
                        type="success"
                        @click="toScoreList(scope.row)"
                    >评分列表</el-button>
                </div> -->
          <!-- <div style="margin-top: 10px;">
                    <el-button size="mini" @click="toFinance(scope.row.id)">财务管理</el-button>
                </div> -->
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog :title="queryScoreForm.group_name + '的评分'" :modal="false" :visible.sync="dialogScoreVisible"
      :fullscreen="true">
      <grade v-if="dialogScoreVisible" :target_type="3" :target_id="queryScoreForm.group_id" :source_type="2"
        :source_id="queryScoreForm.platform_id" :group_name="queryScoreForm.group_name"
        :add_auth="checkNode('platform')" :edit_auth="checkNode('platform')" :delete_auth="checkNode('platform')" />
    </el-dialog>
  </div>
</template>
<script>
  import {
    frontResearchGroupList,
    deleteResearchGroup,
    applyJoinResearchGroup,
  } from '@/api/research';
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
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          is_admin: '',
          name: '',
          is_deleted: '',
          factory_id: '',
        },
        queryScoreForm: {
          user_id: '',
          group_id: '',
          group_name: '',
          user_name: '',
          platform_id: '',
        },
        list: [],
        total: 0,
      };
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;
      if (!checkNode('platform')) this.queryForm.is_admin = 1;
      this.queryList();
    },
    methods: {
      queryList() {
        this.loading = true;
        frontResearchGroupList(this.queryForm)
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
          path: '/personal/research-group/finance/' + id,
        });
      },
      toScoreList(row) {
        this.scoreList = [];
        this.queryScoreForm.group_id = row.id;
        this.queryScoreForm.group_name = row.name;
        this.queryScoreForm.platform_id = row.platform_id;
        this.dialogScoreVisible = true;
      },
      handleSizeChange(val) {
        this.queryForm.size = val;
        this.queryList();
      },
      handleCurrentChange(val) {
        this.queryForm.page = val;
        this.queryList();
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
