<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading">
    <el-form ref="form" :model="form" label-width="100px">
      <div style="border: 1px solid #efefef; border-radus: 10px; padding-top: 18px; margin: 18px 0">
        <el-form-item label="单位" prop="factory_id">
          <el-select @change="onFactoryChange" v-model="form.factory_id" :clearable="false" size="small"
            class="width-200" placeholder="选择单位">
            <el-option :label="factory.name" :value="factory.id" :key="idx"
              v-for="(factory,idx) in getSelectableFactories()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危化品" prop="hcs_ids_arr">
          <el-transfer style="text-align: left; display: inline-block" filterable v-model="reagent"
            :right-default-checked="hcs_default" :titles="['未添加', '已添加']" :button-texts="['取消', '添加']" :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }" @change="hcsChange" :data="hcsData">
            <div slot-scope="{ option }">{{ option.label }}</div>
          </el-transfer>
        </el-form-item>
        <el-form-item v-if="hcs_ids_arr.length > 0" label="危化品">
          <div v-for="(item, index) in hcs_ids_arr" :key="index">
            {{ item.label }}：<el-input-number @change="
                (currentValue, oldValue) => {
                  numberChange(currentValue, oldValue, index, 2);
                }
              " size="small" :min="1" :step="1" v-model="item.num"></el-input-number>
            {{ item.price }}元/单位量（1单位量：{{ item.price_number }}{{ item.unit }}）
          </div>
        </el-form-item>
      </div>
      <el-form-item label="预计费用">
        <div style="color: #ff0000">{{ totalPrice }} 元</div>
      </el-form-item>
      <el-form-item label="付款账号" prop="research_group_account_id">
        <el-select v-model="form.research_group_account_id" size="small" @change="accountChange" clearable
          class="max-width-200" filterable reserve-keyword placeholder="请选择付款账号">
          <el-option v-for="(item, index) in accounts" :key="index" :label="item.research_group_account_name"
            :value="item.research_group_account_id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.research_group_account_id" class="invoice-info" label="发票信息">
        <el-radio-group v-model="form.invoice_id">
          <el-radio style="display: block; margin-top: 10px" v-for="(item, index) in invoices" :key="index"
            :label="item.id">
            <div style="display: inline-block">
              发票类型：{{
                item.type === 1
                  ? '增值税普通发票'
                  : item.type === 2
                    ? '增值税专用发票'
                    : '组织（非企业）增值税普通发票'
              }}<br />
              发票抬头：{{ item.head }}<br />
              识别号：{{ item.no }}<br />
              开户银行：{{ item.bank }}<br />
              银行账户：{{ item.bank_no }}<br />
              地址：{{ item.address }}<br />
              电话：{{ item.mobile }}
            </div>
          </el-radio>
        </el-radio-group>
        <span v-if="invoices.length === 0">暂无发票信息</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" rows="3" size="small" class="width-500" :rows="5" v-model="form.note"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    addChemicalBooking,
    chemicalBookingMoney
  } from '@/api/chemical';
  import {
    invoiceList
  } from '@/api/invoice';
  import {
    researchGroupAccountAuthList
  } from '@/api/research';
  import {
    reagentList
  } from '@/api/reagent';
  import {
    hcsList
  } from '@/api/hcs';
  import {
    mapGetters
  } from 'vuex';

  export default {
    data() {
      return {
        loading: false,
        form: {
          id: '',
          booking_type: 3,
          research_group_account_id: '',
          invoice_id: '',
          reagent_ids: '',
          hcs_ids: '',
          note: '',
          factory_id: '',
        },
        totalPrice: 0,
        reagentData: [],
        accounts: [],
        invoices: [],
        hcsData: [],
        reagent_ids_arr: [],
        reagent: [],
        hcses: [],
        hcs_ids_arr: [],
        reagentLeft: [],
        reagentRight: [],
        hcs_default: [],
        searchReagentForm: {
          page: 1,
          size: 30,
          is_deleted: 0,
          name: '',
        },
        searchHcsForm: {
          page: 1,
          size: 30,
          is_deleted: 0,
          name: '',
        },
      };
    },
    created() {
      this.form.factory_id = this.currentFactoryId;

      this.getReagent();
      this.getHcs();
      this.getAccounts();
    },
    computed: {
      ...mapGetters(['member']),
    },
    methods: {
      onFactoryChange() {
        this.form.research_group_account_id = '';
        this.form.invoice_id = '';
        this.form.reagent_ids = '';
        this.form.hcs_ids = '';

        this.totalPrice = 0;
        this.reagentData = [];
        this.accounts = [];
        this.invoices = [];
        this.hcsData = [];
        this.reagent_ids_arr = [];
        this.reagent = [];
        this.hcses = [];
        this.hcs_ids_arr = [];
        this.reagentLeft = [];
        this.reagentRight = [];
        this.hcs_default = [];

        this.getReagent();
        this.getHcs();
        this.getAccounts();
      },
      reagentChange(value, direction, movedKeys) {
        var that = this;
        this.reagentData.forEach((item) => {
          movedKeys.forEach((id) => {
            if (item.key === id) {
              if (direction === 'right') {
                that.reagent_ids_arr.push(item);
              } else {
                var index = that.reagent_ids_arr.findIndex(function(item) {
                  return item.key === id;
                });
                that.reagent_ids_arr.splice(index, 1);
              }
            }
          });
        });
        this.getPrice();
      },
      hcsChange(value, direction, movedKeys) {
        var that = this;
        this.hcsData.forEach((item) => {
          movedKeys.forEach((id) => {
            if (item.key === id) {
              if (direction === 'right') {
                that.hcs_ids_arr.push(item);
              } else {
                var index = that.hcs_ids_arr.findIndex(function(item) {
                  return item.key === id;
                });
                that.hcs_ids_arr.splice(index, 1);
              }
            }
          });
        });
        this.getPrice();
      },
      accountChange(value) {
        this.invoices = [];
        this.form.invoice_id = '';
        if (value) {
          this.loading = true;
          this.accounts.forEach((item) => {
            this.loading = false;
            if (item.research_group_account_id === value) {
              invoiceList({
                research_group_id: item.research_group_id,
                size: 100,
              }).then((res) => {
                this.invoices = res.data.data;
              });
            }
          });
        }
      },
      getReagent(query = '') {
        this.searchReagentForm.name = query;
        this.searchReagentForm.factory_id = this.form.factory_id;
        reagentList(this.searchReagentForm).then((res) => {
          if (res.status === 200) {
            res.data.data.forEach((item) => {
              this.reagentData.push({
                key: item.id,
                label: item.name,
                num: 1,
                price: item.price,
                price_number: item.price_number,
                unit: item.unit,
              });
            });
          }
        });
      },
      getAccounts() {
        researchGroupAccountAuthList({
          page: 1,
          size: 100,
          user_id: this.member.id,
          factory_id: this.form.factory_id,
        }).then((res) => {
          if (res.status === 200) {
            this.accounts = res.data.data;
          }
        });
      },
      getPrice() {
        var countForm = {
          reagent_ids: '',
          hcs_ids: '',
        };
        if (this.reagent_ids_arr.length > 0) {
          var reagent_ids_arr = [];
          this.reagent_ids_arr.forEach((item) => {
            reagent_ids_arr.push({
              reagent_id: item.key,
              price_number_num: item.num <= 0 ? 1 : item.num,
            });
          });
          countForm.reagent_ids = JSON.stringify(reagent_ids_arr);
        }
        if (this.hcs_ids_arr.length > 0) {
          var hcs_ids_arr = [];
          this.hcs_ids_arr.forEach((item) => {
            hcs_ids_arr.push({
              hcs_id: item.key,
              price_number_num: item.num <= 0 ? 1 : item.num,
            });
          });
          countForm.hcs_ids = JSON.stringify(hcs_ids_arr);
        }
        this.loading = true;
        chemicalBookingMoney(countForm).then((res) => {
          this.loading = false;
          if (res.status === 200) this.totalPrice = res.data.total_charge;
        });
      },
      submit(form) {
        var text = '';
        this.form.reagent_ids = [];
        this.form.hcs_ids = [];
        if (this.hcs_ids_arr.length === 0) {
          this.$message.error('至少申请一项');
          return false;
        }
        if (this.reagent_ids_arr.length > 0) {
          this.reagent_ids_arr.forEach((item) => {
            this.form.reagent_ids.push({
              reagent_id: item.key,
              price_number_num: item.num,
            });
          });
          this.form.reagent_ids = JSON.stringify(this.form.reagent_ids);
        }
        if (this.hcs_ids_arr.length > 0) {
          this.hcs_ids_arr.forEach((item) => {
            this.form.hcs_ids.push({
              hcs_id: item.key,
              price_number_num: item.num,
              level: item.level,
              specification: item.specification,
            });
          });
          this.form.hcs_ids = JSON.stringify(this.form.hcs_ids);
        }
        if (!this.form.research_group_account_id) {
          this.$message.error('请选择付款账户');
          return false;
        }
        this.loading = true;
        if (this.form.id) {
          // editChemicalOrder(this.form).then(response => {
          //     this.loading = false
          //     if (response.status === 1) {
          //         this.returnToList()
          //     }
          // }).catch(error => {
          //     this.loading = false
          // })
        } else {
          addChemicalBooking(this.form)
            .then((response) => {
              this.loading = false;
              if (response.status === 1) {
                this.returnToList();
              }
            })
            .catch((error) => {
              this.loading = false;
            });
        }
      },
      numberChange(current, pre, index, type) {
        if (current !== 0 && !current) {
          if (type === 1) {
            this.reagent_ids_arr[index].num = -1;
          } else if (type === 2) {
            this.hcs_ids_arr[index].num = -1;
          }
        }
        this.getPrice();
      },
      getHcs(query = '') {
        this.searchReagentForm.name = query;
        this.searchReagentForm.factory_id = this.form.factory_id;
        hcsList(this.searchReagentForm).then((res) => {
          if (res.status === 200) {
            res.data.data.forEach((item) => {
              this.hcsData.push({
                key: item.id,
                label: item.name,
                num: 1,
                price: item.price,
                price_number: item.price_number,
                unit: item.unit,
                level: '',
                specification: '',
              });
            });
          }
        });
      },
      returnToList() {
        this.$router.push({
          path: '/personal/hcs-apply/list',
        });
      },
    },
  };
</script>
<style scoped>
  .invoice-info>>>.el-radio__input {
    vertical-align: top;
  }
</style>
