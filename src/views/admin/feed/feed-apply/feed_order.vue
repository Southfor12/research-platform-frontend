<!-- 这个是饲养订单的管理 -->
<template>
  <div>
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
                <el-icon class="icon-eye" @click="viewFeedOrderDetail(scope.row)"
                  style="cursor: pointer; margin-right: 5px; color: #409eff">
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
          <el-table-column prop="description" label="备注" />
          <el-table-column prop="status_" label="当前状态标识">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ scope.row.status_ }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <template v-if="scope.row.status === 3">
                <el-button type="success" size="small" @click="importAnimal(scope.row)">导入动物</el-button>
              </template>
              <template v-else-if="scope.row.status === 0">
                <span style="color: red;">该订单尚未完成支付</span>
              </template>
              <template v-else-if="scope.row.status < 0">
                <el-button type="info" size="small" @click="approveOrder(scope.row)">取消</el-button>
              </template>
              <template v-else-if="scope.row.status >= 4">
                <el-button type="info" size="small" @click="approveOrder(scope.row)">取消</el-button>
              </template>
              <template v-else>
                <el-button type="primary" size="small" @click="approveOrder(scope.row)">审核</el-button>
                <el-button type="danger" size="small" @click="cancelOrder(scope.row)">取消</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>

        <!-- 审核弹窗 -->
        <el-dialog title="审核订单" :visible.sync="dialogVisible" width="400px">
          <el-form label-width="80px">
            <el-form-item label="审核结果">
              <el-select v-model="auditResult" placeholder="请选择">
                <el-option label="审核通过" :value="true"></el-option>
                <el-option label="审核不通过" :value="false"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="描述">
              <el-input v-model="description" type="textarea"></el-input>
            </el-form-item>
          </el-form>

          <template #footer>
            <span>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitApproval">提交</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 订单详情弹窗 -->
        <el-dialog title="订单信息" :visible.sync="FeedOrderDialogVisible" width="600px" append-to-body
          custom-class="el-dialog_">
          <el-card shadow="hover" class="info-card">
            <el-form :column="2" border>
              <el-form-item label="订单编号">{{ selectedOrder.id }}</el-form-item>
              <el-form-item label="订单客户姓名">{{ selectedOrder.user_name }}</el-form-item>
              <el-form-item label="课程组">{{ selectedOrder.user_organization_name }}</el-form-item>
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
                <el-table :data="tableData" style="width: 100%" :cell-class-name="getCellClassName" border
                  text-align="center">
                  <el-table-column prop="row" label="#" width="50"></el-table-column>
                  <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col"
                    width="100"></el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card shadow="hover" class="progress-card">
            <h4>订单进展</h4>
            <el-steps :active="feedCurrentStep" finish-status="success">
              <el-step v-for="(step, index) in feedSteps" :key="index" :title="step.title"
                :description="step.description" :status="step.status">
              </el-step>
            </el-steps>
          </el-card>

          <div slot="footer" class="dialog-footer">
            <el-button @click="FeedOrderDialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getAllFeedOrder_, get_a_FeedOrder } from '@/api/order';
import { get_a_Feed } from '@/api/product';
import { get_a_Rack } from '@/api/colleges';
import { checkFeedOrder } from '@/api/order';
import store from '@/store';

export default {
  name: 'FeedOrder',
  data() {
    return {
      dialogVisible: false,//控制审核弹窗的显示状态
      auditResult: null, // 存储审核结果
      description: '', // 备注信息
      currentRow: null, // 记录当前审核的订单
      tableData: [], // 表格数据
      columns: [], // 表格列
      activeCells: [],
      FeedOrderDialogVisible: false, // 控制订单详情弹窗的显示状态
      selectedOrder: {}, // 当前选中的订单
      feedCurrentStep: 0, // 当前步骤索引
      feedSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '待课题组审核', description: '等待课题组审核' },
        { title: '待饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '等待导入动物', description: '审批已完成' },
        { title: '已完成', description: '订单已完成' }
      ],
      feedOrder: [],
    };
  },
  created() {
    this.getFeedOrder();
  },
  methods: {
    importAnimal(row) {
      //携带订单id跳转到导入动物页面
      this.$router.push({
        path: '/admin/feed/import_animal',
        query: { id: row.id } //通过query参数传递订单id
      })
      // this.$router.push('/admin/feed/import_animal')
    },
    getStatusTagType(status) {
      switch (status) {
        case 0:
          return 'danger'; // 未支付
        case 1:
          return 'warning'; // 课题组审核中
        case 2:
          return 'primary'; // 饲养管理员审核中
        case 3:
          return 'info'; // 等待导入动物
        default:
          return ''; // 默认
      }
    },
    async getFeedOrder() {
      try {
        console.log('开始获取饲养订单数据...');
        const res = await getAllFeedOrder_({});
        console.log('API返回的原始数据:', res);
        
        if (!res.data || !Array.isArray(res.data)) {
          console.error('返回的数据格式不正确:', res);
          return;
        }
        
        const promises = res.data.map(async (item) => {
          try {
            console.log('处理订单:', item.id);
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
            console.error('获取订单详情失败:', err);
            return item;
          }
        });

        const data = await Promise.all(promises);
        console.log('处理后的订单数据:', data);
        
        this.feedOrder = data.map((item) => {
          let statusText = '未知状态';
          if (item.status < 0) {
            statusText = '审核不通过';
          } else if (item.status >= 0 && item.status < this.feedSteps.length) {
            statusText = this.feedSteps[item.status].title;
          } else if (item.status >= this.feedSteps.length) {
            statusText = '已完成';
          }
          
          return {
            ...item,
            status_: statusText
          };
        });
        
        console.log('最终渲染的订单数据:', this.feedOrder);
      } catch (err) {
        console.error('获取饲养订单失败:', err);
        this.feedOrder = [];
      }
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
    }, // 初始化表格

    // 根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      console.log("你好，我是设置笼子高亮与否的方法");

      const colKey = this.columns[columnIndex - 1] || column.property; // 列名，从索引获取
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      console.log(`Checking cell: Row ${row.row}, Column ${colKey}, Active: ${isActive}`);
      return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
    },

    viewFeedOrderDetail(order) {
      console.log('Viewing feed order detail:', order);
      this.activeCells = [];
      this.selectedOrder = { ...order }; // 将选中的订单复制到 selectedOrder
      this.FeedOrderDialogVisible = true; // 显示弹窗
      get_a_Rack({ id: order.rack_id }).then((res) => {
        console.log("我被执行了");
        order.width = res.data.width;
        order.height = res.data.height;
        console.log(order.width, order.height);
        this.generateTableData(order.height, order.width);
        console.log(order.cage_number[0]);
        const row = this.tableData[Math.floor(order.cage_number[0] / this.columns.length)]; // 获取特定行的数据
        const column = this.columns.find(
          (col) =>
            col === String.fromCharCode(64 + (order.cage_number[0] % this.columns.length) + 1)
        ); // 获取特定列的名字
        let cellKey = { row: row.row, column: column };
        this.activeCells.push(cellKey); // 记录当前单元格位置
        console.log("Active cells:", this.activeCells);
      });
      this.feedCurrentStep = 0; // 重置步骤索引
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

    // 点击"审核"按钮，打开弹窗
    approveOrder(row) {
      console.log('审核订单:', row);
      this.currentRow = row; // 记录当前审核的行数据
      this.auditResult = null; // 清空审核结果
      this.description = ''; // 清空备注
      this.dialogVisible = true; // 打开弹窗
      console.log('审核弹窗状态:', this.dialogVisible);

    },

    // 提交审核
    submitApproval() {
      if (this.auditResult === null) {
        this.$message.warning("请选择审核结果！");
        return;
      }

      const newStatus = this.auditResult ? this.currentRow.status + 1 : -this.currentRow.status;
      const params = {
        id: this.currentRow.id,//訂單id
        status: newStatus,
        info: this.auditResult ? this.description : '',
      };

      //发送请求到后端
      checkFeedOrder(params).then((res) => {
        console.log('审核请求成功:', res);
        this.$message.success("审核提交成功");
        this.dialogVisible = false;
        this.getFeedOrder(); // 重新拉取订单数据，确保 UI 更新
      })
        .catch((err) => {
          console.error("审核请求失败:", err);
          this.$message.error("审核提交失败，请稍后重试！");
        });

    }

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
  border-radius: 10px;
  /* 设置圆角 */
  overflow: hidden;
  /* 避免内容溢出 */
}

/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9;
  /* 浅灰色 */
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b;
  /* 黄色 */
  color: #ffffff;
  /* 白色文字 */
}

.el-steps {
  margin: 20px auto;
  max-width: 600px;
}
</style>