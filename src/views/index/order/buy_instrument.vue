<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-dialog
      title="物品购买"
      :visible.sync="showDialog"
      width="30%"
      @close="handleClose"
      custom-class="el-dialog_"
    >
      <el-form label-width="80px">
        <el-form-item label="产品服务">
          <span>{{ this.buy_animal.name }}</span>
        </el-form-item>

        <el-form-item label="供应商">
          <span>{{ this.buy_animal.supervisor }}</span>
        </el-form-item>

        <el-form-item label="价格">
          <span>{{ this.buy_animal.price }}</span>
        </el-form-item>

        <el-form-item label="数量">
          <el-input-number v-model="buy_animal.count"></el-input-number>
        </el-form-item>

        <el-form-item label="用户备注">
          <el-input
            type="textarea"
            v-model="buy_animal.description"
            placeholder="输入备注"
          ></el-input>
        </el-form-item>

        <el-form-item label="收货地址">
          <el-input
            type="textarea"
            v-model="buy_animal.address"
            placeholder="输入收货地址"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="buy" style="margin-top: 20px">加入购物车</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="订单完成"
      :visible.sync="showDialog_"
      width="15%"
      @close="handleClose_"
      custom-class="el-dialog_"
    >
      <span style="color: green; font-size: 20px">添加物品订单成功！</span>
      <br />
      <el-button type="primary" @click="showDialog_ = false" style="margin-top: 20px"
        >继续购物</el-button
      >

      <el-button type="primary" @click="go_shopping_cart" style="margin-top: 20px"
        >前往购物车</el-button
      >
    </el-dialog>
    <div style="font-weight: bolder">物品订购</div>
    <hr />
    <br />
    <br />
    <br />
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="产品服务">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item label="供应商">
        <el-input v-model="queryForm.supervisor" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <!-- 产品服务，供应商，供应商电话，单价，描述 -->
      <el-table-column prop="name" label="产品服务" />
      <el-table-column prop="specification" label="供应商" />
      <el-table-column prop="supervisor_mobile" label="供应商电话" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="description" label="描述" />

      <el-table-column width="180" label="操作">
        <template v-slot="scope">
          <el-badge :value="scope.row.cartCount" class="cart-badge">
            <el-button
              :type="scope.row.cartCount > 0 ? 'success' : 'primary'"
              icon="el-icon-shopping-cart-full"
              @click="addToCart(scope.row)"
            ></el-button>
          </el-badge>
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
      :page-size="queryForm.page_size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
      <script>
import { getItem } from '@/api/product';
import Empty from '@/components/Empty';
import { AddItemOrder } from '@/api/order';
import store from '@/store';
import { getInfo } from '@/api/user';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      showDialog: false,
      showDialog_: false,
      index: 1,
      loading: false,
      queryForm: {
        page: 1,
        page_size: 100000,
        // sort: 'created_at',
        // sort_type: 'desc',
        // platform_id: '',

        // 产品服务，供应商，动物级别，年龄，体重，性别，单价，描述
        id: '',
        name: '',
        supervisor: '',
        level: '',
        age: '',
        weight: '',
        sex: '',
        price: '',
        description: '',
        no_deleted: true,
      },
      buy_animal: {
        id: '',
        name: '',
        supervisor: '',
        level: '',
        age: '',
        weight: '',
        sex: '',
        count: 1,
        extra: 0,
        price: '',
        description: '',
        item_id: '',
        address: '',
        user_id: store.getters.member.id,
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    go_shopping_cart() {
      this.$router.push({ path: '/personal/shopping/cart' });
    },
    handleClose() {
      this.showDialog = false;
    },
    handleClose_() {
      this.showDialog_ = false;
    },
    buy() {
      this.showDialog = false;
      this.showDialog_ = true;
      //把buy_animal对象传给后台

      AddItemOrder(this.buy_animal)
        .then((res) => {})
        .catch((_) => {});
    },

    addToCart(row) {
      row.cartCount += 1;
      this.showDialog = true;
      this.buy_animal.name = row.name;
      this.buy_animal.supervisor = row.specification;
      this.buy_animal.level = row.level;
      this.buy_animal.age = row.age;
      this.buy_animal.weight = row.weight;
      this.buy_animal.sex = row.sex;
      this.buy_animal.price = row.price;
      this.buy_animal.description = '';
      this.buy_animal.number = 1;
      this.buy_animal.item_id = row.id;
      this.buy_animal.address = '';
    },
    queryList() {
      this.loading = true;
      getItem(this.queryForm)
        .then((res) => {
          this.loading = false;
          console.log(111, res);
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
    toAdd(id = '') {
      if (!id) {
        this.$router.push({ path: '/admin/product/technical-add/' });
      } else {
        this.$router.push({ path: '/admin/product/technical-add/' + id });
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
    confirm() {
      // console.log("点击了确定");
      this.showDialog = false; // 关闭弹窗
    },
  },
};
</script>
                        
<style>
.cart-button-container {
  position: relative;
}

.cart-badge .el-badge__content {
  position: absolute;
  right: -4px; /* 调整水平位置 */
  bottom: -4px; /* 调整垂直位置 */
  transform: translate(50%, 50%); /* 调整角标位置，使其位于按钮右下角 */
}
.el-dialog_ {
  border-radius: 10px; /* 设置圆角 */
  overflow: hidden; /* 避免内容溢出 */
}
</style>               