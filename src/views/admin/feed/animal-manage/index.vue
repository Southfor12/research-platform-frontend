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
            <el-button type="primary" icon="el-icon-edit" plain>编辑</el-button>
            <el-button type="primary" icon="el-icon-share" plain>移笼/分笼</el-button>
            <el-button type="primary" icon="el-icon-setting" plain>基础设置</el-button>
            <el-button type="primary" icon="el-icon-edit" plain>修改状态</el-button>
            <el-button type="primary" icon="el-icon-document" plain>病历记录</el-button>
            <el-button type="primary" icon="el-icon-first-aid-kit" plain>生物治疗</el-button>
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
import { getAnimalType, getAnimalStrain, getAnimalDeathReason } from '@/api/ani_setting'
import { getAnimalStatus, getAnimalManage, animalDeath } from '@/api/ani_manage'

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
        reason: '',
        remark: '',
        died_time: new Date().toISOString().split('T')[0] + ' 00:00:00'
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
    }
  },
  created() {
    this.getAnimalTypeList()
    this.getAnimalStatusList()
    this.getStrainList()
    this.getDeathReasonList() // 添加获取处死原因列表
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
      if (this.selectedRows.length > 1) {
        this.$message.warning('一次只能处死一个动物')
        return
      }
      this.executeDialogVisible = true
    },

    // 处理处死弹窗关闭
    handleExecuteDialogClose() {
      this.$refs.executeForm.resetFields()
      this.executeForm = {
        reason: '',
        remark: '',
        died_time: new Date().toISOString().split('T')[0] + ' 00:00:00'
      }
    },

    // 确认处死
    confirmExecute() {
      this.$refs.executeForm.validate(async valid => {
        if (!valid) return
        
        if (this.selectedRows.length !== 1) {
          this.$message.warning('请选择一个动物进行处死操作')
          return
        }

        this.executeLoading = true
        try {
          // 获取选中的动物ID
          const animalId = this.selectedRows[0].animalId

          // 获取选中的处死原因名称
          const selectedReason = this.deathReasonOptions.find(item => item.id === this.executeForm.reason)
          
          await animalDeath({
            id: animalId,
            died_time: this.executeForm.died_time,
            reason: selectedReason ? selectedReason.name : '',
            description: this.executeForm.remark || ''
          })
          
          this.$message.success('处死操作成功')
          this.executeDialogVisible = false
          this.getAnimalList() // 刷新列表
          // 清空选中状态
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
</style>
