<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="科研组室">
        <el-select
          v-model="queryForm.platform_id"
          filterable
          :clearable="true"
          size="small"
          class="max-width-150"
          placeholder="科研组室"
        >
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item v-if="checkNode('add_platform_room')" class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加科研组室门禁</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="id" label="门禁ID" />
      <el-table-column prop="name" label="门禁名称" />
      <el-table-column prop="sn" label="门禁编号" />
      <el-table-column prop="door_no" label="门禁号" />
      <el-table-column prop="platform_name" label="科研组室" />
      <el-table-column prop="ip" label="IP地址" />
      <el-table-column label="负责人/安全员">
        <template slot-scope="scope">
          {{ scope.row.safety_manager ? scope.row.safety_manager : '-' }}
          {{ scope.row.safety_manager_mobile ? scope.row.safety_manager_mobile : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <el-table-column
        v-if="
          checkNode('open_door') ||
          checkNode('edit_platform_room') ||
          checkNode('delete_platform_room')
        "
        fixed="right"
        width="220"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="checkNode('open_door')" size="mini" @click="toOpenDoor(scope.row.id)"
            >开门</el-button
          >
          <el-button
            v-if="checkNode('edit_platform_room')"
            size="mini"
            type="primary"
            @click="toAdd(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="checkNode('delete_platform_room') && scope.row.is_deleted === 0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, 1)"
            >删除</el-button
          >
          <el-button
            v-if="checkNode('delete_platform_room') && scope.row.is_deleted === 1"
            size="mini"
            type="info"
            @click="handleDelete(scope.row, 0)"
            >恢复</el-button
          >
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination
      class="dl-pagination"
      :hide-on-single-page="true"
      background
      :page-sizes="[10, 30, 50]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      :current-page="queryForm.page"
      :page-size="queryForm.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { platformList, platformRoomList, deletePlatformRoom, openDoor } from '@/api/platform';
import { checkNode } from '@/utils/validate';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        name: '',
        factory_id: '',
      },
      queryScoreForm: {
        page: 1,
        size: 10,
        user_id: '',
        platform_id: '',
        platform_name: '',
        user_name: '',
        platform_room_id: '',
        is_deleted: 0,
      },
      dialogScoreVisible: false,
      scoreList: [],
      scoreTotal: 0,
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      platforms: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.factory_id = this.currentFactoryId;
    this.queryList();
    this.getPlatforms();
  },
  methods: {
    queryList() {
      this.loading = true;
      platformRoomList(this.queryForm)
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
      this.$confirm('确定要删除该门禁吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlatformRoom({
          id: row.id,
          is_deleted: status,
        }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    dateFormat(time) {
      return time.substring(0, 10);
    },
    getPlatforms() {
      platformList({
        page: 1,
        size: 100,
        is_deleted: 0,
      }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    toOpenDoor(id) {
      const loading = this.$loading({
        lock: true,
        text: '开门中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255,255,255,0.8)',
      });
      openDoor({
        id,
      }).then((res) => {
        loading.close();
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({
          path: '/platform-room/add',
        });
      } else {
        this.$router.push({
          path: '/platform-room/edit/' + id,
        });
      }
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
