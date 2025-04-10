<template>
  <div class="app-container">
    <!-- 搜索区域 - 可折叠 -->
    <el-collapse v-model="activeCollapse" class="custom-collapse">
      <el-collapse-item name="search">
        <template slot="title">
          <div class="collapse-header">
            <span class="search-title">搜索选项</span>
            <i class="el-icon-arrow-down collapse-icon"></i>
          </div>
        </template>
        
        <el-form :model="searchForm" ref="searchForm" :inline="true" class="search-form">
          <!-- 第一行 -->
          <div class="form-row">
            <el-form-item label="动物ID">
              <el-input v-model="searchForm.animalId" placeholder="" style="width: 200px"></el-input>
            </el-form-item>
          </div>

          <!-- 第二行 -->
          <div class="form-row">
            <el-form-item label="笼位ID">
              <el-input v-model="searchForm.cageId" placeholder="" style="width: 200px"></el-input>
            </el-form-item>
          </div>

          <!-- 第三行 -->
          <div class="form-row">
            <el-form-item label="动物类型">
              <el-select 
                v-model="searchForm.animalType" 
                placeholder="请选择动物类型" 
                style="width: 120px"
                :loading="loading">
                <el-option
                  v-for="item in animalTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否是明系" style="margin-left: 40px">
              <el-select v-model="searchForm.isOpenSystem" placeholder="" style="width: 120px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item> -->
          </div>

          <!-- 第四行 -->
          <div class="form-row">
            <el-form-item label="状态标识" class="status-row">
              <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 200px">
                <el-option
                  v-for="item in animalStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 第五行 -->
          <div class="form-row">
            <el-form-item label="品系全称">
              <el-select v-model="searchForm.strainFullName" placeholder="请选择品系" style="width: 200px">
                <el-option
                  v-for="item in strainOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 第六行 -->
          <div class="form-row">
            <el-form-item label="性别">
              <el-select v-model="searchForm.gender" placeholder="" style="width: 120px">
                <el-option label="雄" value="雄"></el-option>
                <el-option label="雌" value="雌"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="周龄" style="margin-left: 40px">
              <el-input v-model="searchForm.weekAge" style="width: 80px"></el-input>
            </el-form-item>
          </div>

          <!-- 第七行 -->
          <div class="form-row">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="searchForm.birthDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder=""
                end-placeholder=""
                style="width: 360px">
              </el-date-picker>
            </el-form-item>
          </div>

          <!-- 第八行 -->
          <div class="form-row">
            <el-form-item label="死亡时间">
              <el-date-picker
                v-model="searchForm.deathDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder=""
                end-placeholder=""
                style="width: 360px">
              </el-date-picker>
            </el-form-item>
          </div>

          <!-- 第九行 -->
          <div class="form-row">
            <el-form-item label="描述">
              <el-input v-model="searchForm.description" placeholder="" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="毛色" style="margin-left: 40px">
              <el-select v-model="searchForm.furColor" placeholder="" style="width: 120px">
                <el-option
                  v-for="color in furColorOptions"
                  :key="color.value"
                  :label="color.label"
                  :value="color.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 第十行 -->
          <div class="form-row">
            <el-form-item label="所有者">
              <el-input v-model="searchForm.owner" placeholder="" style="width: 200px">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <el-checkbox v-model="searchForm.onlyMyAnimals" style="margin-left: 10px">仅展示我的动物</el-checkbox>
            </el-form-item>
          </div>

          <!-- 搜索按钮 -->
          <div class="form-row">
            <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
            <el-button type="default" class="reset-btn" @click="resetSearch">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>

      <!-- 搜索结果区域 - 可折叠 -->
      <el-collapse-item name="result" v-if="hasSearched">
        <template slot="title">
          <div class="collapse-header">
            <span class="search-title">搜索结果</span>
            <span class="result-count">共 {{ pagination.total }} 条记录</span>
            <i class="el-icon-arrow-down collapse-icon"></i>
          </div>
        </template>

        <!-- 功能按钮区域 -->
        <div class="operation-section">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-delete" plain @click="handleExecute">处死</el-button>
            <el-button type="primary" icon="el-icon-edit" plain @click="handleEdit">编辑</el-button>
            <el-button type="primary" icon="el-icon-share" plain>移笼/分笼</el-button>
            <el-button type="primary" icon="el-icon-setting" plain>基础设置</el-button>
            <el-button type="primary" icon="el-icon-edit" plain @click="handleStatusChange">修改状态</el-button>
            <el-button type="primary" icon="el-icon-connection" plain @click="handleBreeding">配繁</el-button>
            <el-button type="primary" icon="el-icon-data-line" plain @click="handleMeasurement">测量数据</el-button>
            <el-button type="primary" icon="el-icon-document-add" plain @click="handleWorkOrder">提交工单</el-button>
            <el-button type="primary" icon="el-icon-first-aid-kit" plain @click="handleTreatment">生物治疗</el-button>
          </div>
        </div>

        <!-- 表格区域 -->
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="animalId" label="动物ID" width="120"></el-table-column>
          <el-table-column prop="animalType" label="动物类型" width="100"></el-table-column>
          <el-table-column prop="strainName" label="品系名称" width="150"></el-table-column>
          <el-table-column prop="cageId" label="笼位ID" width="150"></el-table-column>
          <!-- 添加笼盒名称列 -->
          <el-table-column prop="cageBoxName" label="笼盒名称" width="120"></el-table-column>
          <!-- 修改性别列，使用图标代替文字 -->
          <el-table-column label="性别" width="80">
            <template slot-scope="scope">
              <i v-if="scope.row.gender === '雄'" class="el-icon-male gender-icon male-icon" title="雄性"></i>
              <i v-else-if="scope.row.gender === '雌'" class="el-icon-female gender-icon female-icon" title="雌性"></i>
              <span v-else>{{ scope.row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthDate" label="出生日期" width="120"></el-table-column>
          <el-table-column prop="weekAge" label="周龄" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="120"></el-table-column>
          <el-table-column prop="owner" label="所有者" width="120"></el-table-column>
          <el-table-column prop="color" label="毛色" width="100"></el-table-column>
          <el-table-column prop="experimentalStatus" label="实验状态" width="120"></el-table-column>
          <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
        </el-table>

        <!-- 处死弹窗 -->
        <el-dialog
          title="处死"
          :visible.sync="executeDialogVisible"
          width="500px"
          :close-on-click-modal="false"
          @close="handleExecuteDialogClose">
          <el-form :model="executeForm" ref="executeForm" :rules="executeRules" label-width="100px">
            <el-form-item label="处死原因" prop="reason">
              <el-select v-model="executeForm.reason" placeholder="请选择处死原因" style="width: 100%">
                <el-option
                  v-for="item in deathReasonOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="死亡时间" prop="died_time">
              <el-date-picker
                v-model="executeForm.died_time"
                type="datetime"
                placeholder="选择死亡时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="executeForm.remark"
                :rows="4"
                placeholder="请输入备注信息">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="executeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmExecute" :loading="executeLoading">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog
          title="编辑动物信息"
          :visible.sync="editDialogVisible"
          width="800px"
          :close-on-click-modal="false"
          @close="handleEditDialogClose">
          <div class="edit-table-container">
            <el-table 
              :data="editTableData" 
              border 
              style="width: 100%"
              :row-class-name="editTableRowClassName">
              <el-table-column label="动物类型" prop="animalType" width="120">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.animalType" placeholder="请选择">
                    <el-option
                      v-for="item in animalTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="品系ID" prop="strainId" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.strainId"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="性别" prop="gender" width="100">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.gender" placeholder="请选择">
                    <el-option label="雄" value="雄"></el-option>
                    <el-option label="雌" value="雌"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="出生日期" prop="birthDate" width="180">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.birthDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="代数别名" prop="number" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.number"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="毛色" prop="color" width="120">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.color" placeholder="请选择">
                    <el-option label="黑色" value="黑色"></el-option>
                    <el-option label="白色" value="白色"></el-option>
                    <el-option label="灰色" value="灰色"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="描述" prop="description">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.description" type="textarea" :rows="2"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit" :loading="editLoading">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 修改状态弹窗 -->
        <el-dialog
          title="修改状态"
          :visible.sync="statusDialogVisible"
          width="400px"
          :close-on-click-modal="false"
          @close="handleStatusDialogClose">
          <el-form :model="statusForm" ref="statusForm" label-width="100px">
            <el-form-item label="动物状态">
              <el-select v-model="statusForm.status" placeholder="不修改" style="width: 100%">
                <el-option
                  v-for="item in animalStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实验状态">
              <el-select v-model="statusForm.experimentalStatus" placeholder="不修改" style="width: 100%">
                <el-option label="不修改" value=""></el-option>
                <el-option label="实验结束" value="实验结束"></el-option>
                <el-option label="实验中" value="实验中"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="statusDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmStatusChange" :loading="statusLoading">提 交</el-button>
          </div>
        </el-dialog>

        <!-- 测量数据弹窗 -->
        <el-dialog
          title="测量数据"
          :visible.sync="measureDialogVisible"
          width="900px"
          :close-on-click-modal="false"
          @close="handleMeasureDialogClose">
          <el-table :data="measureTableData" border style="width: 100%">
            <el-table-column label="动物ID" prop="animalId" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.animalId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="标号" prop="number" width="120">
              <template>
                <span>-</span>
              </template>
            </el-table-column>
            <el-table-column label="测量时间" width="220">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.surveyTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="体重" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weightData" placeholder="请输入">
                  <template slot="append">g</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="肛温" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.temperatureData" placeholder="请输入">
                  <template slot="append">℃</template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="measureDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitMeasure" :loading="measureLoading">提 交</el-button>
          </div>
        </el-dialog>

        <!-- 生物治疗弹窗 -->
        <el-dialog
          title="生物治疗"
          :visible.sync="treatmentDialogVisible"
          width="500px"
          :close-on-click-modal="false"
          @close="handleTreatmentDialogClose">
          <el-form :model="treatmentForm" label-width="100px">
            <el-form-item label="疾病类型">
              <el-select v-model="treatmentForm.disease_id" placeholder="请选择疾病类型" style="width: 100%">
                <el-option
                  v-for="item in diseaseTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="治疗方案">
              <el-select v-model="treatmentForm.treatment_id" placeholder="请选择治疗方案" style="width: 100%">
                <el-option
                  v-for="item in treatmentPlanOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                v-model="treatmentForm.description"
                :rows="4"
                placeholder="请输入描述信息">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="treatmentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitTreatment" :loading="treatmentLoading">提 交</el-button>
          </div>
        </el-dialog>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getAnimalType, getAnimalStrain, getAnimalDeathReason, getAnimalDiseaseType, getTreatmentPlan } from '@/api/ani_setting'
import { getAnimalStatus, getAnimalManage, animalDeath, animalManageEdit, updateAnimalStatus2, submitMeasureData, diseaseTreatment } from '@/api/ani_manage'

export default {
  name: 'AnimalManage',
  data() {
    return {
      loading: false,
      tableData: [],
      animalTypeOptions: [],
      animalStatusOptions: [],
      strainOptions: [],
      // 分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        animalId: '',
        cageId: '',
        animalType: '',
        isOpenSystem: '',
        status: '',
        strainFullName: '',
        gender: '',
        weekAge: '',
        birthDateRange: [],
        deathDateRange: [],
        description: '',
        furColor: '',
        owner: '',
        onlyMyAnimals: false
      },
      furColorOptions: [
        { label: '黑色', value: 'black' },
        { label: '白色', value: 'white' },
        { label: '灰色', value: 'gray' }
      ],
      // 折叠面板控制
      activeCollapse: ['search'],
      // 是否已搜索
      hasSearched: false,
      // 处死弹窗相关数据
      executeDialogVisible: false,
      executeLoading: false,
      executeForm: {
        id: [],
        died_time: new Date().toISOString().split('T')[0] + ' 00:00:00',
        reason: '',
        description: ''
      },
      executeRules: {
        reason: [
          { required: true, message: '请选择处死原因', trigger: 'change' }
        ],
        died_time: [
          { required: true, message: '请选择死亡时间', trigger: 'change' }
        ]
      },
      deathReasonOptions: [],
      selectedRows: [], // 存储选中的行
      // 编辑弹窗相关数据
      editDialogVisible: false,
      editLoading: false,
      editTableData: [],
      // 修改状态弹窗相关数据
      statusDialogVisible: false,
      statusLoading: false,
      statusForm: {
        id: [],
        status: '',
        experimentalStatus: ''
      },
      // 测量数据弹窗相关数据
      measureDialogVisible: false,
      measureLoading: false,
      measureTableData: [], // 表格数据
      // 生物治疗弹窗相关数据
      treatmentDialogVisible: false,
      treatmentLoading: false,
      treatmentForm: {
        disease_id: '',
        treatment_id: '',
        description: '',
        animal_id: '',
        cage_id: ''
      },
      diseaseTypeOptions: [], // 疾病类型选项
      treatmentPlanOptions: [], // 治疗方案选项
    }
  },
  created() {
    this.getAnimalTypeList()
    this.getAnimalStatusList()
    this.getStrainList()
    this.getDeathReasonList() // 添加获取处死原因列表
    this.getDiseaseTypeList()
    this.getTreatmentPlanList()
  },
  methods: {
    // 获取动物列表
    async getAnimalList() {
      this.loading = true
      try {
        const params = {
          id: this.searchForm.animalId || '',
          // 修改这里，确保动物类型参数正确传递为type
          type: this.searchForm.animalType || '',
          gender: this.searchForm.gender || '',
          cage_id: this.searchForm.cageId || '',
          status: this.searchForm.status || '',
          strain: this.searchForm.strainFullName || '',
          birth_time: this.searchForm.birthDateRange && this.searchForm.birthDateRange.length > 0 
            ? this.searchForm.birthDateRange[0] 
            : '',
          died_time: this.searchForm.deathDateRange && this.searchForm.deathDateRange.length > 0 
            ? this.searchForm.deathDateRange[0] 
            : '',
          description: this.searchForm.description || '',
          user_id: this.searchForm.owner || '',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }

        const res = await getAnimalManage(params)
        if (res && res.data) {
          // 按笼位ID对数据进行分组和排序
          const records = res.data.records
          const groupedData = []
          let currentCageId = null

          // 对数据按笼位ID排序
          records.sort((a, b) => {
            if (a.cage_id === b.cage_id) {
              return a.id - b.id
            }
            return a.cage_id - b.cage_id
          })

          // 添加数据和空行
          records.forEach((item, index) => {
            if (currentCageId !== null && currentCageId !== item.cage_id) {
              // 添加空行
              groupedData.push({
                animalId: '',
                isEmptyRow: true
              })
            }
            currentCageId = item.cage_id

            groupedData.push({
              animalId: item.id,
              // 添加动物类型字段
              animalType: item.type,
              cageId: item.cage_id,
              // 添加笼盒名称字段
              cageBoxName: item.cage_box_name,
              strainName: item.strain,
              gender: item.gender,
              birthDate: item.birth_time,
              weekAge: this.calculateWeekAge(item.birth_time),
              status: item.status,
              // 修改所有者字段来源为user_name
              owner: item.user_name,
              color: item.color,
              description: item.description,
              experimentalStatus: item.experimental_status,
              isEmptyRow: false
            })
          })

          this.tableData = groupedData
          this.pagination.total = res.data.total
          
          // 标记已搜索
          this.hasSearched = true
          
          // 如果结果面板未打开，则打开
          if (!this.activeCollapse.includes('result')) {
            this.activeCollapse.push('result')
          }
        } else {
          this.$message.warning('获取动物列表数据为空')
          this.tableData = []
          this.pagination.total = 0
          this.hasSearched = true
        }
      } catch (error) {
        console.error('获取动物列表失败:', error)
        this.$message.error('获取动物列表失败')
        this.tableData = []
        this.pagination.total = 0
      } finally {
        this.loading = false
      }
    },

    // 计算周龄
    calculateWeekAge(birthTime) {
      if (!birthTime) return ''
      const birth = new Date(birthTime)
      const now = new Date()
      const diffTime = Math.abs(now - birth)
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
      return diffWeeks
    },

    // 处理搜索
    handleSearch() {
      this.pagination.pageNo = 1
      this.getAnimalList()
    },
    
    // 重置搜索
    resetSearch() {
      this.$refs.searchForm.resetFields()
      this.searchForm = {
        animalId: '',
        cageId: '',
        animalType: '',
        isOpenSystem: '',
        status: '',
        strainFullName: '',
        gender: '',
        weekAge: '',
        birthDateRange: [],
        deathDateRange: [],
        description: '',
        furColor: '',
        owner: '',
        onlyMyAnimals: false
      }
    },

    // 处理分页变化
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getAnimalList()
    },

    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.getAnimalList()
    },

    // 处理表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },

    async getAnimalTypeList() {
      this.loading = true
      try {
        const res = await getAnimalType()
        if (res && res.data) {
          // 修改这里，使用动物类型名称作为value值，而不是ID
          this.animalTypeOptions = res.data.map(item => ({
            label: item.name || item.typeName,
            // 使用名称作为value，而不是ID
            value: item.name || item.typeName
          }))
          console.log('动物类型选项:', this.animalTypeOptions)
        } else {
          this.$message.warning('获取动物类型数据为空')
          this.animalTypeOptions = []
        }
      } catch (error) {
        console.error('获取动物类型失败:', error)
        this.$message.error('获取动物类型失败')
        this.animalTypeOptions = []
      } finally {
        this.loading = false
      }
    },
    async getAnimalStatusList() {
      try {
        const res = await getAnimalStatus()
        if (res && res.data) {
          this.animalStatusOptions = res.data.map(item => ({
            label: item.name || item.statusName,
            value: item.status || item.name
          }))
        } else {
          this.$message.warning('获取动物状态数据为空')
          this.animalStatusOptions = []
        }
      } catch (error) {
        console.error('获取动物状态失败:', error)
        this.$message.error('获取动物状态失败')
        this.animalStatusOptions = []
      }
    },
    async getStrainList() {
      try {
        const res = await getAnimalStrain({ 
          pageNo: 1,
          pageSize: 999 
        })
        if (res && res.data && res.data.records) {
          this.strainOptions = res.data.records.map(item => ({
            label: item.strain_name,
            value: item.strain_name
          }))
        } else {
          this.$message.warning('获取品系数据为空')
          this.strainOptions = []
        }
      } catch (error) {
        console.error('获取品系失败:', error)
        this.$message.error('获取品系失败')
        this.strainOptions = []
      }
    },
    // 获取处死原因列表
    async getDeathReasonList() {
      try {
        const res = await getAnimalDeathReason()
        if (res && res.data) {
          this.deathReasonOptions = res.data
        } else {
          this.$message.warning('获取处死原因数据为空')
          this.deathReasonOptions = []
        }
      } catch (error) {
        console.error('获取处死原因失败:', error)
        this.$message.error('获取处死原因失败')
        this.deathReasonOptions = []
      }
    },
    // 设置行的类名
    tableRowClassName({ row }) {
      if (row.isEmptyRow) {
        return 'empty-row'
      }
      return row.gender === '雄' ? 'male-row' : row.gender === '雌' ? 'female-row' : ''
    },

    // 设置单元格样式
    cellStyle({ row }) {
      if (row.isEmptyRow) {
        return {
          padding: '0',
          height: '12px'
        }
      }
      return {}
    },

    // 处理处死按钮点击
    handleExecute() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要处死的动物')
        return
      }

      // 初始化表单，获取所有选中动物的ID
      this.executeForm = {
        id: this.selectedRows.map(row => row.animalId),
        died_time: new Date().toISOString().split('T')[0] + ' 00:00:00',
        reason: '',
        description: ''
      }
      
      this.executeDialogVisible = true
    },

    // 处理处死弹窗关闭
    handleExecuteDialogClose() {
      this.$refs.executeForm.resetFields()
      this.executeForm = {
        id: [],
        died_time: new Date().toISOString().split('T')[0] + ' 00:00:00',
        reason: '',
        description: ''
      }
    },

    // 确认处死
    confirmExecute() {
      this.$refs.executeForm.validate(async valid => {
        if (!valid) return
        
        if (this.executeForm.id.length === 0) {
          this.$message.warning('请选择需要处死的动物')
          return
        }

        this.executeLoading = true
        try {
          // 获取选中的处死原因名称
          const selectedReason = this.deathReasonOptions.find(item => item.id === this.executeForm.reason)
          
          const params = {
            id: this.executeForm.id,
            died_time: this.executeForm.died_time,
            reason: selectedReason ? selectedReason.name : '',
            description: this.executeForm.description || ''
          }

          await animalDeath(params)
          
          this.$message.success('处死操作成功')
          this.executeDialogVisible = false
          this.getAnimalList() // 刷新列表
          this.$refs.table.clearSelection()
          this.selectedRows = []
        } catch (error) {
          console.error('处死操作失败:', error)
          this.$message.error(error.message || '处死操作失败')
        } finally {
          this.executeLoading = false
        }
      })
    },

    // 编辑表格行样式
    editTableRowClassName({ row }) {
      return row.gender === '雄' ? 'male-row' : row.gender === '雌' ? 'female-row' : ''
    },

    // 处理编辑按钮点击
    handleEdit() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要编辑的动物')
        return
      }
      
      // 将选中的行数据复制到编辑表格中
      this.editTableData = this.selectedRows.map(row => ({
        id: row.animalId,
        animalType: row.animalType,
        strainId: row.strainName,
        gender: row.gender,
        birthDate: row.birthDate,
        number: row.line, // 将line映射到number字段
        color: row.color,
        description: row.description
      }))
      
      this.editDialogVisible = true
    },

    // 处理编辑弹窗关闭
    handleEditDialogClose() {
      this.editTableData = []
    },

    // 确认编辑
    async confirmEdit() {
      this.editLoading = true
      try {
        // 构造更新数据
        const updateData = this.editTableData.map(row => {
          const changes = {}
          changes.id = row.id
          
          // 只包含已修改的字段
          if (row.color !== undefined) changes.color = row.color
          if (row.number !== undefined) changes.number = row.number
          if (row.description !== undefined) changes.description = row.description
          if (row.birthDate !== undefined) changes.birth_time = row.birthDate
          if (row.gender !== undefined) changes.gender = row.gender
          if (row.strainId !== undefined) changes.strain_id = row.strainId
          if (row.animalType !== undefined) changes.type = row.animalType
          
          return changes
        })

        await animalManageEdit(updateData)
        this.$message.success('编辑成功')
        this.editDialogVisible = false
        this.getAnimalList() // 刷新列表
        this.$refs.table.clearSelection()
      } catch (error) {
        console.error('编辑失败:', error)
        this.$message.error(error.message || '编辑失败')
      } finally {
        this.editLoading = false
      }
    },

    // 处理修改状态按钮点击
    handleStatusChange() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要修改状态的动物')
        return
      }

      // 初始化状态表单，获取所有选中动物的ID
      this.statusForm = {
        id: this.selectedRows.map(row => row.animalId),
        status: '',
        experimentalStatus: ''
      }
      
      this.statusDialogVisible = true
    },

    // 处理状态弹窗关闭
    handleStatusDialogClose() {
      this.statusForm = {
        id: [],
        status: '',
        experimentalStatus: ''
      }
    },

    // 确认修改状态
    async confirmStatusChange() {
      if (!this.statusForm.status && !this.statusForm.experimentalStatus) {
        this.$message.warning('请至少选择一项要修改的状态')
        return
      }

      if (this.statusForm.id.length === 0) {
        this.$message.warning('请选择需要修改状态的动物')
        return
      }

      this.statusLoading = true
      try {
        const params = {
          id: this.statusForm.id
        }
        if (this.statusForm.status) {
          params.status = this.statusForm.status
        }
        if (this.statusForm.experimentalStatus) {
          params.experimental_status = this.statusForm.experimentalStatus
        }

        await updateAnimalStatus2(params)
        this.$message.success('状态修改成功')
        this.statusDialogVisible = false
        this.getAnimalList() // 刷新列表
        this.$refs.table.clearSelection()
      } catch (error) {
        console.error('状态修改失败:', error)
        this.$message.error(error.message || '状态修改失败')
      } finally {
        this.statusLoading = false
      }
    },

    // 处理配繁按钮点击
    handleBreeding() {
      // TODO: 实现配繁功能
      this.$message.info('配繁功能开发中...')
    },

    // 处理测量数据按钮点击
    handleMeasurement() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要测量的动物')
        return
      }

      // 初始化测量数据表格
      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      this.measureTableData = this.selectedRows.map(row => ({
        animalId: row.animalId,
        surveyTime: currentTime,
        weightData: '', // 体重数据
        temperatureData: '' // 肛温数据
      }))
      
      this.measureDialogVisible = true
    },

    // 处理测量数据弹窗关闭
    handleMeasureDialogClose() {
      this.measureTableData = []
    },

    // 提交测量数据
    async submitMeasure() {
      const submitData = []
      
      // 遍历每个动物的数据
      for (const row of this.measureTableData) {
        // 如果填写了体重，添加体重记录
        if (row.weightData) {
          submitData.push({
            animal_id: row.animalId,
            survey_time: row.surveyTime,
            survey_type: '体重',
            survey_data: row.weightData
          })
        }
        
        // 如果填写了肛温，添加肛温记录
        if (row.temperatureData) {
          submitData.push({
            animal_id: row.animalId,
            survey_time: row.surveyTime,
            survey_type: '体温',
            survey_data: row.temperatureData
          })
        }
      }

      // 验证是否有数据需要提交
      if (submitData.length === 0) {
        this.$message.warning('请至少填写一项测量数据')
        return
      }

      this.measureLoading = true
      try {
        await submitMeasureData(submitData)
        this.$message.success('测量数据提交成功')
        this.measureDialogVisible = false
        this.getAnimalList() // 刷新列表
        this.$refs.table.clearSelection()
      } catch (error) {
        console.error('测量数据提交失败:', error)
        this.$message.error(error.message || '测量数据提交失败')
      } finally {
        this.measureLoading = false
      }
    },

    // 处理提交工单按钮点击
    handleWorkOrder() {
      // TODO: 实现提交工单功能
      this.$message.info('提交工单功能开发中...')
    },

    // 获取疾病类型列表
    async getDiseaseTypeList() {
      try {
        const res = await getAnimalDiseaseType()
        if (res && res.data) {
          this.diseaseTypeOptions = res.data.map(item => ({
            label: item.name,
            value: item.id
          }))
        }
      } catch (error) {
        console.error('获取疾病类型失败:', error)
        this.$message.error('获取疾病类型失败')
      }
    },

    // 获取治疗方案列表
    async getTreatmentPlanList() {
      try {
        const res = await getTreatmentPlan()
        if (res && res.data) {
          this.treatmentPlanOptions = res.data.map(item => ({
            label: item.medicine,
            value: item.id
          }))
        }
      } catch (error) {
        console.error('获取治疗方案失败:', error)
        this.$message.error('获取治疗方案失败')
      }
    },

    // 处理生物治疗按钮点击
    async handleTreatment() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要治疗的动物')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.warning('一次只能治疗一个动物')
        return
      }

      // 获取选中的动物信息
      const selectedAnimal = this.selectedRows[0]
      
      // 初始化表单数据
      this.treatmentForm = {
        disease_id: '',
        treatment_id: '',
        description: '',
        animal_id: selectedAnimal.animalId,
        cage_id: selectedAnimal.cageId
      }

      // 获取疾病类型和治疗方案
      await this.getDiseaseTypeList()
      await this.getTreatmentPlanList()
      
      this.treatmentDialogVisible = true
    },

    // 处理生物治疗弹窗关闭
    handleTreatmentDialogClose() {
      this.treatmentForm = {
        disease_id: '',
        treatment_id: '',
        description: '',
        animal_id: '',
        cage_id: ''
      }
    },

    // 提交生物治疗
    async submitTreatment() {
      if (!this.treatmentForm.disease_id) {
        this.$message.warning('请选择疾病类型')
        return
      }
      if (!this.treatmentForm.treatment_id) {
        this.$message.warning('请选择治疗方案')
        return
      }

      this.treatmentLoading = true
      try {
        await diseaseTreatment(this.treatmentForm)
        this.$message.success('治疗记录提交成功')
        this.treatmentDialogVisible = false
        this.getAnimalList() // 刷新列表
        this.$refs.table.clearSelection()
      } catch (error) {
        console.error('治疗记录提交失败:', error)
        this.$message.error(error.message || '治疗记录提交失败')
      } finally {
        this.treatmentLoading = false
      }
    },
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
}

/* 性别图标样式 */
.gender-icon {
  font-size: 18px;
  font-weight: bold;
}

.male-icon {
  color: #409EFF;
}

.female-icon {
  color: #F56C6C;
}

/* 折叠面板样式 */
.custom-collapse {
  margin-bottom: 20px;
}

.collapse-header {
  display: flex;
  align-items: center;
}

.search-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  flex: 1;
}

.result-count {
  margin-right: 15px;
  color: #409EFF;
  font-size: 13px;
}

.collapse-icon {
  margin-left: 10px;
  transition: transform 0.3s;
}

/* 搜索区域样式 */
.search-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.search-form .form-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
}

.search-form .el-form-item__label {
  color: #606266;
  padding-right: 12px;
  width: 80px !important;
}

.status-row .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.status-row .no-status {
  color: #f56c6c;
}

.search-btn {
  background-color: #ff9b51;
  border-color: #ff9b51;
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 80px;
}

.search-btn:hover {
  background-color: #ff8838;
  border-color: #ff8838;
}

.reset-btn {
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-left: 10px;
}

.operation-section {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
}

.operation-section .button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.operation-section .el-button {
  padding: 8px 15px;
  font-size: 12px;
  border-radius: 4px;
}

.operation-section .el-button [class^="el-icon-"] {
  margin-right: 5px;
}

.el-table {
  background-color: #fff;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 4px;
}

/* 表格样式 */
::v-deep .male-row {
  background-color: #e6f1fc !important;
}

::v-deep .female-row {
  background-color: #fde9f2 !important;
}

::v-deep .empty-row {
  background-color: #ffffff !important;
  height: 12px !important;
}

::v-deep .empty-row td {
  padding: 0 !important;
  height: 12px !important;
  border: none !important;
}

::v-deep .el-table__row:hover > td {
  background-color: #f5f7fa !important;
}

/* 折叠面板自定义样式 */
::v-deep .el-collapse {
  border: none;
}

::v-deep .el-collapse-item__header {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  font-size: 16px;
  border: none;
  margin-bottom: 10px;
}

::v-deep .el-collapse-item__content {
  padding: 0;
  background-color: #fff;
  border-radius: 4px;
}

::v-deep .el-collapse-item.is-active .el-collapse-item__header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

::v-deep .el-collapse-item.is-active .collapse-icon {
  transform: rotate(180deg);
}

/* 处死弹窗样式 */
.dialog-footer {
  text-align: right;
}

::v-deep .el-dialog__body {
  padding: 20px 30px;
}

.edit-table-container {
  margin: -20px;
}

.edit-table-container .el-select {
  width: 100%;
}

.edit-table-container .el-date-picker {
  width: 100%;
}

.edit-table-container .el-input {
  width: 100%;
}

::v-deep .edit-table-container .el-table td {
  padding: 5px;
}

/* 编辑表格行样式 */
::v-deep .edit-table-container .male-row {
  background-color: #e6f1fc !important;
}

::v-deep .edit-table-container .female-row {
  background-color: #fde9f2 !important;
}

::v-deep .edit-table-container .el-table__row:hover > td {
  background-color: #f5f7fa !important;
}

/* 修改状态弹窗样式 */
.status-dialog .el-select {
  width: 100%;
}

/* 测量数据弹窗样式 */
.measure-dialog .el-input {
  width: 100%;
}

::v-deep .measure-dialog .el-table .el-input.is-disabled .el-input__inner {
  color: #606266;
}

::v-deep .measure-dialog .el-table {
  margin-bottom: 20px;
}

::v-deep .measure-dialog .el-table--border {
  border-right: 1px solid #EBEEF5;
}

/* 根据性别设置行背景色 */
::v-deep .measure-dialog .male-row {
  background-color: #e6f1fc !important;
}

::v-deep .measure-dialog .female-row {
  background-color: #fde9f2 !important;
}
</style>
