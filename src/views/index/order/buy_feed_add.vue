<template>
  <div style="height: auto" v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
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

    <el-table :header-cell-style="{ background: '#fafafa' }" :data="project_list" style="width: 100%">
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

    <div style="font-weight: bolder">所属课题组</div>
    <hr />
    <el-form :model="submitform" :rules="rules" ref="form">
      <el-col>
        <el-form-item label="课题组" prop="research_group_name">
          <el-select v-model="submitform.research_group_name" size="big" class="width-200">
            <el-option 
              v-for="item in researchGroupList" 
              :key="item" 
              :label="item" 
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>

    <br />
    <br />
    <br />

    <div style="font-weight: bolder">动物明细</div>
    <hr />
    <!-- 表格布局 -->
    <el-table :data="submitform.animals" border style="width: 100%">
      <!-- 动物类型 -->
      <el-table-column label="动物类型" width="180">
        <template #default="scope">
          <el-select v-model="scope.row.animalType" placeholder="选择类型" clearable :disabled="true">
            <el-option v-for="type in uniqueAnimalTypes" :key="type.id" :label="type.name" :value="type.name" />
          </el-select>
        </template>
      </el-table-column>
      <!-- 品系 -->
      <el-table-column label="品系" width="180">
        <template #default="scope">
          <el-select v-model="scope.row.breed" placeholder="选择品系" clearable>
            <el-option v-for="strain in filteredStrains(scope.row.animalType)" :key="strain.id"
              :label="strain.strain_name" :value="strain.strain_name" />
          </el-select>
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
            <el-option v-for="supplier in suppliers" :key="supplier" :label="supplier" :value="supplier"></el-option>
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
      <el-form ref="form" :model="submitform" :rules="rules" label-width="150px" style="margin-top: 40px">
        <el-row gutter="20">
          <!-- 院区 -->
          <el-col :span="12">
            <el-form-item label="院区" prop="campus_name">
              <el-select v-model="submitform.campus_name" size="big" class="width-200" @change="handleCampusChange">
                <el-option v-for="item in this.campusList" :key="item.id" :label="item.name"
                  :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 楼栋 -->
          <el-col :span="12">
            <el-form-item label="楼栋" prop="tenement">
              <el-select v-model="submitform.building_id" size="big" class="width-200" @change="handleBuildingChange">
                <el-option v-for="item in this.tenementList" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 实验室 -->
          <el-col :span="12">
            <el-form-item label="实验室" prop="laboratory_id">
              <el-select v-model="submitform.laboratory_id" size="big" class="width-200"
                @change="handleLaboratoryChange">
                <el-option v-for="item in this.laboratoryList" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="已选笼子数量" prop="count">
              <el-input v-model="submitform.count" size="medium" class="width-200" />
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

          <!-- 总价 -->
          <el-col :span="12">
            <el-form-item label="预计需要笼子数" prop="price">
              <el-input size="medium" class="width-200" :readonly="true" :value="totalCageNums + '个'">
                <!-- <template slot="append">个</template> -->
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <!-- 笼盒类型 -->
          <el-col :span="12">
            <el-form-item label="笼盒类型" prop="cage_box_type">
              <el-select v-model="submitform.cage_box_type" size="medium" class="width-200" @change="handleCageBoxTypeChange">
                <el-option v-for="item in cageBoxList" :key="item.id" :label="item.box_type" :value="item.box_type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 笼盒价格 -->
          <el-col :span="12">
            <el-form-item label="笼盒价格/个" prop="cage_box_price">
              <el-input size="medium" class="width-200" :readonly="true" :value="submitform.cage_box_price + '元'">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!-- 表格 -->
          <el-col>
            <el-form-item label="选择笼架" prop="rack_id">
              <el-select v-model="submitform.rack_id" size="medium" class="width-200" @change="handleRackChange">
                <el-option v-for="item in this.cageList" :key="item.id" :label="item.number"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-table :data="tableData" style="width: 100%; padding-left: 80px" :cell-class-name="getCellClassName"
              @cell-click="handleCellClick">
              <el-table-column prop="row" label="#" width="50"></el-table-column>
              <el-table-column v-for="col in columns" :key="col" :prop="col" :label="col" width="100"></el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <!-- <el-row gutter="20"> -->
          <!-- 饲养服务 -->
          <!-- <el-col :span="12">
            <el-form-item label="饲养服务" prop="service" style="margin-top: 40px">
              <el-select v-model="submitform.service" size="medium" class="width-200">
                <el-option value="true" label="有"></el-option>
                <el-option value="false" label="无"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        <!-- </el-row> -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="实验内容" prop="description">
              <el-input v-model="submitform.description" type="textarea" rows="10" placeholder="请输入实验内容"
                class="width-500" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择开始日期" prop="start_time">
              <el-date-picker v-model="submitform.start_time" type="date" placeholder="选择开始日期"
                style="width: 100%" @change="watchDateChange"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="选择结束日期" prop="end_time">
              <el-date-picker v-model="submitform.end_time" type="date" placeholder="选择结束日期"
                style="width: 100%" @change="watchDateChange"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 总价格展示 -->
        <el-row gutter="20">
          <el-col :span="12">
            <el-form-item label="总价格" prop="total_price">
              <el-input size="medium" class="width-200" :readonly="true" :value="calculateTotalPrice().toFixed(2) + '元'">
              </el-input>
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
// 新增导入
import { get_a_Feed } from '@/api/product';
import { getAnimalStrain, getAnimalTypeById } from '@/api/ani_setting';
import { getAnimalType } from '@/api/ani_setting';
import { getCourtyard, getTenement, getLaboratory, getRack } from '@/api/colleges';
import { getCageused, AddFeed } from '@/api/order';
import { getCageNumber, getLockedCageNumber, getResearchGroupName } from '@/api/ani_manage';
import Empty from '@/components/Empty';
import store from '@/store';
import { getCageBoxList } from '@/api/cage_box';
export default {
  components: {
    Empty,
  },
  data() {
    return {
      animalTypeMap: new Map(), // 用于存储动物类型name和id的映射
      defaultAnimalType: '', // 新增默认类型字段
      unitPrice: 0,
      animalStrains: [],
      animalTypes: [],
      laboratoryList: [], // 实验室列表
      tenementList: [], // 楼栋列表
      campusList: [], // 院区列表
      cageList: [], // 笼架列表
      AlllaboratoryList: [], // 所有实验室列表
      AlltenementList: [], // 所有楼栋列表
      AllcampusList: [], // 所有院区列表
      AllcageList: [], // 所有笼架列表
      suppliers: ['上海新菲公司', '北京供应商', '广州供应商'], // 供应商示例数据

      rows: 10, // 行数
      columns: ['A', 'B', 'C', 'D', 'E'], // 列名

      tableData: [], // 表格数据
      activeCells: [], // 存储多选单元格的信息
      activecage: [],  // 存储多选单元格的信息  被选中的笼子的位置号
      reservedCageNumbers: [], // 存储自持笼位的编号
      lockedCageNumbers: [], // 存储锁定笼位的编号

      is_laboratory: 'true', // 是否饲养
      project_list: [
        {
          pro_id: '1',
          pro_name: '动物园',
          pro_from: '动物园',
        },
      ], // 项目列表
      submitform: {
        // price: '',
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
        cage_box_type: '', // 新增笼盒类型
        cage_box_price: 0, // 新增笼盒价格
        research_group_name: '', // 新增课题组名称
        animals: [
          {
            name: '',
            animalType: '',
            // breed: '',
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
      cageBoxList: [], // 新增笼盒列表
      feedPrice: 0, // 新增饲养价格
      researchGroupList: [], // 课题组列表
    };
  },
  watch: {
    'submitform.count': {
      handler(newVal) {
        this.submitform.price = this.totalPrice
      },
      immediate: true,
      deep: true,
      handler() {
        // 自动更新界面显示
        this.$forceUpdate()
      }
    }
  },
  computed: {
    totalPrice() {
      return (this.unitPrice * this.submitform.count).toFixed(2)
    },
    // ...其他计算属性...
    // 新增去重后的动物类型
    uniqueAnimalTypes() {
      const seen = new Set()
      return this.animalTypes.filter(item => {
        // 根据name去重
        const duplicate = seen.has(item.name)
        seen.add(item.name)
        return !duplicate
      })
    },
    // 新增去重后的品系列表
    // uniqueStrains() {
    //   const seen = new Set()
    //   return this.animalStrains.filter(item => {
    //     const duplicate = seen.has(item.strain_name)
    //     seen.add(item.strain_name)
    //     return !duplicate
    //   })
    // },
    // 新增动态获取品系列表的方法
    filteredStrains() {
      return (animalType) => {
        const typeId = this.animalTypeMap.get(animalType).id;
        if (!typeId) return []
        return this.animalStrains.filter(
          strain => strain.animal_type_id === typeId
        )
      }
    },

    totalCageNums() {
      let total = 0
      this.submitform.animals.forEach(animal => {
        const typeInfo = this.animalTypeMap.get(animal.animalType)
        // const capacity = typeInfo?.capacity || 1 // 默认1防止除零
        var capacity = (typeInfo && typeInfo.capacity) || 1; // 旧版兼容写法
        const count = Number(animal.count) || 0
        if (capacity > 0) {
          total += Math.ceil(count / capacity)
        }
      })
      return total
    },


    'submitform.count': {
      handler(newVal) {
        this.submitform.price = this.totalPrice
      },
      immediate: true
    }
  },
  created() {
    this.init();
    this.loadAnimalTypes(); //获取动物类型的方法
    this.loadAnimalStrains() // 新增品系数据加载
    this.submitform.care_id = this.$route.params.id;

    // 初始化时设置默认值
    this.submitform.animals = [{
      animalType: this.defaultAnimalType, // 初始默认值
      breed: '',
      weight: '',
      age: '',
      gender: '',
      quantity: '',
      supplier: '',
    }];
    this.loadUnitPrice(); // 新增单价获取
  },
  methods: {
    async loadUnitPrice() {
      try {
        const res = await get_a_Feed({ id: this.submitform.care_id })
        if (res.status === 1) {
          this.unitPrice = res.data.price;
          this.defaultAnimalType = res.data.animal_type.trim() // 去除前后空格

          // 设置现有行的默认值
          this.submitform.animals.forEach(animal => {
            animal.animalType = this.defaultAnimalType
          })
        }
      } catch (error) {
        console.error('获取单价失败:', error)
        this.unitPrice = 0
      }
    },
    // 新增动物品系加载方法
    async loadAnimalStrains() {
      try {
        const res = await getAnimalStrain({
          pageNo: 1,
          pageSize: 1000 // 获取足够大的分页数据
        })
        if (res.status === 1) {
          this.animalStrains = res.data.records
        }
      } catch (error) {
        console.error('获取动物品系失败:', error)
      }
    },

    async loadAnimalTypes() {
      try {
        const res = await getAnimalType()
        if (res.status === 1) {
          this.animalTypes = res.data;
          // 创建name->id的映射
          res.data.forEach(item => {
            this.animalTypeMap.set(item.name,
              {
                id: item.id,
                capacity: item.default_capacity // 确保返回数据包含default_capacity字段
              })
          })
        }
      } catch (error) {
        console.error('获取动物类型失败:', error)
      }
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
      // 清空之前的选择
      this.activeCells = [];
      this.submitform.cage_number = [];
      this.submitform.count = 0;
      
      this.rows = this.cageList.find((item) => item.id === this.submitform.rack_id).height;
      this.columns = [];
      const j = this.cageList.find((item) => item.id === this.submitform.rack_id).width;
      for (let i = 1; i <= j; i++) {
        this.columns.push(String.fromCharCode(64 + i));
      }
      this.generateTableData();
      
      // 如果是自持笼位，获取用户的自持笼位
      if (this.submitform.type === 'false') {
        this.getReservedCageNumbers(this.submitform.rack_id).then(() => {
          // 渲染自持笼位并自动选中
          for (let i = 0; i < this.reservedCageNumbers.length; i++) {
            const cageNumber = this.reservedCageNumbers[i];
            const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
            const column = this.columns.find(
              (col) =>
                col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
            );
            
            // 添加到activeCells和cage_number中
            this.activeCells.push({ row: row.row, column: column });
            this.submitform.cage_number.push(cageNumber);
            this.submitform.count++;
          }
        });
      } else {
        // 按顺序获取和渲染笼位状态
        this.getCageUsed(this.submitform.rack_id).then(() => {
          this.getReservedCageNumbers(this.submitform.rack_id).then(() => {
            this.getLockedCageNumbers(this.submitform.rack_id).then(() => {
              // 渲染已使用的笼位
              for (let i = 0; i < this.activecage.length; i++) {
                const row = this.tableData[Math.floor(this.activecage[i] / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (this.activecage[i] % this.columns.length) + 1)
                );
                this.handleUsedCellClick(row, { property: column });
              }
              
              // 渲染自持笼位
              for (let i = 0; i < this.reservedCageNumbers.length; i++) {
                const cageNumber = this.reservedCageNumbers[i];
                const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
                );
                
                if (!this.activecage.includes(cageNumber)) {
                  this.handleReservedCellClick(row, { property: column });
                }
              }
              
              // 渲染锁定笼位
              for (let i = 0; i < this.lockedCageNumbers.length; i++) {
                const cageNumber = this.lockedCageNumbers[i];
                const row = this.tableData[Math.floor(cageNumber / this.columns.length)];
                const column = this.columns.find(
                  (col) =>
                    col === String.fromCharCode(64 + (cageNumber % this.columns.length) + 1)
                );
                
                if (!this.activecage.includes(cageNumber) && !this.reservedCageNumbers.includes(cageNumber)) {
                  this.handleLockedCellClick(row, { property: column });
                }
              }
            });
          });
        });
      }
    },

    // 添加一行
    addRow() {
      this.submitform.animals.push({
        animalType: this.defaultAnimalType, // 设置默认类型
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
      // 将品系的值赋给name字段
      this.submitform.animals.forEach(animal => {
        animal.name = animal.breed;
      });
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
      
      // 计算当前单元格的编号
      const cageNumber = (row.row - 1) * this.columns.length + column.property.charCodeAt(0) - 'A'.charCodeAt(0);
      
      // 检查是否是已使用的笼位（黄色高亮）
      const isUsed = this.activecage && this.activecage.includes(cageNumber);
      
      // 检查是否是自持笼位（蓝色高亮）
      const isReserved = this.reservedCageNumbers && this.reservedCageNumbers.includes(cageNumber);
      
      // 检查是否是锁定笼位（灰色高亮）
      const isLocked = this.lockedCageNumbers && this.lockedCageNumbers.includes(cageNumber);
      
      // 如果是自持笼位模式
      if (this.submitform.type === 'false') {
        // 只能选择自持笼位
        if (!isReserved) {
          return;
        }
        // 如果已经是已使用或锁定的笼位，不允许选择
        if (isUsed || isLocked) {
          return;
        }
      } else {
        // 如果是新笼位模式，不允许选择已使用、自持或锁定的笼位
        if (isUsed || isReserved || isLocked) {
          return;
        }
      }
      
      // 检查单元格是否已被选中
      const cellIndex = this.activeCells.findIndex(
        (cell) => cell.row === cellKey.row && cell.column === cellKey.column
      );
      
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加并设置为红色高亮
        this.activeCells.push(cellKey);
        // 添加到已选笼子编号数组
        this.submitform.cage_number.push(cageNumber);
        // 增加已选笼子数量
        this.submitform.count++;
      } else {
        // 如果单元格已被选中，移除
        this.activeCells.splice(cellIndex, 1);
        // 从已选笼子编号数组中移除
        const numberIndex = this.submitform.cage_number.indexOf(cageNumber);
        if (numberIndex !== -1) {
          this.submitform.cage_number.splice(numberIndex, 1);
          // 减少已选笼子数量，但确保不会小于0
          this.submitform.count = Math.max(0, this.submitform.count - 1);
        }
      }
    },

    //根据单元格位置动态设置类名
    getCellClassName({ row, columnIndex, column }) {
      // 确保columnIndex有效且this.columns数组不为空
      if (columnIndex <= 0 || !this.columns || this.columns.length === 0) {
        return 'default-cell';
      }
      
      const colKey = this.columns[columnIndex - 1]; // 列名，从索引获取
      if (!colKey) {
        return 'default-cell';
      }
      
      // 计算当前单元格的编号
      const cageNumber = (row.row - 1) * this.columns.length + (colKey.charCodeAt(0) - 'A'.charCodeAt(0));
      
      // 检查是否是自持笼位
      const isReserved = this.reservedCageNumbers && this.reservedCageNumbers.includes(cageNumber);
      
      // 检查是否是锁定笼位
      const isLocked = this.lockedCageNumbers && this.lockedCageNumbers.includes(cageNumber);
      
      // 检查是否被选中（红色高亮）
      const isSelected = this.activeCells.some(
        (cell) => cell.row === row.row && cell.column === colKey
      );
      
      // 检查是否是已使用的笼位（黄色高亮）
      const isUsed = this.activecage && this.activecage.includes(cageNumber);
      
      // 如果是自持笼位模式
      if (this.submitform.type === 'false') {
        if (isReserved) {
          // 如果是自持笼位，根据是否被选中显示不同颜色
          return isSelected ? 'highlight-red' : 'highlight-blue';
        }
        // 非自持笼位显示默认样式
        return 'default-cell';
      }
      
      // 如果是自持笼位，返回蓝色高亮样式
      if (isReserved) {
        return 'highlight-blue';
      }
      
      // 如果是锁定笼位，返回灰色高亮样式
      if (isLocked) {
        return 'highlight-gray';
      }
      
      // 如果是已使用的笼位，返回黄色高亮样式
      if (isUsed) {
        return 'highlight';
      }
      
      // 如果被选中，返回红色高亮样式
      if (isSelected) {
        return 'highlight-red';
      }
      
      // 否则返回默认样式
      return 'default-cell';
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

    // 获取自持笼位编号
    getReservedCageNumbers(id) {
      try {
        return new Promise((resolve, reject) => {
          getCageNumber({ cage_rack_id: id })
            .then((res) => {
              console.log('自持笼位:', res.data);
              this.reservedCageNumbers = res.data;
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

    // 获取锁定笼位编号
    getLockedCageNumbers(id) {
      try {
        return new Promise((resolve, reject) => {
          getLockedCageNumber({ cage_rack_id: id })
            .then((res) => {
              console.log('锁定笼位:', res.data);
              this.lockedCageNumbers = res.data;
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

    // 处理自持笼位单元格点击事件
    handleReservedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      
      // 将自持笼位添加到activeCells中，但不添加到cage_number中
      const cellIndex = this.activeCells.findIndex(
        (cell) => cell.row === cellKey.row && cell.column === cellKey.column
      );
      
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加
        this.activeCells.push(cellKey);
      }
    },

    // 处理锁定笼位单元格点击事件
    handleLockedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      
      // 将锁定笼位添加到activeCells中，但不添加到cage_number中
      const cellIndex = this.activeCells.findIndex(
        (cell) => cell.row === cellKey.row && cell.column === cellKey.column
      );
      
      if (cellIndex === -1) {
        // 如果单元格不在 activeCells 中，添加
        this.activeCells.push(cellKey);
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
          .catch(() => { });
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

    // 获取笼盒列表
    async getCageBoxList() {
      try {
        const res = await getCageBoxList();
        if (res.status === 1) {
          this.cageBoxList = res.data;
        }
      } catch (error) {
        console.error('获取笼盒列表失败:', error);
      }
    },

    // 处理笼盒类型变化
    handleCageBoxTypeChange(value) {
      const selectedBox = this.cageBoxList.find(item => item.box_type === value);
      if (selectedBox) {
        this.submitform.cage_box_type = selectedBox.box_type;
        this.submitform.cage_box_price = selectedBox.cage_box_price;
      }
    },

    // 计算总天数
    calculateTotalDays() {
      if (!this.submitform.start_time || !this.submitform.end_time) {
        return 0;
      }
      const startDate = new Date(this.submitform.start_time);
      const endDate = new Date(this.submitform.end_time);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },

    // 计算总价格
    calculateTotalPrice() {
      // 笼盒总价 = 预计需要笼子数 * 笼盒价格
      const cageBoxTotal = this.totalCageNums * this.submitform.cage_box_price;
      
      // 饲养总价 = 总天数 * 笼子数 * 饲养价格
      const feedTotal = this.calculateTotalDays() * this.submitform.count * this.feedPrice;
      
      // 总价格 = 笼盒总价 + 饲养总价
      return cageBoxTotal + feedTotal;
    },

    // 获取饲养价格
    async getFeedPrice() {
      try {
        // 从路由中获取id参数
        const id = this.$route.params.id;
        if (!id) {
          console.error('未找到路由参数id');
          return;
        }
        const res = await get_a_Feed({ id });
        if (res.status === 1) {
          this.feedPrice = res.data.price;
        }
      } catch (error) {
        console.error('获取饲养价格失败:', error);
        this.feedPrice = 0;
      }
    },

    // 监听日期变化
    watchDateChange() {
      this.$forceUpdate(); // 强制更新视图，重新计算总价格
    },

    // 获取课题组列表
    async getResearchGroupList() {
      try {
        const res = await getResearchGroupName({ user_id: store.getters.member.id })
        if (res.status === 1) {
          this.researchGroupList = res.data
        }
      } catch (error) {
        console.error('获取课题组列表失败:', error)
      }
    },

    // 初始化数据
    async init() {
      try {
        await Promise.all([
          this.getCampusList(), 
          this.getTenementList(), 
          this.getLaboratoryList(),
          this.getCageBoxList(), // 新增获取笼盒列表
          this.getFeedPrice(), // 新增获取饲养价格
          this.getResearchGroupList() // 新增获取课题组列表
        ]);
        this.AllcampusList = this.campusList;
        this.AlltenementList = this.tenementList;
        this.AlllaboratoryList = this.laboratoryList;
        this.AllcageList = this.cageList;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    // 处理已使用笼位单元格点击事件
    handleUsedCellClick(row, column) {
      let cellKey = { row: row.row, column: column.property };
      if (!row.row) {
        cellKey = { row: row, column: column };
      }
      this.activeCells.push({ ...cellKey, type: 'used' });
    },
  },

};
</script>

<style>
/* 默认单元格样式 */
.default-cell {
  background-color: #f9f9f9;
  /* 浅灰色 */
}

.el-table tbody tr:hover>td {
  background: #f9f9f9 !important;
}

/* 高亮单元格样式 */
.highlight {
  background-color: #ffd04b;
  /* 黄色 */
  color: #ffffff;
  /* 白色文字 */
}

/* 红色高亮 */
.highlight-red {
  background-color: red;
  /* 设置背景为红色 */
  color: white;
  /* 可选，设置文本颜色为白色，保证红色背景下文字清晰可见 */
}

/* 黄色高亮 */
.highlight-yellow {
  background-color: yellow;
  /* 设置背景为黄色 */
  color: black;
  /* 可选，设置文本颜色为黑色，确保黄色背景下文字清晰可见 */
}

/* 默认单元格样式 */
.default-cell {
  background-color: transparent;
  /* 默认情况下，背景透明 */
  color: black;
  /* 设置文本颜色为黑色 */
}

/* 蓝色高亮 */
.highlight-blue {
  background-color: #409EFF;
  /* 设置背景为蓝色 */
  color: white;
  /* 设置文本颜色为白色，保证蓝色背景下文字清晰可见 */
}

/* 灰色高亮 */
.highlight-gray {
  background-color: #909399;
  /* 设置背景为灰色 */
  color: white;
  /* 设置文本颜色为白色，保证灰色背景下文字清晰可见 */
}
</style>