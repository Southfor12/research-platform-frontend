<template>
  <div class="app-container">
    <el-form :model="feedOrder" label-width="100px">
      <div class="order-management">
        <div class="header">
          <h2>动物接收管理</h2>
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
                <el-button type="success" size="small" @click="importAnimal(scope.row)">接收</el-button>
              </template>
              <template v-else-if="scope.row.status === 0">
                <span style="color: red;">该订单尚未完成支付</span>
              </template>
              <template v-else-if="scope.row.status < 0">
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
            </el-form>
          </el-card>
        </el-dialog>

        <!-- 接收动物弹窗 -->
        <el-dialog title="接收" :visible.sync="receiveDialogVisible" width="500px">
          <el-form :model="receiveForm" :rules="receiveRules" ref="receiveForm" label-width="100px">
            <el-form-item label="合格证号" prop="qualificationNo">
              <el-input v-model="receiveForm.qualificationNo"></el-input>
            </el-form-item>
            
            <el-form-item label="许可证号" prop="licenseNo">
              <el-input v-model="receiveForm.licenseNo"></el-input>
            </el-form-item>
            
            <el-form-item label="用途" prop="purpose">
              <el-select v-model="receiveForm.purpose" placeholder="请选择用途">
                <el-option label="科研" value="科研"></el-option>
                <el-option label="教学" value="教学"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="使用数量" prop="useCount">
              <el-input v-model.number="receiveForm.useCount" type="number"></el-input>
            </el-form-item>
            
            <el-form-item label="使用日期" prop="useDate">
              <el-date-picker
                v-model="receiveForm.useDate"
                type="date"
                placeholder="选择日期"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="开证日期" prop="issueDate">
              <el-date-picker
                v-model="receiveForm.issueDate"
                type="date"
                placeholder="选择日期"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="接收日期" prop="receiveDate">
              <el-date-picker
                v-model="receiveForm.receiveDate"
                type="date"
                placeholder="选择日期"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd">
              </el-date-picker>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="receiveDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitReceive">提交</el-button>
            </span>
          </template>
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

export default {
  name: 'AnimalReceive',
  data() {
    return {
      feedOrder: [],
      dialogVisible: false,
      FeedOrderDialogVisible: false,
      auditResult: null,
      description: '',
      selectedOrder: {},
      currentRow: null,
      feedSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '待课题组审核', description: '等待课题组审核' },
        { title: '待饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '等待导入动物', description: '审批已完成' },
        { title: '已完成', description: '订单已完成' }
      ],
      feedCurrentStep: 0,
      receiveDialogVisible: false,
      receiveForm: {
        qualificationNo: '',
        licenseNo: '',
        purpose: '',
        useCount: '',
        useDate: '',
        issueDate: '',
        receiveDate: ''
      },
      receiveRules: {
        qualificationNo: [{ required: true, message: '请输入合格证号', trigger: 'blur' }],
        licenseNo: [{ required: true, message: '请输入许可证号', trigger: 'blur' }],
        purpose: [{ required: true, message: '请选择用途', trigger: 'change' }],
        useCount: [{ required: true, message: '请输入使用数量', trigger: 'blur' }],
        useDate: [{ required: true, message: '请选择使用日期', trigger: 'change' }],
        issueDate: [{ required: true, message: '请选择开证日期', trigger: 'change' }],
        receiveDate: [{ required: true, message: '请选择接收日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getFeedOrder();
  },
  methods: {
    async getFeedOrder() {
      try {
        console.log('开始获取动物接收订单数据...');
        const res = await getAllFeedOrder_({});
        console.log('API返回的原始数据:', res);
        
        if (!res.data || !Array.isArray(res.data)) {
          console.error('返回的数据格式不正确:', res);
          return;
        }
        
        // 过滤出状态为3（等待导入动物）的订单
        const waitingOrders = res.data.filter(item => item.status === 3);
        console.log('等待导入动物的订单:', waitingOrders);
        
        const promises = waitingOrders.map(async (item) => {
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
          return {
            ...item,
            status_: this.feedSteps[3].title // 直接使用"等待导入动物"状态
          };
        });
        
        console.log('最终渲染的订单数据:', this.feedOrder);
      } catch (err) {
        console.error('获取动物接收订单失败:', err);
        this.feedOrder = [];
      }
    },
    getStatusTagType(status) {
      switch (status) {
        case 0:
          return 'danger';
        case 1:
          return 'warning';
        case 2:
          return 'primary';
        case 3:
          return 'info';
        default:
          return '';
      }
    },
    viewFeedOrderDetail(row) {
      this.selectedOrder = row;
      this.FeedOrderDialogVisible = true;
    },
    approveOrder(row) {
      this.currentRow = row;
      this.auditResult = null;
      this.description = '';
      this.dialogVisible = true;
    },
    cancelOrder(row) {
      this.$confirm('确定要取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里添加取消订单的逻辑
        this.$message({
          type: 'success',
          message: '取消成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    importAnimal(row) {
      this.currentRow = row;
      // 设置默认值
      this.receiveForm = {
        qualificationNo: '',
        licenseNo: 'SCXK (浙) 2019-0001',
        purpose: '科研',
        useCount: '',
        useDate: '2025/1/15',
        issueDate: '',
        receiveDate: '2025/1/15'
      };
      this.receiveDialogVisible = true;
    },
    submitApproval() {
      if (this.auditResult === null) {
        this.$message.warning("请选择审核结果！");
        return;
      }

      const newStatus = this.auditResult ? this.currentRow.status + 1 : -this.currentRow.status;
      const params = {
        id: this.currentRow.id,
        status: newStatus,
        info: this.auditResult ? this.description : '',
      };

      checkFeedOrder(params).then((res) => {
        console.log('审核请求成功:', res);
        this.$message.success("审核提交成功");
        this.dialogVisible = false;
        this.getFeedOrder();
      })
        .catch((err) => {
          console.error("审核请求失败:", err);
          this.$message.error("审核提交失败，请稍后重试！");
        });
    },
    submitReceive() {
      this.$refs.receiveForm.validate((valid) => {
        if (valid) {
          console.log('接收动物表单提交:', this.receiveForm);
          this.$message.success('接收动物表单提交成功');
          this.receiveDialogVisible = false;
        } else {
          console.error('接收动物表单验证失败');
          this.$message.error('接收动物表单验证失败，请检查表单输入');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
}

.order-management {
  .header {
    margin-bottom: 20px;
    h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
  }
}

.info-card {
  margin-bottom: 20px;
}

.el-dialog_ {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style> 