<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="产品服务">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="queryForm.supplier_id" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="动物级别">
        <el-select v-model="queryForm.level" class="max-width-150" size="small" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="SPF级" value="SPF级"></el-option>
          <el-option label="清洁级" value="清洁级"></el-option>
          <el-option label="普通级" value="普通级"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="queryForm.gender" class="max-width-150" size="small" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="雄性" value="雄性"></el-option>
          <el-option label="雌性" value="雌性"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)"
          >添加动物</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="产品服务" />
      <el-table-column prop="number" label="编号" />
      <el-table-column prop="supplier_id" label="供应商" />
      <el-table-column prop="level" label="动物级别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="weight" label="体重" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="description" label="描述" />

      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toAdd(scope.row.id)">修改</el-button>
          <el-button
            v-if="scope.row.is_deleted === false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.is_deleted === true"
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
      :page-size="queryForm.page_ize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
      <script>
import { getAnimal, delAnimal } from '@/api/product';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      index: 1,
      loading: false,
      queryForm: {
        page: 1,
        page_size: 10,
        // sort: 'created_at',
        // sort_type: 'desc',
        // platform_id: '',
        id: '',
        age: '',
        description: '',
        gender: '',
        level: '',
        name: '',
        number: '',
        price: '',
        supplier_id: '',
        weight: '',
        number: '',
        is_deleted: false,
        no_deleted: false,
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      getAnimal(this.queryForm)
        .then((res) => {
          this.loading = false;
          this.list = res.data.content;
          console.log(res.data.content);
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
      const text = row.is_deleted === true ? '恢复' : '删除';
      this.$confirm('确定要' + text + '"' + row.name + '"吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delAnimal({ id: row.id, is_deleted: !row.is_deleted }).then((response) => {
          row.is_deleted = row.is_deleted === false ? true : false;
          console.log(row.is_deleted);
        });
      });
    },
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/admin/product/animal-add/' });
      } else {
        this.$router.push({ path: '/admin/product/animal-add/' + id });
      }
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.page_size + 1;
    },
    handleSizeChange(val) {
      this.queryForm.page_size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryForm.page = val;
      this.queryList();
    },
  },
};
</script>
      
      