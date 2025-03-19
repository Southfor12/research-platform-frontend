<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="校区">
        <el-select
          v-model="queryForm.campusName"
          placeholder="请选择校区"
          @change="handleCampusChange"
        >
          <el-option
            v-for="item in campusList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼宇">
        <el-select
          v-model="queryForm.buildingName"
          placeholder="请选择楼宇"
          @change="handleBuildingChange"
        >
          <el-option
            v-for="item in tenementList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="二级单位">
        <el-input v-model="queryForm.unit" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="是否用于实验">
        <el-select v-model="queryForm.is_lab" class="max-width-150" size="small">
          <el-option label="实验室" value="true"></el-option>
          <el-option label="非实验室" value="false"></el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <br>
      <el-form-item label="使用状态">
        <el-select v-model="queryForm.status" class="max-width-150" size="small">
          <el-option label="开启" value="开启"></el-option>
          <el-option label="停用" value="停用"></el-option>
          <el-option label="整改中" value="整改中"></el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="房间号">
        <el-input v-model="queryForm.roomNumber" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item label="分类">
        <el-select v-model="queryForm.category" class="max-width-150" size="small">
          <el-option label="生物（医学）类" value="生物（医学）类"></el-option>
          <el-option label="化学类" value="化学类"></el-option>
          <el-option label="辐射类" value="辐射类"></el-option>
          <el-option label="机械类" value="机械类"></el-option>
          <el-option label="电子（电气）类" value="电子（电气）类"></el-option>
          <el-option label="其他类" value="其他类"></el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全风险等级">
        <el-select v-model="queryForm.riskLevel" class="max-width-150" size="small">
          <el-option label="一级" value="1"></el-option>
          <el-option label="二级" value="2"></el-option>
          <el-option label="三级" value="3"></el-option>
          <el-option label="四级" value="4"></el-option>
          <el-option label="五级" value="5"></el-option>
          <el-option label="(空)"></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="级别">
        <el-select v-model="queryForm.level" class="max-width-150" size="small">
          <el-option label="一级" value="1"></el-option>
          <el-option label="二级" value="2"></el-option>
          <el-option label="三级" value="3"></el-option>
          <el-option label="四级" value="4"></el-option>
          <el-option label="五级" value="5"></el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加实验室</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="实验室名称" />
      <el-table-column prop="campus_name" label="校区" />
      <el-table-column prop="building_name" label="楼宇" />
      <el-table-column prop="room_number" label="房间号" />
      <el-table-column prop="unit" label="二级单位" />
      <el-table-column prop="is_lab" label="是否用于实验">
        <template v-slot="scope">
          <span>{{ scope.row.is_lab === true ? '实验室' : '非实验室' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="使用面积" />
      <el-table-column prop="status" label="使用状态"> </el-table-column>
      <el-table-column prop="description" width="180" label="实验室简介" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="risk_level" label="安全风险等级" />
      <el-table-column prop="level" label="级别" />

      <!-- <el-table-column prop="id" label="编号">
        <template slot-scope="scope">
          {{getFactoryName(scope.row.factory_id)}}
        </template>
      </el-table-column> -->
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">详情</el-button>
          <el-button
            v-if="scope.row.deleted === false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.deleted === true"
            size="mini"
            type="info"
            @click="handleDelete(scope.row)"
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
      :page-size="queryForm.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getLaboratory, getCourtyard, delLaboratory, getTenement } from '@/api/colleges';
import { frontTrainDocList, deleteTrainDoc } from '@/api/security';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      campusList: [],
      tenementList: [],
      allTenements: [],
      loading: false,
      queryForm: {
        page: 1,
        pageSize: 10,
        sort: 'created_at',
        sort_type: 'desc',
        platform_id: '',
        campusName: '',
        buildingName: '',
        floor_number: '',
        roomNumber: '',
        name: '',
        unit: '',
        purpose: '',
        is_lab: '',
        area: '',
        status: '',
        description: '',
        category: '',
        risk_resource: '',
        riskLevel: null,
        protection_points: '',
        level: '',
        manager: [{ name: '', user_name: '', description: '', email: '', mobile: '' }],
      },
      list: [],
      total: 2,
    };
  },
  created() {
    this.getcampusList();
    this.queryList();
    this.getTenementList();
    // console.log(this.list);
    // this.getPlatforms();
  },
  methods: {
    getTenementList() {
      this.loading = true;
      getTenement({ page: 1, pageSize: 1000 })
        .then((res) => {
          this.loading = false;
          this.tenementList = res.data.content;
          this.allTenements = this.tenementList;
          // console.log(res.data.content);
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    // 选择校区时更新楼宇列表
    handleCampusChange() {
      this.queryForm.buildingName = '';
      if (this.queryForm.campusName) {
        // 根据选择的校区更新楼宇列表
        this.tenementList = this.allTenements.filter(
          (item) => item.campus_name === this.queryForm.campusName
        );
      } else {
        // 如果没有选择校区，清空楼宇列表
        this.tenementList = [];
      }
    },

    // 选择楼宇时更新校区
    handleBuildingChange() {
      const selectedBuilding = this.allTenements.find(
        (item) => item.name === this.queryForm.buildingName
      );
      if (selectedBuilding) {
        // 根据楼宇的 campus_id 自动更新对应的校区
        this.queryForm.campusName = selectedBuilding.campus_name;
      }
    },

    getcampusList() {
      this.loading = true;
      getCourtyard({ page: 1, pageSize: 1000 })
        .then((res) => {
          this.loading = false;
          this.campusList = res.data.content;

          // console.log(res.data.content);
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    queryList() {
      this.loading = true;
      getLaboratory(this.queryForm)
        .then((res) => {
          this.loading = false;
          this.list = res.data.content;
          this.total = res.data.totalElements;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.queryList();
    },
    handleDelete(row) {
      const text = row.deleted === true ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delLaboratory({ id: row.id }).then((response) => {
          row.deleted = row.deleted === false ? true : false;
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/admin/colleges/laboratory-add/' });
      } else {
        this.$router.push({ path: '/admin/colleges/laboratory-add/' + id });
      }
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.pageSize + 1;
    },
    handleSizeChange(val) {
      this.queryForm.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
