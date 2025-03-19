<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-dialog
      title="动物购买"
      :visible.sync="showDialog"
      width="30%"
      @close="handleClose"
      custom-class="el-dialog_"
    >
      <el-form label-width="80px">
        <el-form-item label="产品服务">
          <span>{{ this.buy_animal.project_name }}</span>
        </el-form-item>

        <el-form-item label="供应商">
          <span>{{ this.buy_animal.supervisor }}</span>
        </el-form-item>

        <el-form-item label="动物级别">
          <span>{{ this.buy_animal.level }}</span>
        </el-form-item>

        <el-form-item label="年龄">
          <el-input v-model="buy_animal.age" placeholder="选择年龄范围"> </el-input>
        </el-form-item>

        <el-form-item label="体重">
          <el-input v-model="buy_animal.weight" placeholder="选择体重范围"> </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select v-model="buy_animal.gender" placeholder="选择性别">
            <el-option
              v-for="item in genderList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
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
          <el-input type="textarea" v-model="buy_animal.address" placeholder="输入地址"></el-input>
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
      <span style="color: green; font-size: 20px">添加动物订单成功！</span>
      <br />
      <el-button type="primary" @click="showDialog_ = false" style="margin-top: 20px"
        >继续购物</el-button
      >

      <el-button type="primary" @click="go_shopping_cart" style="margin-top: 20px"
        >前往购物车</el-button
      >
    </el-dialog>

    <div style="font-weight: bolder">动物订购</div>
    <hr />
    <br />
    <br />
    <br />
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="产品服务">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item label="供应商">
        <el-input v-model="queryForm.supplier_id" class="max-width-150" size="small" clearable />
      </el-form-item>

      <el-form-item label="动物级别">
        <el-select v-model="queryForm.level" class="max-width-150" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="SPF级" value="SPF级"></el-option>
          <el-option label="清洁级" value="清洁级"></el-option>
          <el-option label="普通级" value="普通级"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="queryForm.gender" class="max-width-150" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="雌性" value="雌性"></el-option>
          <el-option label="雄性" value="雄性"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <!-- 产品服务，供应商，动物级别，年龄，体重，性别，单价，描述 -->
      <el-table-column prop="name" label="产品服务" />
      <el-table-column prop="supplier_id" label="供应商" />
      <el-table-column prop="level" label="动物级别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="weight" label="体重" />
      <el-table-column prop="gender" label="性别" />
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
import { getAnimal } from '@/api/product';
import { AddAnimalOrder } from '@/api/order';
import Empty from '@/components/Empty';
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
        page_size: 10,
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
        project_name: '',
        supervisor: '',
        level: '',
        age: '',
        weight: '',
        gender: '',
        count: 1,
        userNote: '',
        price: '',
        description: '',
      },
      list: [
        {
          name: 1,
          supervisor: 2,
          level: 3,
          age: 4,
          weight: 5,
          sex: 6,
          price: 7,
          description: 8,
          cartCount: 0,
        },
      ],
      total: 0,
      genderList: [],
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

      //把buy_animal对象传给后台
      AddAnimalOrder(this.buy_animal)
        .then((res) => {
          this.showDialog_ = true;
        })
        .catch((_) => {});
    },

    addToCart(row) {
      row.cartCount += 1;
      this.showDialog = true;
      this.buy_animal.animal_id = row.id;
      this.buy_animal.project_name = row.name;
      this.buy_animal.supervisor = row.supervisor;
      this.buy_animal.level = row.level;
      this.buy_animal.age = row.age;
      this.buy_animal.weight = row.weight;
      this.buy_animal.gender = row.gender;
      if (row.gender == '未限定')
        this.genderList = [{ value: '雌性' }, { value: '雄性' }, { value: '未限定' }];
      else this.genderList = [{ value: row.gender }];
      this.buy_animal.price = row.price;
      this.buy_animal.number = 1;
      this.buy_animal.user_id = store.getters.member.id;
    },
    queryList() {
      this.loading = true;
      getAnimal(this.queryForm)
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