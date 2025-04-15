<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-tabs v-model="activeTab" @keydown.native="handleTabSwitch" @tab-click="handleTabChange">
      <el-tab-pane label="动物订单" name="animalOrder">
        <el-form :model="animalOrder" label-width="100px"
          ><div class="order-management">
            <div class="header">
              <h2>动物订单管理</h2>
            </div>

            <el-table :data="animalOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="animalOrder" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewAnimalOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewAnimalOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课题组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="name" label="产品服务" />
              <el-table-column prop="supplier_name" label="供应商" />
              <el-table-column prop="level" label="动物级别" />
              <el-table-column prop="age" label="周龄" />
              <el-table-column prop="weight" label="体重" />
              <el-table-column prop="gender" label="性别" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="totalCost" label="金额" />
              <el-table-column prop="extra" label="其他费用" />
              <el-table-column prop="finalCost" label="总额" />
              <!-- <el-table-column prop="room" label="词养房间" /> -->
              <el-table-column prop="description" label="备注" />
              <el-table-column prop="status_" label="当前状态标识" />
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="AnimalOrderDialogVisible"
              width="40%"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="产品服务">{{ selectedOrder.name }}</el-form-item>
                  <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
                  <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
                  <el-form-item label="金额合计">{{
                    selectedOrder.count * selectedOrder.price
                  }}</el-form-item>
                  <el-form-item label="其他费用">{{ selectedOrder.extra }}</el-form-item>
                  <el-form-item label="描述">{{ selectedOrder.remarks }}</el-form-item>
                  <el-form-item label="申请的笼位">
                    <el-table
                      :data="tableData"
                      style="width: 100%"
                      :cell-class-name="getCellClassName"
                      border
                      text-align="center"
                    >
                      <el-table-column prop="row" label="#" width="50"></el-table-column>
                      <el-table-column
                        v-for="col in columns"
                        :key="col"
                        :prop="col"
                        :label="col"
                        width="100"
                      ></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="animalCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in animalSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="AnimalOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="物品订单" name="itemOrder">
        <el-form :model="itemOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>物品订单管理</h2>
            </div>

            <el-table :data="itemOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewItemOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewItemOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课题组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="name" label="产品服务" />
              <el-table-column prop="supplier_name" label="供应商" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="extra" label="其他费用" />
              <el-table-column prop="finalCost" label="总额" />
              <el-table-column prop="description" label="备注" />
              <el-table-column prop="status_" label="当前状态标识" />
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="ItemOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="产品服务">{{ selectedOrder.name }}</el-form-item>
                  <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
                  <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
                  <el-form-item label="金额合计">{{ selectedOrder.totalCost }}</el-form-item>
                  <el-form-item label="描述">{{ selectedOrder.description }}</el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="itemCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in itemSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="ItemOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="饲养订单" name="feedOrder">
        <el-form :model="feedOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>饲养订单管理</h2>
            </div>

            <el-table :data="feedOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewFeedOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewFeedOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课题组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="source" label="动物来源" />
              <el-table-column prop="area_type" label="区域" />
              <el-table-column prop="animal_type" label="动物种类" />
              <el-table-column prop="level" label="动物级别" />
              <el-table-column prop="start_time" label="开始时间" />
              <el-table-column prop="end_time" label="结束时间" />
              <el-table-column prop="price" label="总额" />
              <el-table-column prop="description" label="备注" />
              <el-table-column prop="status_" label="当前状态标识" />
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="FeedOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
                  <el-form-item label="课题组">{{ selectedOrder.user_organization_name }}</el-form-item>
                  <el-form-item label="订单时间">{{ selectedOrder.create_time }}</el-form-item>
                  <el-form-item label="动物来源">{{ selectedOrder.source }}</el-form-item>
                  <el-form-item label="区域">{{ selectedOrder.area_type }}</el-form-item>
                  <el-form-item label="动物种类">{{ selectedOrder.animal_type }}</el-form-item>
                  <el-form-item label="动物级别">{{ selectedOrder.level }}</el-form-item>
                  <el-form-item label="开始时间">{{ selectedOrder.start_time }}</el-form-item>
                  <el-form-item label="结束时间">{{ selectedOrder.end_time }}</el-form-item>
                  <el-form-item label="备注">{{ selectedOrder.description }}</el-form-item>
                  <el-form-item label="当前状态标识">{{ selectedOrder.status }}</el-form-item>
                  <el-form-item label="申请的笼位">
                    <el-table
                      :data="tableData"
                      style="width: 100%"
                      :cell-class-name="getCellClassName"
                      border
                      text-align="center"
                    >
                      <el-table-column prop="row" label="#" width="50"></el-table-column>
                      <el-table-column
                        v-for="col in columns"
                        :key="col"
                        :prop="col"
                        :label="col"
                        width="100"
                      ></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="feedCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in feedSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="FeedOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="技术订单" name="techOrder">
        <el-form :model="techOrder" label-width="100px">
          <div class="order-management">
            <div class="header">
              <h2>技术订单管理</h2>
            </div>
            <!-- 订单编号、订购人、课题组、订单时间、技术服务（冻存服务、复苏服务、净化服务）、价格、数量、金额、备注、状态 -->
            <el-table :data="techOrder" stripe border>
              <!-- 表格列定义 -->
              <el-table-column prop="id" label="订单编号" width="100">
                <template #default="scope">
                  <el-tooltip content="查看详情" placement="top">
                    <el-icon
                      class="icon-eye"
                      @click="viewTechOrderDetail(scope.row)"
                      style="cursor: pointer; margin-right: 5px; color: #409eff"
                    >
                      <i class="el-icon-view"></i>
                    </el-icon>
                  </el-tooltip>
                  <el-link @click="viewTechOrderDetail(scope.row)">{{ scope.row.id }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="订单客户姓名" width="120" />
              <el-table-column prop="user_organization_name" label="课题组" width="100" />
              <el-table-column prop="create_time" label="订单时间" width="150" />
              <el-table-column prop="name" label="技术服务" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="totalCost" label="金额" />
              <el-table-column prop="info" label="备注" />
              <el-table-column prop="status_" label="当前状态标识" />
            </el-table>

            <!-- 订单详情弹窗 -->
            <el-dialog
              title="订单信息"
              :visible.sync="TechOrderDialogVisible"
              width="600px"
              append-to-body
              custom-class="el-dialog_"
            >
              <el-card shadow="hover" class="info-card">
                <el-form :column="2" border>
                  <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
                  <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
                  <el-form-item label="课题组">{{ selectedOrder.user_organization_name }}</el-form-item>
                  <el-form-item label="订单时间">{{ selectedOrder.create_time }}</el-form-item>
                  <el-form-item label="技术服务">{{ selectedOrder.name }}</el-form-item>
                  <el-form-item label="价格">{{ selectedOrder.price }}</el-form-item>
                  <el-form-item label="数量">{{ selectedOrder.count }}</el-form-item>
                  <el-form-item label="金额合计">{{ selectedOrder.totalCost }}</el-form-item>
                  <el-form-item label="备注">{{ selectedOrder.info }}</el-form-item>
                  <el-form-item label="当前状态标识">{{ selectedOrder.status }}</el-form-item>
                </el-form>
              </el-card>

              <el-card shadow="hover" class="progress-card">
                <h4>订单进展</h4>
                <el-steps :active="techCurrentStep" finish-status="success">
                  <el-step
                    v-for="(step, index) in techSteps"
                    :key="index"
                    :title="step.title"
                    :description="step.description"
                    :status="step.status"
                  >
                  </el-step>
                </el-steps>
              </el-card>

              <div slot="footer" class="dialog-footer">
                <el-button @click="TechOrderDialogVisible = false">关闭</el-button>
              </div>
            </el-dialog>
          </div></el-form
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
      <script>
import {
  getAllItemOrder,
  getAllFeedOrder,
  getAllTechOrder,
  getAllAnimalOrder,
  get_a_FeedOrder,
} from '@/api/order';
import { get_a_Feed, get_a_Animal } from '@/api/product';
import { get_a_Rack } from '@/api/colleges';
import store from '@/store';
import { status } from 'nprogress';
export default {
  name: 'OrderManagement',
  data() {
    return {
      tableData: [], // 表格数据
      columns: [], // 表格列
      activeCells: [],
      searchQuery: '', // 搜索内容
      AnimalOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      ItemOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      FeedOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      TechOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      selectedOrder: {}, // 当前选中的订单
      loading: false,

      activeTab: 'animalOrder', // 初始选中的标签页
      tabNames: ['animalOrder', 'itemOrder', 'feedOrder', 'techOrder'], // 标签页的 name 顺序

      animalStutas: [
        '待支付',
        '待课题组管理员审核',
        '待采购人审核',
        '待中心主任审批',
        '',
        '审批通过',
      ],
      itemStutas: [
        '待支付',
        '待课题组管理员审核',
        '待采购人审核',
        '待中心主任审批',
        '',
        '审批通过',
      ],
      feedStutas: ['待支付', '待课题组管理员审核', '待饲养管理员审批', '', '审批通过'],
      techStutas: [
        '待支付',
        '待课题组管理员审核',
        '待饲养管理员审批',
        '待中心主任审批',
        '',
        '审批通过',
      ],

      animalStutas_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      itemStutas_: ['课题组管理员审核不通过', '采购人审核不通过', '中心主任审批不通过'],
      feedStutas_: ['课题组管理员审核不通过', '饲养管理员审批不通过'],
      techStutas_: ['课题组管理员审核不通过', '饲养管理员审批不通过', '中心主任审批不通过'],

      animalCurrentStep: 0, // 当前步骤索引
      itemCurrentStep: 0,
      feedCurrentStep: 0,
      techCurrentStep: 0,

      animalSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '流程已完成' },
      ],
      itemSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '等待流程已完成' },
      ],
      feedSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '审批通过', description: '流程已完成' },
      ],
      techSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批通过', description: '流程已完成' },
      ],

      animalOrder: [],
      itemOrder: [],
      feedOrder: [],
      techOrder: [],
      form: {
        name: '',
        number: '',
        id: '',
      },
    };
  },
  created() {
    //     this.loading = true;
    //     this.queryList();

    this.getAnimalOrder();
  },
  methods: {
    handleTabChange(newTab, oldTab) {
      if (newTab === 'animalOrder') this.getAnimalOrder();
      if (newTab === 'itemOrder') this.getItemOrder();
      if (newTab === 'feedOrder') this.getFeedOrder();
      if (newTab === 'techOrder') this.getTechOrder();
    },

    // 审核订单

    async getAnimalOrder() {
      try {
        const res = await getAllAnimalOrder({ user_id: store.getters.member.id });

        const promises = res.data.map(async (item) => {
          try {
            // 并行请求动物信息和饲养订单信息
            const [animalRes, feedOrderRes] = await Promise.all([
              get_a_Animal({ id: item.animal_id }),
              get_a_FeedOrder({ id: item.care_order_id }),
            ]);

            return {
              ...item,
              name: animalRes.data.name,
              level: animalRes.data.level,
              age: animalRes.data.age,
              weight: animalRes.data.weight,
              gender: animalRes.data.gender,
              price: animalRes.data.price,
              cage_number: feedOrderRes.data.cage_number,
              rack_id: feedOrderRes.data.rack_id,
            };
          } catch (err) {
            console.error('Error fetching details:', err);
            return item; // 出错时返回原始数据
          }
        });

        const data = await Promise.all(promises);

        this.animalOrder = data.map((item) => ({
          ...item,
          totalCost: item.price * item.count,
          finalCost: item.price * item.count + item.extra,
          status_:
            item.status >= 0
              ? this.animalStutas[item.status]
              : this.animalStutas_[-item.status - 2],
        }));
      } catch (err) {
        console.error('Error fetching animal orders:', err);
        this.animalOrder = [];
      }
    },

    async getFeedOrder() {
      try {
        const res = await getAllFeedOrder({ user_id: store.getters.member.id });

        const promises = res.data.map(async (item) => {
          try {
            const ress = await get_a_Feed({ id: item.care_id });
            const totalCost = item.price * item.count + item.extra;

            return {
              ...item,
              animal_type: ress.data.animal_type,
              room_id: ress.data.room_id,
              area_type: ress.data.area_type,
              totalCost,
              finalCost: totalCost,
            };
          } catch (err) {
            console.error('Error fetching feed details:', err);
            return item; // Return original item if feed details fetch fails
          }
        });

        const data = await Promise.all(promises);
        this.feedOrder = data.map((item) => ({
          ...item,
          status_:
            item.status >= 0 ? this.feedStutas[item.status] : this.feedStutas_[-item.status - 2],
        }));
      } catch (err) {
        console.error('Error fetching feed orders:', err);
        this.feedOrder = [];
      }
    },

    getItemOrder() {
      getAllItemOrder({ user_id: store.getters.member.id }).then((res) => {
        this.itemOrder = res.data;
        this.itemOrder.forEach((item) => {
          item.totalCost = item.price * item.count + item.extra;
          item.finalCost = item.totalCost;
          if (item.status >= 0) item.status_ = this.itemStutas[item.status];
          else item.status_ = this.itemStutas_[-item.status - 2];
        });
      });
    },

    getTechOrder() {
      getAllTechOrder({ user_id: store.getters.member.id }).then((res) => {
        this.techOrder = res.data;
        this.techOrder.forEach((item) => {
          console.log(item.status);
          item.totalCost = item.price * item.count;
          item.finalCost = item.totalCost;
          if (item.status >= 0) item.status_ = this.techStutas[item.status];
          else item.status_ = this.techStutas_[-item.status - 2];
        });
      });
    },

    generateTableData(rows, cols) {
      this.tableData = [];
      this.columns = [];
      for (let i = 1; i <= cols; i++) {
        this.columns.push(String.fromCharCode(64 + i));
      }
      for (let i = 1; i <= rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    }, //初始化表格

    reviewOrder(order) {
      this.$message.success(`审核订单：${order.orderNumber}`);
    },
    // 查看订单详情

    // 根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
    },

    viewAnimalOrderDetail(order) {
      this.activeCells = [];
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.AnimalOrderDialogVisible = true; // 显示弹窗
      if (order.care_order_id)
        get_a_Rack({ id: order.rack_id }).then((res) => {
          order.width = res.data.width;
          order.height = res.data.height;
          this.generateTableData(order.height, order.width);
          const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)]; // 获取特定行的数据
          const column = this.columns.find(
            (col) =>
              col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
          ); // 获取特定列的名字
          let cellKey = { row: row.row, column: column };
          this.activeCells.push(cellKey); // 记录当前单元格位置
        });

      this.animalSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批', description: '流程已完成' },
      ];
      this.animalCurrentStep = 0; // 重置步骤索引
      for (let i = 0; i < this.animalSteps.length; i++) this.animalSteps[i].status = '';
      if (order.status === this.animalSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.animalSteps[i].title = this.animalSteps[i].title + '通过';
          this.animalSteps[i].description = '';
          this.animalCurrentStep++;
        }
        this.animalSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.animalSteps[i].title = this.animalSteps[i].title + '通过';
          this.animalSteps[i].description = '';
          this.animalCurrentStep++;
        }
        this.animalSteps[0].title = '已付款';
        this.animalSteps[-order.status - 1].title =
        this.animalSteps[-order.status - 1].title + '不通过';
        this.animalSteps[-order.status - 1].description = '';
        this.animalSteps[-order.status - 1].status = 'error';
      }
    },
    viewItemOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.ItemOrderDialogVisible = true; // 显示弹窗
      this.itemCurrentStep = 0; // 重置步骤索引
      this.itemSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '采购人审核', description: '等待采购人审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.itemSteps.length; i++) this.itemSteps[i].status = '';
      if (order.status === this.itemSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.itemSteps[i].title = this.itemSteps[i].title + '通过';
          this.itemSteps[i].description = '';
          this.itemCurrentStep++;
        }
        this.itemSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.itemSteps[i].title = this.itemSteps[i].title + '通过';
          this.itemSteps[i].description = '';
          this.itemCurrentStep++;
        }
        this.itemSteps[0].title = '已付款';
        this.itemSteps[-order.status - 1].title =
          this.itemSteps[-order.status - 1].title + '不通过';
        this.itemSteps[-order.status - 1].description = '';
        this.itemSteps[-order.status - 1].status = 'error';
      }
    },
    viewFeedOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.FeedOrderDialogVisible = true; // 显示弹窗
      get_a_Rack({ id: order.rack_id }).then((res) => {
        order.width = res.data.width;
        order.height = res.data.height;
        this.generateTableData(order.height, order.width);
        const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)]; // 获取特定行的数据
        const column = this.columns.find(
          (col) =>
            col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
        ); // 获取特定列的名字
        let cellKey = { row: row.row, column: column };
        this.activeCells.push(cellKey); // 记录当前单元格位置
      });
      this.feedCurrentStep = 0; // 重置步骤索引
      this.feedSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.feedSteps.length; i++) this.feedSteps[i].status = '';
      if (order.status === this.feedSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.feedSteps[i].title = this.feedSteps[i].title + '通过';
          this.feedSteps[i].description = '';
          this.feedCurrentStep++;
        }
        this.feedSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.feedSteps[i].title = this.feedSteps[i].title + '通过';
          this.feedSteps[i].description = '';
          this.feedCurrentStep++;
        }
        this.feedSteps[0].title = '已付款';
        this.feedSteps[-order.status - 1].title =
          this.feedSteps[-order.status - 1].title + '不通过';
        this.feedSteps[-order.status - 1].description = '';
        this.feedSteps[-order.status - 1].status = 'error';
      }
    },
    viewTechOrderDetail(order) {
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.TechOrderDialogVisible = true; // 显示弹窗
      this.techCurrentStep = 0; // 重置步骤索引
      this.techSteps = [
        { title: '待付款', description: '等待付款' },
        { title: '课题组审核', description: '等待课题组审核' },
        { title: '饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '中心主任审批', description: '等待中心主任审批' },
        { title: '审批', description: '流程已完成' },
      ];
      for (let i = 0; i < this.techSteps.length; i++) this.techSteps[i].status = '';
      if (order.status === this.techSteps.length - 1) order.status++;
      if (order.status > 0) {
        for (let i = 0; i < order.status; i++) {
          this.techSteps[i].title = this.techSteps[i].title + '通过';
          this.techSteps[i].description = '';
          this.techCurrentStep++;
        }
        this.techSteps[0].title = '已付款';
      } else if (order.status < 0) {
        for (let i = 0; i < -order.status - 1; i++) {
          this.techSteps[i].title = this.techSteps[i].title + '通过';
          this.techSteps[i].description = '';
          this.techCurrentStep++;
        }
        this.techSteps[0].title = '已付款';
        this.techSteps[-order.status - 1].title =
          this.techSteps[-order.status - 1].title + '不通过';
        this.techSteps[-order.status - 1].description = '';
        this.techSteps[-order.status - 1].status = 'error';
      }
    },

    //tab键切换
    handleTabSwitch(event) {
      if (event.key === 'Tab') {
        event.preventDefault(); // 防止默认的 Tab 行为
        const currentIndex = this.tabNames.indexOf(this.activeTab);

        if (!event.shiftKey) {
          // Tab 键，切换到下一个标签
          const nextIndex = (currentIndex + 1) % this.tabNames.length;
          this.activeTab = this.tabNames[nextIndex];
        } else {
          // Shift + Tab，切换到上一个标签
          const prevIndex = (currentIndex - 1 + this.tabNames.length) % this.tabNames.length;
          this.activeTab = this.tabNames[prevIndex];
        }
      }
    },
  },
  watch: {
    activeTab(newTab, oldTab) {
      this.handleTabChange(newTab, oldTab);
    },
  },
};
</script>

<style>
.order-management {
  padding: 20px;
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.dialog-footer {
  text-align: right;
}
.el-dialog_ {
  border-radius: 10px; /* 设置圆角 */
  overflow: hidden; /* 避免内容溢出 */
}

/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9; /* 浅灰色 */
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b; /* 黄色 */
  color: #ffffff; /* 白色文字 */
}

.el-steps {
  margin: 20px auto;
  max-width: 600px;
}
</style>