<!-- 这个是动物接受的管理 -->
<template>
  <div>
    <el-form :model="animalAccept" label-width="100px">
      <div class="accept-management">
        <div class="header">
          <h2>动物接受管理</h2>
        </div>

        <el-table :data="animalAccept" stripe border>
          <!-- 表格列定义 -->
          <el-table-column prop="id" label="订单编号" width="100">
            <template #default="scope">
              <el-tooltip content="查看详情" placement="top">
                <el-icon class="icon-eye" @click="viewAnimalAcceptDetail(scope.row)"
                  style="cursor: pointer; margin-right: 5px; color: #409eff">
                  <i class="el-icon-view"></i>
                </el-icon>
              </el-tooltip>
              <el-link @click="viewAnimalAcceptDetail(scope.row)">{{ scope.row.id }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="订单客户姓名" width="120" />
          <el-table-column prop="user_organization_name" label="课题组" width="100" />
          <el-table-column prop="create_time" label="订单时间" width="150" />
          <el-table-column prop="source" label="动物来源" />
          <el-table-column prop="area_type" label="区域" />
          <el-table-column prop="animal_type" label="动物种类" />
          <el-table-column prop="level" label="动物级别" />
          <el-table-column label="申请数量" width="100">
            <template #default="scope">
              <div v-for="(animal, index) in scope.row.animals" :key="index">
                {{ animal.animal_type }}: {{ animal.count }}只
              </div>
            </template>
          </el-table-column>
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
              <el-button type="success" size="small" @click="acceptAnimal(scope.row)">接收</el-button>
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
        <el-dialog title="订单信息" :visible.sync="AnimalAcceptDialogVisible" width="600px" append-to-body
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
            </el-form>
          </el-card>

          <el-card shadow="hover" class="progress-card">
            <h4>订单进展</h4>
            <el-steps :active="acceptCurrentStep" finish-status="success">
              <el-step v-for="(step, index) in acceptSteps" :key="index" :title="step.title"
                :description="step.description" :status="step.status">
              </el-step>
            </el-steps>
          </el-card>

          <div slot="footer" class="dialog-footer">
            <el-button @click="AnimalAcceptDialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>

        <!-- 接收动物弹窗 -->
        <el-dialog title="接收" :visible.sync="acceptDialogVisible" width="400px">
          <el-form :model="acceptForm" :rules="acceptRules" ref="acceptForm" label-width="100px">
            <el-form-item label="合格证号" prop="qualificationNo">
              <el-input v-model="acceptForm.qualificationNo"></el-input>
            </el-form-item>
            
            <el-form-item label="许可证号" prop="licenseNo">
              <el-input v-model="acceptForm.licenseNo"></el-input>
            </el-form-item>
            
            <el-form-item label="用途" prop="purpose">
              <el-select v-model="acceptForm.purpose" placeholder="请选择用途">
                <el-option label="科研" value="科研"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="使用数量" prop="useCount">
              <el-input v-model.number="acceptForm.useCount" type="number"></el-input>
            </el-form-item>
            
            <el-form-item label="使用日期" prop="useDate">
              <el-date-picker v-model="acceptForm.useDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="开证日期" prop="certDate">
              <el-date-picker v-model="acceptForm.certDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            
            <el-form-item label="接收日期" prop="receiveDate">
              <el-date-picker v-model="acceptForm.receiveDate" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          
          <template #footer>
            <span>
              <el-button @click="acceptDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitAcceptForm">提交</el-button>
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
import store from '@/store';

export default {
  name: 'AniAccept',
  data() {
    return {
      dialogVisible: false,
      auditResult: null,
      description: '',
      currentRow: null,
      AnimalAcceptDialogVisible: false,
      selectedOrder: {},
      acceptCurrentStep: 0,
      acceptSteps: [
        { title: '待付款', description: '等待付款' },
        { title: '待课题组审核', description: '等待课题组审核' },
        { title: '待饲养管理员审核', description: '等待饲养管理员审核' },
        { title: '等待导入动物', description: '审批已完成' },
      ],
      animalAccept: [],
      acceptDialogVisible: false,
      acceptForm: {
        qualificationNo: '',
        licenseNo: 'SCXK (浙) 2019-0001',
        purpose: '科研',
        useCount: '',
        useDate: '',
        certDate: '',
        receiveDate: ''
      },
      acceptRules: {
        qualificationNo: [
          { required: true, message: '请输入合格证号', trigger: 'blur' }
        ],
        licenseNo: [
          { required: true, message: '请输入许可证号', trigger: 'blur' }
        ],
        purpose: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ],
        useCount: [
          { required: true, message: '请输入使用数量', trigger: 'blur' },
          { type: 'number', message: '使用数量必须为数字' }
        ],
        useDate: [
          { required: true, message: '请选择使用日期', trigger: 'change' }
        ],
        certDate: [
          { required: true, message: '请选择开证日期', trigger: 'change' }
        ],
        receiveDate: [
          { required: true, message: '请选择接收日期', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.getAnimalAccept();
  },
  methods: {
    acceptAnimal(row) {
      this.currentRow = row;
      this.acceptDialogVisible = true;
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
          return 'info'; // 等待接受动物
        default:
          return ''; // 默认
      }
    },
    async getAnimalAccept() {
      try {
        console.log('Fetching animal accept orders...');
        const res = await getAllFeedOrder_({});
        console.log('Raw response:', res);
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
              animals: item.animals || []
            };
          } catch (err) {
            console.error('Error fetching feed details:', err);
            return {
              ...item,
              animals: item.animals || []
            };
          }
        });

        const data = await Promise.all(promises);
        console.log('Processed animal accept orders:', data);
        this.animalAccept = data.map((item) => ({
          ...item,
          status_:
            item.status >= 0 ? this.acceptSteps[item.status].title : '审核不通过',
        }));
        console.log('Final animalAccept:', this.animalAccept);
      } catch (err) {
        console.error('Error fetching animal accept orders:', err);
        this.animalAccept = [];
      }
    },
    viewAnimalAcceptDetail(row) {
      this.selectedOrder = row;
      this.AnimalAcceptDialogVisible = true;
      this.acceptCurrentStep = row.status;
    },
    approveOrder(row) {
      this.currentRow = row;
      this.dialogVisible = true;
    },
    cancelOrder(row) {
      this.$confirm('确定要取消该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用取消订单的API
        this.$message({
          type: 'success',
          message: '取消成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    submitApproval() {
      if (!this.auditResult) {
        this.$message.warning('请选择审核结果');
        return;
      }
      // 调用审核API
      this.dialogVisible = false;
      this.$message.success('审核提交成功');
    },
    submitAcceptForm() {
      this.$refs.acceptForm.validate((valid) => {
        if (valid) {
          // TODO: 调用接收动物的API
          console.log('提交的表单数据:', this.acceptForm);
          this.$message.success('提交成功');
          this.acceptDialogVisible = false;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.accept-management {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.info-card {
  margin-bottom: 20px;
}

.progress-card {
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

.el-date-picker {
  width: 100%;
}
</style>
