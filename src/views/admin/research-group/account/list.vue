<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据查询中..."
    element-loading-spinner="el-icon-loading">
    <el-form :inline="true" :model="queryForm">
      <el-form-item label="名称">
        <el-input v-model="queryForm.name" class="max-width-150" size="small" clearable />
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="queryForm.factory_id"
          :clearable="false"
          size="small"
          class="max-width-150"
          placeholder="单位"
        >
          <el-option :label="factory.name" :value="factory.id" :key="idx" v-for="(factory,idx) in getSelectableFactories()"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态">
                <el-select v-model="queryForm.is_deleted" :clearable="true" size="small" class="max-width-150" placeholder="状态">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="已删除" value="1"></el-option>
                </el-select>
            </el-form-item> -->
      <el-form-item>
        <el-button round size="small" @click="resetQuery">查询</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="checkNode('add_research_group_account')" class="right">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd(0)">添加课题组账号</el-button>
            </el-form-item> -->
    </el-form>
    <el-table :header-cell-style="{background:'#fafafa'}" :data="list" style="width: 100%">
      <el-table-column width="100px" type="index" :index="indexMethod" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="research_group_name" label="课题组" />
      <el-table-column prop="amount" label="余额/元" />
      <el-table-column prop="factory_id" label="单位">
          <template slot-scope="scope">
            {{getFactoryName(scope.row.factory_id)}}
          </template>
      </el-table-column>
      <!-- <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_deleted === 0">正常</el-tag>
                <el-tag type="danger" v-if="scope.row.is_deleted === 1">已删除</el-tag>
            </template>
        </el-table-column> -->
      <el-table-column
        v-if="checkNode('research_group_account_recharge') || checkNode('edit_research_group_account') || checkNode('delete_research_group_account')"
        width="220" label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkNode('research_group_account_recharge')" size="mini" type="success"
            @click="toRecharge(scope.row)">充值</el-button>
          <el-button v-if="checkNode('edit_research_group_account')" size="mini" type="primary"
            @click="toAdd(scope.row.id)">修改</el-button>
          <!-- <el-button
                    v-if="checkNode('delete_research_group_account') && scope.row.is_deleted === 0"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row, 1)"
                >删除</el-button>
                <el-button
                    v-if="checkNode('delete_research_group_account') && scope.row.is_deleted === 1"
                    size="mini"
                    type="info"
                    @click="handleDelete(scope.row, 0)"
                >恢复</el-button> -->
        </template>
      </el-table-column>
      <div slot="empty">
        <empty />
      </div>
    </el-table>
    <el-pagination class="dl-pagination" :hide-on-single-page="true" background :page-sizes="[10,30,50]"
      layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="queryForm.page"
      :page-size="queryForm.size" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog title="账号充值" :visible.sync="dialogFormVisible">
      <el-form ref="rechargeForm" :model="rechargeForm" :rules="rules" label-width="100px">
        <el-form-item label="账号名称">{{ currentAccount.name }}</el-form-item>
        <el-form-item label="课题组">{{ currentAccount.research_group_name }}</el-form-item>
        <el-form-item label="可用余额">{{ currentAccount.amount }}</el-form-item>
        <!-- <el-form-item label="负债金额">{{ currentAccount.debt_amount }}</el-form-item> -->
        <!-- <el-form-item label="返还金额">{{ currentAccount.inter_amount }}</el-form-item> -->
        <el-form-item label="充值金额" prop="amount">
          <el-input-number size="small" v-model="rechargeForm.amount" :min="1" :precision="0"></el-input-number>
          <!-- <div class="tips">(提示：若有欠账，请勾选欠账平账，1、不还款则充值金额充值到可用余额，2、还完款多余金额进入可用余额)</div> -->
        </el-form-item>
        <!--                <el-form-item label="平账">-->
        <!--                    <div v-for="(item ,index) in debtList" :key="index">-->
        <!--                        {{ item.user_name }}-->
        <!--                        <el-checkbox-group @change="debtChange" v-model="debtCheck" class="debt-check">-->
        <!--                            <el-checkbox v-for="(item1, index1) in item.items" :key="index1" :label="item1.no">-->
        <!--                                订单号：{{ item1.no }}<br />欠款金额：{{ item1.debt_amount }}<br />订单来源：{{ item1.name }}-->
        <!--                            </el-checkbox>-->
        <!--                        </el-checkbox-group>-->
        <!--                    </div>-->
        <!--                    <div v-if="debtList.length === 0">该课题组账号暂无欠款，金额将全数充入余额</div>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item v-if="debtList.length > 0" label="平账金额">{{ totalPrice }}</el-form-item>-->
        <el-form-item label="备注">
          <el-input size="small" class="max-width-300" v-model="rechargeForm.note" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('rechargeForm')">充值</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    researchGroupAccountList,
    deleteResearchGroupAccount,
    researchGroupAccountRecharge,
    debtDetail
  } from '@/api/research'
  import {
    checkNode
  } from '@/utils/validate'
  import Empty from '@/components/Empty'
  import {
    checkGtZero
  } from '@/utils/validate'

  export default {
    components: {
      Empty
    },
    data() {
      return {
        loading: false,
        dialogFormVisible: false,
        totalPrice: 0,
        queryForm: {
          page: 1,
          size: 10,
          sort: 'created_at',
          sort_type: 'desc',
          name: '',
          is_deleted: '',
          factory_id: '',
        },
        rechargeForm: {
          research_group_account_id: '',
          amount: '',
          nos: '',
          note: ''
        },
        rules: {
          amount: [{
            required: true,
            message: '请输入充值金额',
            trigger: 'blur'
          }]
        },
        currentAccount: {},
        list: [],
        debtList: [],
        debtAll: [],
        debtCheck: [],
        total: 0
      }
    },
    created() {
      this.queryForm.factory_id = this.currentFactoryId;

      this.queryList()
    },
    methods: {
      queryList() {
        this.loading = true
        researchGroupAccountList(this.queryForm).then(res => {
          this.loading = false
          if (res.status === 200) {
            this.list = res.data.data
            this.total = res.data.total
          }
        }).catch(_ => {
          this.loading = false
        })
      },
      resetQuery() {
        this.queryForm.page = 1
        this.queryList()
      },
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.debtList.length > 0 && (this.rechargeForm.amount + this.currentAccount.amount) < this
              .totalPrice) {
              this.$message.error('充值金额与可用余额之和不能低于已选还款金额')
              return false
            }
            this.rechargeForm.nos = this.debtCheck.join(',')
            researchGroupAccountRecharge(this.rechargeForm).then(response => {
              if (response.status === 1) {
                this.dialogFormVisible = false
                this.queryList()
              }
            })
          } else {
            return false
          }
        })
      },
      debtChange(data) {
        this.totalPrice = 0
        var that = this
        data.forEach(element => {
          var debtItem = that.debtAll.filter(item => {
            return item.no === element
          })
          that.totalPrice += debtItem[0].debt_amount
        })
      },
      handleDelete(row, status) {
        const text = status === 0 ? '恢复' : '删除'
        this.$confirm('确定要' + text + '课题组"' + row.name + '"吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResearchGroupAccount({
            id: row.id,
            is_deleted: status
          }).then(response => {
            if (response.status === 1) {
              this.queryList()
            }
          })
        })
      },
      toRecharge(row) {
        this.currentAccount = row
        this.rechargeForm.research_group_account_id = row.id
        this.rechargeForm.amount = ''
        this.dialogFormVisible = true
        this.totalPrice = 0
        this.debtCheck = []
        this.debtList = []
        // debtDetail({
        //   research_group_account_id: row.id
        // }).then(res => {
        //   if (res.status === 200) {
        //     var that = this
        //     this.debtList = res.data
        //     console.log("ceshi", this.debtList)

        //     this.debtList.forEach(element => {
        //       element.items.forEach(item => {
        //         that.debtAll.push(item)
        //       })
        //     })
        //   }
        // })
      },
      toAdd(id = '') {
        if (!id) {
          this.$router.push({
            path: '/research-group-account/add'
          })
        } else {
          this.$router.push({
            path: '/research-group-account/edit/' + id
          })
        }
      },
      handleSizeChange(val) {
        this.queryForm.size = val
        this.queryList()
      },
      handleCurrentChange(val) {
        this.queryForm.page = val
        this.queryList()
      },
      indexMethod(index) {
        return index + (this.queryForm.page - 1) * this.queryForm.size + 1
      },
      checkNode(node) {
        return checkNode(node)
      }
    },
  }
</script>
<style scoped>
  .debt-check>>>.el-checkbox__input {
    vertical-align: top;
  }
</style>

<style>
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #822a2c;
    color: #fff;
  }
</style>
