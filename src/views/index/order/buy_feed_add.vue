<template>
  <div
    style="height: auto"
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form :model="submitform" :rules="rules" ref="form">
      <el-col>
        <el-form-item label="动物来源" prop="source">
          <el-select v-model="submitform.source" size="big" class="width-200">
            <el-option label="课题组自行采购" value="课题组自行采购"></el-option>
            <el-option label="其它区域转出" value="其它区域转出"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>

    <div style="font-weight: bolder">所属项目</div>
    <hr />

    <el-table
      :header-cell-style="{ background: '#fafafa' }"
      :data="project_list"
      style="width: 100%"
    >
      <el-table-column prop="pro_id" label="项目编号" />
      <el-table-column prop="pro_name" label="项目名称" />
      <el-table-column prop="pro_from" label="来源" />

      <el-table-column width="180" label="操作">
        <template v-slot="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <br />

    <br />
    <br />

    <div style="font-weight: bolder">动物明细</div>
    <hr />
    <!-- 表格布局 -->
    <el-table :data="submitform.animals" border style="width: 100%">
      <!-- 品系 -->
      <el-table-column label="品系">
        <template #default="scope">
          <el-input v-model="scope.row.name" placeholder="品系"></el-input>
        </template>
      </el-table-column>
      <!-- 体重 -->
      <el-table-column label="体重">
        <template #default="scope">
          <el-input v-model="scope.row.weight" placeholder="体重"></el-input>
        </template>
      </el-table-column>
      <!-- 周龄 -->
      <el-table-column label="周龄">
        <template #default="scope">
          <el-input v-model="scope.row.age" placeholder="周龄"></el-input>
        </template>
      </el-table-column>
      <!-- 性别 -->
      <el-table-column label="性别">
        <template #default="scope">
          <el-select v-model="scope.row.gender" placeholder="性别">
            <el-option label="雄性" value="雄性"></el-option>
            <el-option label="雌性" value="雌性"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 数量 -->
      <el-table-column label="数量">
        <template #default="scope">
          <el-input v-model="scope.row.count" placeholder="数量"></el-input>
        </template>
      </el-table-column>
      <!-- 供应商 -->
      <el-table-column label="供应商">
        <template #default="scope">
          <el-select v-model="scope.row.supplier" placeholder="供应商">
            <el-option
              v-for="supplier in suppliers"
              :key="supplier"
              :label="supplier"
              :value="supplier"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteRow(scope.$index)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-button type="primary" @click="addRow">添加一行</el-button>
      </el-col>
    </el-row>

    <el-form style="margin-top: 40px">
      <el-form-item label="动物级别">
        <el-select v-model="submitform.level" size="big" class="width-200">
          <el-option label="普通级" value="普通级"></el-option>
          <el-option label="清洁级" value="清洁级"></el-option>
          <el-option label="SPF级" value="SPF级"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <br />

    <hr />

    <br />

    <div v-if="is_laboratory === 'true'" style="font-weight: bolder">
      <el-form
        ref="form"
        :model="submitform"
        :rules="rules"
        label-width="150px"
        style="margin-top: 40px"
      >
        <el-row gutter="20">
          <!-- 院区 -->
          <el-col :span="12">
            <el-form-item label="院区" prop="campus_name">
              <el-select
                v-model="submitform.campus_name"
                size="big"
                class="width-200"
                @change="handleCampusChange"
              >
                <el-option
                  v-for="item in this.campusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 楼栋 -->
          <el-col :span="12">
            <el-form-item label="楼栋" prop="tenement">
              <el-select
                v-model="submitform.building_id"
                size="big"
                class="width-200"
                @change="handleBuildingChange"
              >
                <el-option
                  v-for="item in this.tenementList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 实验室 -->
          <el-col :span="12">
            <el-form-item label="实验室" prop="laboratory_id">
              <el-select
                v-model="submitform.laboratory_id"
                size="big"
                class="width-200"
                @change="handleLaboratoryChange"
              >
                <el-option
                  v-for="item in this.laboratoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 申请类型 -->
          <el-col :span="12">
            <el-form-item label="申请类型" prop="type">
              <el-select v-model="submitform.type" size="medium" class="width-200">
                <el-option value="true" label="新笼位"></el-option>
                <el-option value="false" label="自持笼位"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 数量 -->
          <el-col :span="12">
            <el-form-item label="数量" prop="count">
              <el-input v-model="submitform.count" size="medium" class="width-200" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!-- 表格 -->
          <el-col v-if="submitform.type === 'true'">
            <el-form-item label="选择笼架" prop="rack_id">
              <el-select
                v-model="submitform.rack_id"
                size="medium"
                class="width-200"
                @change="handleRackChange"
              >
                <el-option
                  v-for="item in this.cageList"
                  :key="item.id"
                  :label="item.number"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-table
              :data="tableData"
              style="width: 100%; padding-left: 80px"
              :cell-class-name="getCellClassName"
              @cell-click="handleCellClick"
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
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 饲养服务 -->
          <el-col :span="12">
            <el-form-item label="饲养服务" prop="service" style="margin-top: 40px">
              <el-select v-model="submitform.service" size="medium" class="width-200">
                <el-option value="true" label="有"></el-option>
                <el-option value="false" label="无"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="实验内容" prop="description">
              <el-input
                v-model="submitform.description"
                type="textarea"
                rows="10"
                placeholder="请输入实验内容"
                class="width-500"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择开始日期" prop="start_time">
              <el-date-picker
                v-model="submitform.start_time"
                type="date"
                placeholder="选择开始日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择结束日期" prop="end_time">
              <el-date-picker
                v-model="submitform.end_time"
                type="date"
                placeholder="选择结束日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row gutter="20" style="text-align: right">
      <el-col>
        <el-button type="primary" @click="handleSubmit">同意条款并提交订单</el-button>
      </el-col>
    </el-row>

    <el-row gutter="20" style="text-align: right; margin-top: 20px">
      <el-col>
        <span style="font-size: 15px; cursor: pointer" @click="handleBack">继续购物</span>
      </el-col>
    </el-row>
  </div>
</template>
        
        <script>
import { getCourtyard, getTenement, getLaboratory, getRack } from '@/api/colleges';
import { getCageused, AddFeed } from '@/api/order';
import Empty from '@/components/Empty';
import store from '@/store';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      laboratoryList: [], // 实验室列表
      tenementList: [], // 楼栋列表
      campusList: [], // 院区列表
      cageList: [], // 笼架列表
      AlllaboratoryList: [], // 所有实验室列表
      AlltenementList: [], // 所有楼栋列表
      AllcampusList: [], // 所有院区列表
      AllcageList: [], // 所有笼架列表

      activecage: [], // 存储多选单元格的信息
      suppliers: ['上海新菲公司', '北京供应商', '广州供应商'], // 供应商示例数据
      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名
      tableData: [], // 表格数据
      activeCells: [], // 存储多选单元格的信息

      is_laboratory: 'true', // 是否饲养
      project_list: [
        {
          pro_id: '1',
          pro_name: '动物园',
          pro_from: '动物园',
        },
      ], // 项目列表
      submitform: {
        building_id: '',
        user_id: store.getters.member.id,
        campus_id: '',
        campus_name: '',
        laboratory_id: '',
        rack_id: '',
        level: '',
        source: '',
        courtyard: '',
        tenement: '',
        laboratory: '',
        start_time: '',
        end_time: '',
        laboratory: '',
        type: '',
        content: '',
        description: '',
        number: 0,
        count: 0,
        care_id: '',
        cage_number: [],
        animals: [
          {
            breed: '',
            weight: '',
            age: '',
            gender: '',
            quantity: '',
            supplier: '',
          },
        ],
      },

      list: [
        {
          number: '5',
          name: '动物园门票',
          supervisor: '动物园',
          level: '动物园',
          age: '10岁以上',
          weight: '10kg以上',
          sex: '不限',
          price: '100',
          description: '免费',
          cartCount: 0,
          id: 1,
        },
      ],
    };
  },

  computed: {
    totalPrice() {
      let total = 0;
      this.list.forEach((item) => {
        total += item.price * item.number;
      });
      return total.toFixed(2);
    },
  },
  created() {
    this.init();
    this.submitform.care_id = this.$route.params.id;
    console.log(this.submitform.care_id);
  },
  methods: {
    // 选择校区时更新楼宇列表
    handleCampusChange() {
      this.submitform.building_id = '';
      if (this.submitform.campus_name) {
        // 根据选择的校区更新楼宇列表
        this.tenementList = this.AlltenementList.filter(
          (item) => item.campus_name === this.submitform.campus_name
        );
      } else {
        // 如果没有选择校区，清空楼宇列表
        this.tenementList = [];
      }
    },

    // 选择楼宇时更新校区和实验室列表
    handleBuildingChange() {
      this.submitform.laboratory_id = '';
      // this.submitform.cage_id = '';
      // this.cageList = [];
      const selectedBuilding = this.AlltenementList.find(
        (item) => item.id === this.submitform.building_id
      );
      if (selectedBuilding) {
        // 根据楼宇的 campus_id 自动更新对应的校区
        this.submitform.campus_name = selectedBuilding.campus_name;

        // 根据选择的楼宇更新实验室列表
        this.laboratoryList = this.AlllaboratoryList.filter(
          (item) =>
            item.building_name ===
            this.AlltenementList.find((item) => item.id === this.submitform.building_id).name
        );
      } else {
        // 如果没有选择楼宇，清空实验室列表
        this.laboratoryList = [];
      }
    },
    // 选择实验室时更新笼架列表
    handleLaboratoryChange() {
      this.submitform.rack_id = '';
      if (this.submitform.laboratory_id) {
        // 根据选择的实验室更新笼架列表
        this.getRackList(this.submitform.laboratory_id);
        this.cageList = this.AllcageList.filter(
          (item) => item.room_id === this.submitform.laboratory_id
        );
      } else {
        // 如果没有选择实验室，清空笼架列表
        this.cageList = [];
      }
      const res = this.AlllaboratoryList.find((item) => item.id === this.submitform.laboratory_id);
      this.submitform.campus_name = res.campus_name;
      this.submitform.building_id = res.building_name;
    },
    // 选择笼架的时候更新笼子
    handleRackChange() {
      this.rows = this.cageList.find((item) => item.id === this.submitform.rack_id).height;
      this.columns = [];
      const j = this.cageList.find((item) => item.id === this.submitform.rack_id).width;
      for (let i = 1; i <= j; i++) {
        this.columns.push(String.fromCharCode(64 + i));
      }
      // console.log(this.rows, this.columns);
      this.generateTableData();

      this.getCageUsed(this.submitform.rack_id).then(() => {
        console.log(this.activecage); // 确保 activecage 已更新

        for (let i = 0; i < this.activecage.length; i++) {
          const row = this.tableData[Math.floor(this.activecage[i] / this.rows)]; // 获取特定行的数据
          const column = this.columns.find(
            (col) =>
              col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
          ); // 获取特定列的名字
          this.handleCellClick(row, { property: column });
        }
      });
    },

    // 添加一行
    addRow() {
      this.submitform.animals.push({
        breed: '',
        weight: '',
        age: '',
        gender: '',
        quantity: '',
        supplier: '',
      });
    },
    // 删除一行
    deleteRow(index) {
      this.rowsdata.splice(index, 1);
    },
    handleSubmit() {
      AddFeed(this.submitform).then(() => {
        this.$router.push('/personal/shopping/order/success');
      });
    },

    handleBack() {
      this.$router.push('/buy-feed');
    },
    // 处理单元格点击事件
    handleCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      const cellIndex = this.activeCells.findIndex(
        (cell) => cell.row === cellKey.row && cell.column === cellKey.column
      );
      const res =
        (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加
        this.activeCells.push(cellKey);
      } else {
        // 如果单元格已被选中，移除
        if (!this.activecage.includes(res)) this.activeCells.splice(cellIndex, 1);
      }
      this.submitform.count = this.activeCells.length;

      if (!this.activecage.includes(res)) {
        this.submitform.cage_number.push(res);
      }
    },
    // 根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
      const isActive = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
    },
    generateTableData() {
      this.tableData = [];
      this.count = 0;
      for (let i = 1; i <= this.rows; i++) {
        let rowData = { row: i };
        this.columns.forEach((col) => {
          rowData[col] = `${col}${i}`;
        });
        this.tableData.push(rowData);
      }
    },

    // 获取 Campus 列表
    getCampusList() {
      return new Promise((resolve, reject) => {
        getCourtyard({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.campusList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getCageUsed(id) {
      try {
        return new Promise((resolve, reject) => {
          getCageused({ cage_rack_id: id })
            .then((res) => {
              console.log(res.data);
              this.activecage = res.data;
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
      } catch (error) {
        console.error(error);
      }
    },

    // 获取 Tenement 列表
    getTenementList() {
      return new Promise((resolve, reject) => {
        getTenement({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.tenementList = res.data.content;
            resolve();
          })
          .catch(() => {});
      });
    },

    // 获取 Laboratory 列表
    getLaboratoryList() {
      return new Promise((resolve, reject) => {
        getLaboratory({ page: 1, pageSize: 1000 })
          .then((res) => {
            this.laboratoryList = res.data.content;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    // 获取 Rack 列表
    async getRackList(id) {
      try {
        const res = await getRack({ roomId: id, page: 1, pageSize: 1000 });
        this.cageList = res.data.content;
      } catch (error) {
        console.error(error);
      }
    },

    // 初始化数据
    async init() {
      try {
        await Promise.all([this.getCampusList(), this.getTenementList(), this.getLaboratoryList()]);
        // console.log(this.campusList, this.tenementList, this.laboratoryList);
        this.AllcampusList = this.campusList;
        this.AlltenementList = this.tenementList;
        this.AlllaboratoryList = this.laboratoryList;
        this.AllcageList = this.cageList;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
  },
};
</script>
        
<style>
/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9; /* 浅灰色 */
}
.el-table tbody tr:hover > td {
  background: #f9f9f9 !important;
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b; /* 黄色 */
  color: #ffffff; /* 白色文字 */
}
</style>