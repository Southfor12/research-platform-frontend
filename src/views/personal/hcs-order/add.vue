<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-form ref="form" :model="form" label-width="100px">
      <!-- <div style="border: 1px solid #efefef; border-radus: 10px; padding-top: 18px;">
                <el-form-item label="申请采购耗材">
                    <el-transfer
                    style="text-align: left; display: inline-block"
                    filterable
                    v-model="reagent"
                    :left-default-checked="reagentLeft"
                    :right-default-checked="[5]"
                    :titles="['未添加', '已添加']"
                    :button-texts="['取消', '添加']"
                    :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                    }"
                    @change="reagentChange"
                    :data="reagentData">
                        <div slot-scope="{ option }">{{ option.label }}</div>
                    </el-transfer>
                </el-form-item>
                <el-form-item v-if="reagent_ids_arr.length > 0" label="耗材">
                    <div v-for="(item, index) in reagent_ids_arr" :key="index">
                        {{ item.label }}：<el-input-number @change="(currentValue, oldValue) => { numberChange(currentValue, oldValue, index, 1) }" size="small" :min="1" :step="1" v-model="item.num"></el-input-number>
                    </div>
                </el-form-item>
            </div> -->
      <div style="border: 1px solid #efefef; border-radus: 10px; padding-top: 18px; margin: 18px 0">
        <el-form-item label="危化品" prop="hcs_ids_arr">
          <el-transfer
            style="text-align: left; display: inline-block"
            filterable
            v-model="reagent"
            :right-default-checked="hcs_default"
            :titles="['未添加', '已添加']"
            :button-texts="['取消', '添加']"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}',
            }"
            @change="hcsChange"
            :data="hcsData"
          >
            <div slot-scope="{ option }">{{ option.label }}</div>
          </el-transfer>
        </el-form-item>
        <el-form-item v-if="hcs_ids_arr.length > 0" label="危化品">
          <div v-for="(item, index) in hcs_ids_arr" :key="index">
            {{ item.label }}：<el-input-number
              @change="
                (currentValue, oldValue) => {
                  numberChange(currentValue, oldValue, index, 2);
                }
              "
              size="small"
              :min="1"
              :step="1"
              v-model="item.num"
            ></el-input-number>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          rows="3"
          size="small"
          class="max-width-300"
          v-model="form.note"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { chemicalOrderInfo, addChemicalOrder, editChemicalOrder } from '@/api/stock';
import { reagentList } from '@/api/reagent';
import { hcsList } from '@/api/hcs';

export default {
  data() {
    return {
      loading: false,
      form: {
        id: '',
        data: [],
        reagent_ids_arr: [],
        hcs_ids_arr: [],
      },
      reagentData: [],
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
    this.getReagent();
    this.getHcs();
    if (this.$route.params.id) {
      this.getInfo();
    }
  },
  methods: {
    // getInfo() {
    //     this.form.id = this.$route.params.id
    //     if (this.form.id) {
    //         chemicalOrderInfo({ id: this.form.id }).then(response => {
    //             if (response.status !== 200) {
    //                 this.returnToList()
    //             } else {
    //                 const data = response.data
    //                 this.form.note = data.note
    //                 data.data.forEach(item => {
    //                     if ('reagent_id' in item) {
    //                         this.reagentData.push({
    //                             reagent_id: item.reagent_id,
    //                             name: item.name,
    //                             number: item.number
    //                         })
    //                         this.reagent.push({
    //                             id: item.reagent_id,
    //                             name: item.name
    //                         })
    //                         this.form.reagent_ids_arr.push(item.reagent_id)
    //                     } else if ('hcs_id' in item) {
    //                         this.hcsData.push({
    //                             hcs_id: item.hcs_id,
    //                             name: item.name,
    //                             number: item.number
    //                         })
    //                         this.hcses.push({
    //                             id: item.hcs_id,
    //                             name: item.name
    //                         })
    //                         this.form.hcs_ids_arr.push(item.hcs_id)
    //                     }
    //                 })
    //             }
    //         })
    //     } else {
    //         this.returnToList()
    //     }
    // },
    getInfo() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        chemicalOrderInfo({ id: this.form.id }).then((response) => {
          if (response.status !== 200) {
            this.returnToList();
          } else {
            const data = response.data;
            this.form.note = data.note;
            data.data.forEach((item) => {
              if ('reagent_id' in item) {
                // this.reagentData.push({
                //     key: item.reagent_id,
                //     label: item.name,
                // })
                this.reagentRight.push(item.reagent_id);
                console.log(this.reagentRight);
                // this.reagent.push({
                //     id: item.reagent_id,
                //     name: item.name
                // })
                // this.form.reagent_ids_arr.push(item.reagent_id)
              } else if ('hcs_id' in item) {
                // this.hcsData.push({
                //     key: item.reagent_id,
                //     label: item.name,
                // })
                // this.hcs_ids_arr.push(item.reagent_id)
                console.log(this.hcs_ids_arr);
                // this.hcses.push({
                //     id: item.hcs_id,
                //     name: item.name
                // })
                // this.form.hcs_ids_arr.push(item.hcs_id)
              }
            });
          }
        });
      } else {
        this.returnToList();
      }
    },
    reagentChange(value, direction, movedKeys) {
      var that = this;
      this.reagentData.forEach((item) => {
        movedKeys.forEach((id) => {
          if (item.key === id) {
            if (direction === 'right') {
              that.reagent_ids_arr.push(item);
            } else {
              var index = that.reagent_ids_arr.findIndex(function (item) {
                return item.key === id;
              });
              that.reagent_ids_arr.splice(index, 1);
            }
          }
        });
      });
    },
    hcsChange(value, direction, movedKeys) {
      var that = this;
      this.hcsData.forEach((item) => {
        movedKeys.forEach((id) => {
          if (item.key === id) {
            if (direction === 'right') {
              that.hcs_ids_arr.push(item);
            } else {
              var index = that.hcs_ids_arr.findIndex(function (item) {
                return item.key === id;
              });
              that.hcs_ids_arr.splice(index, 1);
            }
          }
        });
      });
    },
    getReagent(query = '') {
      this.searchReagentForm.name = query;
      reagentList(this.searchReagentForm).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            this.reagentData.push({
              key: item.id,
              label: item.name,
              num: 0,
            });
          });
        }
      });
    },
    submit(form) {
      var text = '';
      this.form.data = [];
      if (this.hcs_ids_arr.length === 0) {
        this.$message.error('至少申请一项');
        return false;
      }
      if (this.reagent_ids_arr.length > 0) {
        this.reagent_ids_arr.forEach((item) => {
          this.form.data.push({
            reagent_id: item.key,
            number: item.num,
          });
        });
      }
      if (this.hcs_ids_arr.length > 0) {
        this.hcs_ids_arr.forEach((item) => {
          this.form.data.push({
            hcs_id: item.key,
            number: item.num,
          });
        });
      }
      this.form.data = JSON.stringify(this.form.data);
      this.loading = true;
      if (this.form.id) {
        editChemicalOrder(this.form)
          .then((response) => {
            this.loading = false;
            if (response.status === 1) {
              this.returnToList();
            }
          })
          .catch((error) => {
            this.loading = false;
          });
      } else {
        addChemicalOrder(this.form)
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
    },
    getHcs(query = '') {
      this.searchReagentForm.name = query;
      hcsList(this.searchReagentForm).then((res) => {
        if (res.status === 200) {
          res.data.data.forEach((item) => {
            this.hcsData.push({
              key: item.id,
              label: item.name,
              num: 0,
            });
          });
        }
      });
    },
    returnToList() {
      this.$router.push({ path: '/personal/hcs-order/list' });
    },
  },
};
</script>
