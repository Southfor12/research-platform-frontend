<template>
  <div
    style="height: auto"
    v-loading="loading"
    class="app-container"
    element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading"
  >
    <div style="font-weight: bolder">确认商品</div>
    <hr />

    <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
      <el-table-column prop="name" label="产品规格" />

      <el-table-column prop="price" label="单价" />
      <el-table-column prop="count" label="数量" header-align="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button
              size="mini"
              icon="el-icon-minus"
              @click="if (scope.row.count > 1) scope.row.count--;"
            ></el-button>
            <span style="margin: -10px 10px">{{ scope.row.count }}</span>
            <el-button size="mini" icon="el-icon-plus" @click="scope.row.count++"></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
    </el-table>
    <div style="font-size: 18px; color: #333; margin-top: 20px; float: right">
      订单总额: <span style="color: red; font-weight: bold; font-size: 22px">{{ totalPrice }}</span>
    </div>

    <br />
    <br />
    <br />
    <br />

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
        <template #default="scope">
          <el-checkbox :checked="scope.row.selected" @change="selectOnly(scope.row)"> </el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <br />
    <br />
    <br />
    <br />

    <div style="font-weight: bolder">是否饲养</div>
    <hr />

    <el-radio-group v-model="is_laboratory">
      <el-radio label="true">是</el-radio>
      <el-radio label="false">否</el-radio>
    </el-radio-group>

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
                @change="handleCampusChange"
                class="width-200"
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
                @change="handleBuildingChange"
                class="width-200"
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
                @change="handleLaboratoryChange"
                size="big"
                class="width-200"
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
                style="width: 30%"
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
                style="width: 30%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row gutter="20" style="text-align: right">
      <el-col>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </el-col>
    </el-row>
  </div>
</template>
        
        <script>
import { getCourtyard, getTenement, getLaboratory, getRack } from '@/api/colleges';
import { getCageused, get_a_AnimalOrder, editFeed, editAnimalOrder } from '@/api/order';
import { get_a_Animal } from '@/api/product';
import store from '@/store';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      selectedItem: null, // 存储选中的项目
      laboratoryList: [], // 实验室列表
      tenementList: [], // 楼栋列表
      campusList: [], // 院区列表
      cageList: [], // 笼架列表
      AlllaboratoryList: [], // 所有实验室列表
      AlltenementList: [], // 所有楼栋列表
      AllcampusList: [], // 所有院区列表
      AllcageList: [], // 所有笼架列表

      activecage: [], // 存储多选单元格的信息

      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名
      tableData: [], // 表格数据
      activeCells: [], // 选择的
      activeCells_: [], // 已选择的

      is_laboratory: 'true', // 是否饲养
      project_list: [
        {
          pro_id: '1',
          pro_name: '动物园',
          pro_from: '动物园',
        },
      ], // 项目列表
      submitform: {
        animals: [
          {
            age: '',
            count: '',
            gender: '',
            name: '',
            supplier: '',
            weight: '',
          },
        ],
        care_id: '',
        animal_order_id: '',
        cage_number: [],
        count: '',
        description: '',
        end_time: '',
        source: '0',
        level: '',
        project_name: '',
        rack_id: '',
        start_time: '',
        user_id: store.getters.member.id,
      },
      queryForm: {
        id: '',
        name: '',
        supervisor: '',
        level: '',
        age: '',
        weight: '',
        sex: '',
        price: '',
        description: '',
        number: '',
        page: 1,
        page_size: 10,
      },

      list: [],
    };
  },

  computed: {
    totalPrice() {
      let total = 0;
      this.list.forEach((item) => {
        total += item.price * item.count;
      });
      return total.toFixed(2);
    },
  },
  created() {
    this.init();
    get_a_AnimalOrder({ id: this.$route.params.id })
      .then((res) => {
        res.data = [{ ...res.data }];
        const promises = res.data.map((item) =>
          get_a_Animal({ id: item.animal_id }).then((ress) => {
            return {
              ...item,
              name: `${ress.data.name} ${ress.data.supplier_id} ${ress.data.level} ${item.gender} ${item.age} ${item.weight}`,
              price: ress.data.price,
            };
          })
        );

        Promise.all(promises).then((data) => {
          this.list = data; // 确保所有数据加载完成后再赋值
          this.submitform.animals[0].age = this.list[0].age;
          this.submitform.animals[0].count = this.list[0].count;
          this.submitform.animals[0].gender = this.list[0].gender;
          this.submitform.animals[0].name = this.list[0].name;
          this.submitform.animals[0].supplier = this.list[0].supplier;
          this.submitform.animals[0].weight = this.list[0].weight;
        });
      })
      .catch(() => {});
  },
  methods: {
    selectOnly(row) {
      // 遍历所有数据行，确保只有当前行被选中
      this.tableData.forEach((item) => {
        item.selected = item === row; // 仅当前行为 true，其他行为 false
      });
      this.selectedItem = row.selected ? row.pro_name : null; // 更新选中的项目名称
      this.submitform.project_name = this.selectedItem;
    },
    handleSubmit() {
      this.submitform.animals[0].count = this.list[0].count;
      this.submitform.animals[0].name = this.submitform.animals[0].name.split(' ')[0];
      console.log(this.submitform);
      editFeed(this.submitform)
        .then((res) => {
          editAnimalOrder({
            id: this.$route.params.id,
            care_order_id: res.data,
            count: this.list[0].count,
          }).then(() => {
            this.$router.push('/personal/shopping/cart');
          });
        })
        .catch(() => {});
    },

    handleBack() {
      this.$router.push('/buy-animal');
    },
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
      if (this.activecage.includes(res)) this.activeCells_.push(cellKey);
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加
        this.activeCells.push(cellKey);
      } else {
        // 如果单元格已被选中，移除
        if (!this.activecage.includes(res)) this.activeCells.splice(cellIndex, 1);
      }
      this.submitform.count = this.activeCells.length - this.activecage.length;

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
      const isActive_ = this.activeCells_.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      if (isActive_) return 'highlight_';
      return isActive ? 'highlight' : 'default-cell'; // 高亮或默认样式
    },
    generateTableData() {
      this.tableData = [];
      this.activeCells = [];
      this.activeCells_ = [];
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

.highlight_ {
  background-color: gray; /* 灰色 */
  color: #ffffff; /* 白色文字 */
}
</style>