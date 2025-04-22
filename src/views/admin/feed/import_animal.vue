<!-- 这是导入动物的模块 -->
<template>
  <div class="import-container">
    <el-steps :active="activeStep" finish-status="success" class="steps">
      <el-step title="基本信息"></el-step>
      <el-step title="动物信息"></el-step>
      <el-step title="完成导入"></el-step>
    </el-steps>

    <!-- 第一步：基本信息 -->
    <div v-show="activeStep === 0" class="step-form">
      <el-form :model="form" label-width="120px">
        <el-form-item label="订单编号">
          <el-input v-model="form.orderId" :disabled="true" style="width: 400px">
            <el-button slot="append" icon="el-icon-view" @click="viewOrderDetail"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="引入日期">
          <el-date-picker v-model="form.startTime" type="date" value-format="yyyy-MM-dd"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="动物类型">
          <el-select v-model="form.animalType" placeholder="请选择">
            <el-option v-for="item in animalTypes" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="动物品系">
          <el-input v-model="form.strain" style="width: 225px">
          </el-input>
        </el-form-item>

        <el-form-item label="供应商">
          <el-input v-model="form.supplier" style="width: 225px"></el-input>
        </el-form-item>

        <el-page-header @back="goBack" content="动物导入"></el-page-header>

        <el-card style="margin-top: 20px">
          <el-form :model="form1" label-width="120px" label-position="left">
            <!-- 导入方式选择 -->
            <el-form-item label="导入方式">
              <el-radio-group v-model="importType">
                <el-radio label="manual">手动导入</el-radio>
                <el-radio label="excel">Excel导入</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 手动导入模块 -->
            <div v-if="importType === 'manual'" class="manual-import">
              <el-form-item label="雌性数量">
                <el-input-number v-model="form1.femaleCount" :min="0" controls-position="right" placeholder="请输入雌性数量" />
              </el-form-item>

              <el-form-item label="雄性数量">
                <el-input-number v-model="form1.maleCount" :min="0" controls-position="right" placeholder="请输入雄性数量" />
              </el-form-item>
            </div>

            <!-- Excel导入模块 -->
            <div v-else class="excel-import">
              <el-form-item label="上传文件">
                <el-upload action="/api/upload" :limit="1" :file-list="form.fileList" accept=".xlsx,.xls">
                  <el-button type="primary">选择Excel文件</el-button>
                  <div slot="tip" class="el-upload__tip">
                    请上传.xls或.xlsx格式文件，模板文件<a href="/template.xlsx">下载模板</a>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </el-card>

        <div class="action-btns">
          <el-button type="primary" @click="handleNextStep">下一步</el-button>
        </div>
      </el-form>
    </div>

    <!-- 第二步：动物信息 -->
    <div v-show="activeStep === 1" class="step-form">
      <el-table :data="form.animals" border style="width: 100%" class="animal-info-table"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
        <el-table-column prop="strain" label="品系名称（复制）" width="180">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].strain" placeholder="请输入品系名称" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="gender" label="性别" width="100" align="center">
          <template slot-scope="{ row }">
            <!-- 雄性图标（蓝色♂） -->
            <i v-if="row.gender === '雄性'" class="el-icon-male" style="color: #409EFF; font-size: 18px;"></i>

            <!-- 雌性图标（红色♀） -->
            <i v-else-if="row.gender === '雌性'" class="el-icon-female" style="color: #F56C6C; font-size: 18px;"></i>

            <!-- 未知性别兜底 -->
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column prop="position" label="位置（复制）" width="180">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].position" placeholder="请输入位置" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="birthDate" label="出生日期（复制）" width="180">
          <template slot-scope="{ $index }">
            <el-date-picker v-model="form.animals[$index].birthDate" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期" size="small" style="width: 100%"></el-date-picker>
          </template>
        </el-table-column>

        <el-table-column prop="returnType" label="基因型（复制）" width="150">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].returnType" placeholder="请输入返回型" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="serialNumber" label="标号（填充）" width="120">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].serialNumber" placeholder="自动生成" size="small" disabled></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="generation" label="代数列名（复制）" width="150">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].generation" placeholder="请输入代数" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="color" label="毛色（复制）" width="120">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].color" placeholder="请输入毛色" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述（复制）">
          <template slot-scope="{ $index }">
            <el-input v-model="form.animals[$index].description" placeholder="请输入描述" size="small"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="{ $index }">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeAnimal($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="action-btns">
        <el-button @click="activeStep--">上一步</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <!-- 第三步：完成导入 -->
    <div v-show="activeStep === 2" class="success-info">
      <el-result icon="success" title="动物导入成功" sub-title="动物信息已成功录入系统">
        <template slot="extra">
          <el-button type="primary" @click="handleFinish">完成</el-button>
          <el-button type="success" @click="goToAnimalReceive" style="margin-left: 10px">前往动物接收</el-button>
        </template>
      </el-result>
    </div>

    <el-dialog title="订单详情" :visible.sync="detailVisible" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ currentOrder.id }}</el-descriptions-item>
        <el-descriptions-item label="动物类型">{{ getAnimalType1(currentOrder.animals) }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentOrder.start_time }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentOrder.end_time }}</el-descriptions-item>
      </el-descriptions>

      <div class="cage-info-card">
        <div class="cage-info-header">
          <i class="el-icon-office-building"></i>
          <span>笼位详细信息</span>
        </div>
        <div class="cage-info-content">
          <div class="cage-info-row">
            <div class="cage-info-item">
              <span class="label">校区：</span>
              <span class="value">{{ currentOrder.campus_name || '无' }}</span>
            </div>
            <div class="cage-info-item">
              <span class="label">楼宇：</span>
              <span class="value">{{ currentOrder.building_name || '无' }}</span>
            </div>
          </div>
          <div class="cage-info-row">
            <div class="cage-info-item">
              <span class="label">实验室：</span>
              <span class="value">{{ currentOrder.room_name || '无' }}</span>
            </div>
            <div class="cage-info-item">
              <span class="label">笼架ID：</span>
              <span class="value">{{ currentOrder.rack_id || '无' }}</span>
            </div>
          </div>
          <div class="cage-info-row">
            <div class="cage-info-item">
              <span class="label">笼位ID：</span>
              <span class="value">{{ currentOrder.cage_id || '无' }}</span>
            </div>
            <div class="cage-info-item">
              <span class="label">笼位编号：</span>
              <span class="value">{{ formatCageNumbers(currentOrder.cage_number) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get_a_FeedOrder } from '@/api/order'
import { getAnimalType } from '@/api/ani_setting'
import { animalImport } from '@/api/ani_manage'
import { checkFeedOrder } from '@/api/order'

export default {
  data() {
    return {
      importType: 'manual',//默认手动导入
      submitting: false,
      activeStep: 0,
      detailVisible: false,
      animalTypes: [],
      currentOrder: {},
      form1: {
        femaleCount: 5, //默认雌性数量
        maleCount: 5, //默认雄性数量
        fileList: [] //文件列表
      },
      form: {
        strain: '',
        orderId: '',
        startTime: '',
        animalType: '',
        supplier: '',
        animals: []
      }
    }
  },
  mounted() {
    this.loadOrderData();
  },
  created() {
    this.loadData()
  },
  methods: {
    formatCageNumbers(numbers) {
      if (!numbers || !numbers.length) return '无';
      if (numbers.length <= 3) {
        return numbers.join('、');
      }
      return `${numbers.slice(0, 3).join('、')}等${numbers.length}个笼位`;
    },

    //获取动物类型列表
    getAnimalType1(animals) {
      if (!animals || !animals.length) return '无';
      const types = [...new Set(animals.map(a => a.animal_type))];
      return types.join('、');
    },
    async loadOrderData() {
      try {
        const orderId = this.$route.query.id;
        if (!orderId) {
          console.log('未提供订单ID，跳过数据加载');
          return;
        }

        const res = await get_a_FeedOrder({ id: orderId })
        console.log('获得到的响应的订单数据:', res)

        // 设置动物类型、品系和供应商的默认值
        if (res.data && res.data.animals && res.data.animals.length > 0) {
          this.form.animalType = res.data.animals[0].animal_type
          this.form.strain = res.data.animals[0].name
          this.form.supplier = res.data.animals[0].supplier
        }

        //统计性别数量
        const counts = res.data.animals.reduce((acc, animal) => {
          if (animal.gender === '雄性') {
            acc.male += animal.count
          } else if (animal.gender === '雌性') {
            acc.female += animal.count
          }
          return acc;
        }, { male: 0, female: 0 });

        //更新表单数据
        this.form1 = {
          ...this.form1,
          femaleCount: counts.female,
          maleCount: counts.male,
          fileList: []
        };
      } catch (error) {
        console.error('数据加载失败:', error);
        // 不显示错误提示，静默处理
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    async loadData() {
      try {
        // 获取订单ID
        const orderId = this.$route.query.id;
        if (!orderId) {
          console.log('未提供订单ID，跳过数据加载');
          return;
        }

        // 根据id加载对应的订单数据
        const res = await get_a_FeedOrder({ id: orderId })
        console.log('获得到的响应的订单数据:', res)
        if (res.status === 1) {
          const orderData = res.data
          this.currentOrder = orderData
          this.form.orderId = orderData.id
          this.form.startTime = orderData.start_time
          this.form.animalType = orderData.animal_type
          // 设置笼位ID
          if (orderData.cage_id && orderData.cage_id.length > 0) {
            this.currentOrder.cage_id = orderData.cage_id[0]
          }
          // 映射旧数据到新结构
          this.form.animals = orderData.animals.map((animal, index) => ({
            strain: animal.name || '',
            gender: animal.gender,
            position: '',
            birthDate: animal.create_time.split(' ')[0],
            returnType: '',
            serialNumber: animal.serialNumber || `ANIMAL-${orderData.id}-${index.toString().padStart(3, '0')}`,
            generation: '',
            color: '',
            description: animal.description || ''
          }));
        }

        // 加载动物类型
        const typeRes = await getAnimalType()
        if (typeRes.status === 1) {
          this.animalTypes = typeRes.data
        }
      } catch (error) {
        console.error('数据加载失败:', error);
        // 不显示错误提示，静默处理
      }
    },

    handleNextStep() {
      if (this.activeStep === 0) {
        if (!this.form.startTime || !this.form.animalType) {
          this.$message.warning('请填写完整基本信息')
          return
        }
        //生成动物行数据
        this.generateAnimalRows();
      }
      this.activeStep++
    },

    //生成动物行信息
    generateAnimalRows() {
      const total = this.form1.femaleCount + this.form1.maleCount;
      const newAnimals = [];

      // 获取默认的品系和位置信息
      const defaultStrain = this.form.strain;
      const defaultPosition = this.currentOrder.cage_id ? this.currentOrder.cage_id.toString() : '';

      // 生成雌性数据
      for (let i = 0; i < this.form1.femaleCount; i++) {
        newAnimals.push(this.createAnimalObject('雌性', i + 1, defaultStrain, defaultPosition));
      }

      // 生成雄性数据
      for (let i = 0; i < this.form1.maleCount; i++) {
        newAnimals.push(this.createAnimalObject('雄性', this.form1.femaleCount + i + 1, defaultStrain, defaultPosition));
      }
      this.form.animals = newAnimals;
    },

    createAnimalObject(gender, index, defaultStrain, defaultPosition) {
      return {
        strain: defaultStrain,         // 品系名称（使用默认值）
        gender: gender,     // 性别（自动设置）
        position: defaultPosition,       // 位置（使用默认值）
        birthDate: '',      // 出生日期
        returnType: '',     // 返回型
        serialNumber: `ANIMAL-${this.form.orderId}-${index.toString().padStart(3, '0')}`, // 自动编号
        generation: '',     // 代数
        color: '',          // 毛色
        description: ''     // 描述
      };
    },


    viewOrderDetail() {
      this.detailVisible = true
    },

    removeAnimal(index) {
      this.form.animals.splice(index, 1)
    },

    async handleSubmit() {
      try {
        // 数据验证
        if (!this.form.animals || this.form.animals.length === 0) {
          this.$message.warning('请先添加动物信息');
          return;
        }

        // 构建提交数据
        const submitData = this.form.animals.map(animal => ({
          care_order_id: parseInt(this.form.orderId),
          type: this.form.animalType,
          supplier: this.form.supplier,
          gender: animal.gender === '雄性' ? '雄' : '雌',
          strain: animal.strain,
          birth_time: animal.birthDate,
          cage_id: parseInt(animal.position),
          genotype: animal.returnType || '无',
          description: animal.description || '无',  // 修复拼写错误
          color: animal.color || '无',
          number: animal.serialNumber
        }));

        // 调用导入接口
        const res = await animalImport(submitData);
        
        if (res.status === 1) {
          this.$message.success('动物信息导入成功');
          this.activeStep++; // 进入完成步骤
        } else {
          this.$message.error(res.msg || '导入失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败，请重试');
      }
    },

    handleFinish() {
      // 获取订单ID
      const orderId = this.$route.query.id;
      if (!orderId) {
        this.$message.error('未找到订单ID');
        return;
      }

      // 调用更新订单状态的API
      checkFeedOrder({
        id: orderId,
        status: 4, // 设置为"已经导入"状态
        info: '动物导入完成'
      }).then(res => {
        if (res.status === 1) {
          this.$message.success('订单状态更新成功');
          // 跳转到饲养繁育的饲养订单页面
          this.$router.push('/admin/feed/feed_apply');
        } else {
          this.$message.error(res.msg || '状态更新失败');
        }
      }).catch(error => {
        console.error('状态更新失败:', error);
        this.$message.error('状态更新失败，请重试');
      });
    },

    goToAnimalReceive() {
      // 跳转到动物接收模块
      this.$router.push({
        path: '/admin/feed/feed_apply',
        query: { tab: 'receive' }
      })
    }
  }
}
</script>

<style>
.import-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}


.manual-import {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.excel-import {
  margin-top: 20px;
}

.el-upload__tip {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
}

.el-input-number {
  width: 200px;
}

.steps {
  margin-bottom: 40px;
}

.step-form {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.action-btns {
  margin-top: 20px;
  text-align: center;
}

.success-info {
  text-align: center;
  padding: 40px 0;
}

.el-input-group__append .el-button {
  padding: 12px;
}

.cage-info-card {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.cage-info-header {
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.cage-info-header i {
  margin-right: 8px;
  color: #409eff;
}

.cage-info-content {
  padding: 15px;
}

.cage-info-row {
  display: flex;
  margin-bottom: 12px;
}

.cage-info-row:last-child {
  margin-bottom: 0;
}

.cage-info-item {
  flex: 1;
  display: flex;
  min-width: 0;
}

.cage-info-item .label {
  color: #909399;
  min-width: 80px;
  text-align: right;
  margin-right: 10px;
}

.cage-info-item .value {
  color: #606266;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 保留原有样式，新增以下内容 */
.step-form {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.animal-info-table ::v-deep .cell {
  padding: 8px 12px !important;
}

.animal-info-table ::v-deep .el-table__row:hover {
  background-color: #fafafa;
}
</style>