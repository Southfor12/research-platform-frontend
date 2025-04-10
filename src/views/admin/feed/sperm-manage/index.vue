<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="品系">
        <el-select v-model="queryParams.strain_id" placeholder="请选择品系" clearable>
          <el-option
            v-for="item in strainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="试管编号">
        <el-input v-model="queryParams.tube_number" placeholder="请输入试管编号" clearable />
      </el-form-item>
      <el-form-item label="精子质量">
        <el-select v-model="queryParams.sperm_quality" placeholder="请选择精子质量" clearable>
          <el-option label="未测试" value="未测试" />
          <el-option label="合格" value="合格" />
          <el-option label="不合格" value="不合格" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="success" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="spermList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      />
      <el-table-column
        prop="animal_id"
        label="动物ID"
        width="100"
        align="center"
      />
      <el-table-column
        prop="strain_id"
        label="品系ID"
        width="100"
        align="center"
      />
      <el-table-column
        prop="tube_number"
        label="试管编号"
        width="100"
        align="center"
      />
      <el-table-column
        prop="count"
        label="数量"
        width="80"
        align="center"
      />
      <el-table-column
        prop="sperm_quality"
        label="精子质量"
        width="100"
        align="center"
      />
      <el-table-column
        prop="birth_time"
        label="出生时间"
        width="160"
        align="center"
      />
      <el-table-column
        prop="freeze_time"
        label="冷冻时间"
        width="160"
        align="center"
      />
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="品系" prop="strain_id">
          <el-select v-model="form.strain_id" placeholder="请选择品系">
            <el-option
              v-for="item in strainOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="动物ID" prop="animal_id">
          <el-input v-model="form.animal_id" placeholder="请输入动物ID" />
        </el-form-item>
        <el-form-item label="试管编号" prop="tube_number">
          <el-input v-model="form.tube_number" placeholder="请输入试管编号" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input-number v-model="form.count" :min="1" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="精子质量" prop="sperm_quality">
          <el-select v-model="form.sperm_quality" placeholder="请选择精子质量">
            <el-option label="未测试" value="未测试" />
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生时间" prop="birth_time">
          <el-date-picker
            v-model="form.birth_time"
            type="datetime"
            placeholder="选择出生时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="冷冻时间" prop="freeze_time">
          <el-date-picker
            v-model="form.freeze_time"
            type="datetime"
            placeholder="选择冷冻时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSpermManage, addSperm } from '@/api/ani_manage'
import { getAnimalStrain } from '@/api/ani_setting'

export default {
  name: 'SpermManage',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 精子管理表格数据
      spermList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        strain_id: undefined,
        tube_number: undefined,
        sperm_quality: undefined
      },
      // 表单参数
      form: {
        strain_id: undefined,
        name: undefined,
        animal_id: undefined,
        tube_number: undefined,
        count: 1,
        sperm_quality: undefined,
        birth_time: undefined,
        freeze_time: undefined
      },
      // 表单校验
      rules: {
        strain_id: [
          { required: true, message: '品系不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        animal_id: [
          { required: true, message: '动物ID不能为空', trigger: 'blur' }
        ],
        tube_number: [
          { required: true, message: '试管编号不能为空', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        sperm_quality: [
          { required: true, message: '精子质量不能为空', trigger: 'change' }
        ],
        birth_time: [
          { required: true, message: '出生时间不能为空', trigger: 'change' }
        ],
        freeze_time: [
          { required: true, message: '冷冻时间不能为空', trigger: 'change' }
        ]
      },
      // 品系选项
      strainOptions: []
    }
  },
  created() {
    this.getList()
    this.getStrainOptions()
  },
  methods: {
    /** 查询精子管理列表 */
    getList() {
      this.loading = true
      getSpermManage(this.queryParams).then(response => {
        this.spermList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 获取品系选项 */
    getStrainOptions() {
      getAnimalStrain({ 
        pageNo: 1,
        pageSize: 23
      }).then(response => {
        if (response.status === 1) {
          this.strainOptions = response.data.records.map(item => ({
            value: item.id,
            label: item.strain_name
          }))
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        strain_id: undefined,
        tube_number: undefined,
        sperm_quality: undefined
      }
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加精子信息'
    },
    /** 表单重置 */
    reset() {
      this.form = {
        strain_id: undefined,
        name: undefined,
        animal_id: undefined,
        tube_number: undefined,
        count: 1,
        sperm_quality: undefined,
        birth_time: undefined,
        freeze_time: undefined
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addSperm(this.form).then(response => {
            if (response.status === 1) {
              this.$message.success('新增成功')
              this.open = false
              this.getList()
            } else {
              this.$message.error(response.msg || '新增失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
