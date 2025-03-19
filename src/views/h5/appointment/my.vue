<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的预约" left-text="返回" left-arrow @click-left="returnTo" />
      <van-dropdown-menu>
        <van-dropdown-item
          @change="resetQuery"
          v-model="queryForm.status"
          :options="statusOptions"
        />
      </van-dropdown-menu>
    </van-sticky>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="queryList">
      <van-panel
        v-for="(item, index) in list"
        :key="index"
        :title="'预约人：' + item.user_name"
        :desc="'检测要求：' + item.note"
        :class="{
          'check-pending': item.status === 0,
          'check-pass': item.status === 1,
          'cancle-booking': item.status === 3,
        }"
        :status="getStatus(item.status)"
      >
        <div class="book-container">
          <div class="book-item">
            预约设备： <span>{{ item.apparatus_name }}</span>
          </div>
          <div class="book-item">
            预约类型：
            <span>{{ item.type === 1 ? '自主检测' : '送样检测' }}</span>
          </div>
          <div class="book-item">
            样本名称： <span>{{ item.sample_name }}</span>
          </div>
          <div class="book-item">
            样本数量： <span>{{ item.sample_num }}</span>
          </div>
          <div v-if="item.type === 2" class="book-item">
            报告类型：
            <span v-if="item.report_type === 0">原始数据</span>
            <span v-if="item.report_type === 1">数据报告/中文</span>
            <span v-if="item.report_type === 2">数据报告/英文</span>
            <span v-if="item.report_type === 3">数据报告/中英文</span>
          </div>
          <div v-if="item.type === 2" class="book-item">
            报告发送方式：
            <span>{{ item.reposrt_send_type === 1 ? '自取' : '寄送' }}</span>
          </div>
          <div class="book-item" v-if="item.type === 1">
            预约时间：
            <span>
              {{ item.booking_time }}
            </span>
          </div>
          <div class="book-item">
            预计费用： <span>{{ item.discount_charge }} 元</span>
          </div>
          <div class="book-item">
            实际费用：
            <span>{{ item.is_charge === 1 ? item.total_amount + '元' : '未结算' }}</span>
          </div>
          <div v-if="item.type === 2" class="book-item">
            期望完成时间：
            <span>{{ item.expected_finish_date }}</span>
          </div>
          <van-collapse v-model="activeNames">
            <van-collapse-item
              :title="item.items.length > 0 ? '所选收费项目' : '未选任何收费项'"
              :disabled="item.items.length === 0"
              :name="'items' + item.id"
            >
              <div v-for="(item1, index) in item.items" :key="index">
                {{ index + 1 }}、{{ item1.title }}
              </div>
            </van-collapse-item>
            <van-collapse-item
              v-if="item.type === 1"
              :title="
                item.reagents.length === 0 && !item.carry_reagents ? '未预约任何耗材' : '预约耗材'
              "
              :disabled="item.reagents.length === 0 && !item.carry_reagents"
              :name="'hc' + item.id"
            >
              <div v-if="item.reagents.length > 0" class="bottom-10">
                <span class="book-title">设备可用耗材：</span>
              </div>
              <div v-if="item.reagents.length > 0" class="bottom-10">
                <span v-for="(reagent, index1) in item.reagents" :key="index1">
                  {{ reagent.reagent_name }}×{{ reagent.price_number_num }}
                  {{ item.reagents.length - 1 > index1 ? '、' : '' }}
                </span>
              </div>
              <div v-if="item.carry_reagents" class="bottom-10">
                <span class="book-title">自带耗材：</span>
              </div>
              <div v-if="item.carry_reagents" class="bottom-10">
                <span>{{ item.carry_reagents }}</span>
              </div>
            </van-collapse-item>
            <van-collapse-item
              v-if="item.type === 1"
              :title="
                item.hcses.length === 0 && !item.carry_hcses ? '未预约任何危化品' : '预约危化品'
              "
              :disabled="item.hcses.length === 0 && !item.carry_hcses"
              :name="'hcs' + item.id"
            >
              <div v-if="item.hcses.length > 0" class="bottom-10">
                <span class="book-title">设备可用危化品：</span>
              </div>
              <div v-if="item.hcses.length > 0" class="bottom-10">
                <span v-for="(hcs, index1) in item.hcses" :key="index1">
                  {{ hcs.reagent_name }}×{{ hcs.price_number_num }}
                  {{ item.hcses.length - 1 > index1 ? '、' : '' }}
                </span>
              </div>
              <div v-if="item.carry_hcses" class="bottom-10">
                <span class="book-title">自带危化品：</span>
              </div>
              <div v-if="item.carry_hcses" class="bottom-10">
                <span>{{ item.carry_hcses }}</span>
              </div>
            </van-collapse-item>
            <van-collapse-item
              v-if="item.type === 1 && (item.hcses.length > 0 || item.carry_hcses)"
              title="危化品审核状态"
              :name="'status' + item.id"
            >
              <div class="hcs-status">
                <van-tag v-if="item.auditor_status === 0">设备管理员待审核</van-tag>
                <van-tag type="success" v-if="item.auditor_status === 1">设备管理员已通过</van-tag>
                <van-tag type="danger" v-if="item.auditor_status === 2">设备管理员未通过</van-tag>
              </div>
              <div class="hcs-status">
                <van-tag v-if="item.admin1_status === 0">负责人1待审核</van-tag>
                <van-tag type="success" v-if="item.admin1_status === 1">负责人1已通过</van-tag>
                <van-tag type="danger" v-if="item.admin1_status === 2">负责人1未通过</van-tag>
              </div>
              <div class="hcs-status">
                <van-tag v-if="item.admin2_status === 0">负责人2待审核</van-tag>
                <van-tag type="success" v-if="item.admin2_status === 1">负责人2已通过</van-tag>
                <van-tag type="danger" v-if="item.admin2_status === 2">负责人2未通过</van-tag>
              </div>
            </van-collapse-item>
            <van-collapse-item
              :title="item.invoice.id > 0 ? '发票信息' : '无发票信息'"
              :disabled="!(item.invoice.id > 0)"
              :name="'invoice' + item.id"
            >
              <el-form label-width="100px">
                <el-form-item label="发票类型">
                  <span v-if="item.invoice.type === 1">增值税普通发票</span>
                  <span v-if="item.invoice.type === 2">增值税普通发票</span>
                  <span v-if="item.invoice.type === 3">组织（非企业）增值税普通发票</span>
                </el-form-item>
                <el-form-item label="发票抬头">{{
                  item.invoice.head ? item.invoice.head : '-'
                }}</el-form-item>
                <el-form-item label="纳税人识别号">{{
                  item.invoice.no ? item.invoice.no : '-'
                }}</el-form-item>
                <el-form-item label="开户银行">{{
                  item.invoice.bank ? item.invoice.bank : '-'
                }}</el-form-item>
                <el-form-item label="银行账户">{{
                  item.invoice.bank_no ? item.invoice.bank_no : '-'
                }}</el-form-item>
                <el-form-item label="联系地址">{{
                  item.invoice.address ? item.invoice.address : '-'
                }}</el-form-item>
                <el-form-item label="联系电话">{{
                  item.invoice.mobile ? item.invoice.mobile : '-'
                }}</el-form-item>
              </el-form>
            </van-collapse-item>
          </van-collapse>
        </div>
        <div slot="footer" class="book-footer">
          <!-- <van-button size="small" type="default" @click="handleAudit(item.id, '1')">详情</van-button> -->
          <!-- <van-button v-if="checkNode('booking_examine') && item.status === 0" size="small" type="primary" @click="handleAudit(item.id, '1')">通过</van-button>
                        <van-button v-if="checkNode('booking_examine') && item.status === 0" size="small" type="danger" @click="handleAudit(item.id, '2')">拒绝</van-button> -->
          <!-- <van-button v-if="checkNode('booking_charge') && item.status === 1 && item.is_charge === 0" size="small" type="info" @click="handleCharge(item)">实验完成并扣费</van-button> -->
          <van-button
            v-if="item.user_id === member.id && item.status < 2 && item.is_charge !== 1"
            size="small"
            @click="handleCancleBooking(item)"
            >取消预约</van-button
          >
        </div>
      </van-panel>
    </van-list>
    <van-dialog
      v-model="auditDialogVisible"
      title="提示"
      show-cancel-button
      :before-close="comfirmAudit"
    >
      <van-cell-group v-if="auditForm.status == '2'">
        <van-field
          v-model="auditForm.reason"
          label="拒绝理由"
          type="textarea"
          placeholder="请输入拒绝理由"
          rows="2"
          autosize
        />
      </van-cell-group>
      <div class="tips-container" v-else>确定要通过预约吗？</div>
    </van-dialog>
    <el-dialog
      title="实验完成并扣费"
      :fullscreen="true"
      :visible.sync="chargeDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="chargeForm" label-width="100">
        <el-form-item label="姓名">{{ currentBooking.user_name }}</el-form-item>
        <el-form-item label="设备">{{ currentBooking.apparatus_name }}</el-form-item>
        <el-form-item label="类型">{{
          currentBooking.type === 1 ? '自主检测' : '送样检测'
        }}</el-form-item>
        <el-form-item label="预计费用">{{ getPrice }}</el-form-item>
        <el-form-item label="实验日期" prop="date">
          <el-date-picker
            v-model="chargeForm.date"
            :picker-options="pickerOptions"
            type="date"
            placeholder="请选择实验日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实验起止时间" prop="timeRange">
          <el-time-picker
            is-range
            v-model="chargeForm.timeRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择实验起止时间"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="追加金额">
          <el-input
            class="max-width-100"
            @change="appendChargeChange"
            type="number"
            :min="0"
            v-model="chargeForm.append_charge"
            size="small"
          />
        </el-form-item>
        <el-form-item label="优惠金额">
          <el-input
            class="max-width-100"
            @change="subtractChargeChange"
            type="number"
            :min="0"
            v-model="chargeForm.subtract_charge"
            size="small"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmCharge('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { bookingList, bookableUpdate } from '@/api/apparatus';
import { bookingCharge, bookingCancle } from '@/api/booking';
import { checkNode } from '@/utils/validate';
import { timeFormat } from '@/utils/index';
import { mapGetters } from 'vuex';
import { Toast, Notify, Dialog } from 'vant';

export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      auditDialogVisible: false,
      chargeDialogVisible: false,
      activeNames: [],
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        user_id: '',
        status: '',
      },
      chargeForm: {
        id: '',
        apparatus_boot_at: '',
        apparatus_down_at: '',
        append_charge: 0,
        subtract_charge: 0,
        date: '',
        timeRange: [],
      },
      rules: {
        date: [
          {
            required: true,
            message: '请选择实验日期',
            trigger: 'change',
          },
        ],
        timeRange: [
          {
            required: true,
            message: '请选择实验起止时间',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return (
            new Date(timeFormat(time, 'yyyy-MM-dd hh:mm:ss').replace(/-/g, '/')).getTime() >
            Date.now()
          );
        },
      },
      currentBooking: { discount_charge: 0 },
      auditForm: { id: '', status: '', reason: '' },
      statusOptions: [
        { text: '所有状态', value: '' },
        { text: '待审核', value: '0' },
        { text: '已通过', value: '1' },
        { text: '已拒绝', value: '2' },
        { text: '已取消', value: '3' },
      ],
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
  },
  computed: {
    ...mapGetters(['member']),
    getPrice() {
      return (
        Number(this.currentBooking.discount_charge) +
        Number(this.chargeForm.append_charge) -
        Number(this.chargeForm.subtract_charge)
      );
    },
  },
  methods: {
    resetQuery(value) {
      this.queryForm.page = 1;
      this.queryForm.status = value;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      if (checkNode('')) {
      } else if (checkNode('')) {
      }
      bookingList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            res.data.data.forEach((item) => {
              this.list.push(item);
            });
            if (this.list.length === res.data.total) {
              this.finished = true;
            } else {
              this.queryForm.page++;
            }
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    handleCancleBooking(row) {
      Dialog.confirm({
        title: '提示',
        message: '确定要取消预约吗？',
      }).then(() => {
        bookingCancle({ id: row.id }).then((res) => {
          if (res.status === 1) {
            this.list.forEach((item) => {
              if (item.id === row.id) {
                item.status = 3;
              }
            });
          }
        });
      });
    },
    handleCharge(row) {
      this.currentBooking = row;
      this.chargeForm = {
        id: row.id,
        apparatus_boot_at: '',
        apparatus_down_at: '',
        append_charge: 0,
        subtract_charge: 0,
        date: '',
        timeRange: [],
      };
      this.chargeForm.date = row.date;
      if (row.type === 1) {
        this.chargeForm.timeRange = [
          new Date(
            row.date + ' ' + row.start_at.substring(0, 2) + ':' + row.start_at.substring(2) + ':00',
          ),
          new Date(
            row.date + ' ' + row.end_at.substring(0, 2) + ':' + row.end_at.substring(2) + ':00',
          ),
        ];
      }
      this.chargeDialogVisible = true;
    },
    comfirmAudit(action, done) {
      if (action === 'cancel') {
        done();
        return true;
      }
      if (this.auditForm.status == 2 && !this.auditForm.reason) {
        Notify({ type: 'warning', message: '请填写拒绝理由' });
        done(false);
        return false;
      }
      bookableUpdate(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.list.forEach((item) => {
            if (item.id === this.auditForm.id) {
              item.status = response.data.booking.status;
              item.auditor_status = response.data.booking.auditor_status;
              item.admin1_status = response.data.booking.admin1_status;
              item.admin2_status = response.data.booking.admin2_status;
            }
          });
          done();
        } else {
          done(false);
        }
      });
    },
    comfirmCharge(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.chargeForm.apparatus_boot_at =
            this.chargeForm.date + ' ' + timeFormat(this.chargeForm.timeRange[0], 'hh:mm:ss');
          this.chargeForm.apparatus_down_at =
            this.chargeForm.date + ' ' + timeFormat(this.chargeForm.timeRange[1], 'hh:mm:ss');
          bookingCharge(this.chargeForm).then((res) => {
            if (res.status === 1) {
              this.list.forEach((item) => {
                if (item.id === this.currentBooking.id) {
                  item.is_charge = 1;
                }
              });
              this.chargeDialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    handleAudit(id, status) {
      this.auditForm.id = id;
      this.auditForm.status = status;
      this.auditForm.reason = '';
      this.auditDialogVisible = true;
    },
    appendChargeChange(value) {
      if (!value || isNaN(value) || value < 0) {
        this.chargeForm.append_charge = 0;
      }
    },
    subtractChargeChange(value) {
      if (!value || isNaN(value) || value < 0) {
        this.chargeForm.subtract_charge = 0;
      }
    },
    getStatus(status) {
      switch (status) {
        case 0:
          return '待审核';
        case 1:
          return '已通过';
        case 2:
          return '已拒绝';
        case 3:
          return '已取消';
      }
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
    checkNode(node) {
      return checkNode(node);
    },
  },
};
</script>
<style lang="scss">
.check-pending {
  .van-panel__header-value {
    color: #006699;
  }
}
.check-pass {
  .van-panel__header-value {
    color: #397919;
  }
}
.cancle-booking {
  .van-panel__header-value {
    color: #888888;
  }
}
</style>
<style lang="scss" scoped>
.van-panel {
  margin-bottom: 10px;
}
.select-menu {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #efefef;
}
.book-container {
  padding: 0 16px;
}
.book-title {
  color: #060606;
}
.book-item {
  font-size: 14px;
  margin-bottom: 8px;

  span {
    color: #666666;
  }
}
.book-item:first-child {
  margin-top: 10px;
}
.book-item:last-child {
  padding-bottom: 10px;
}
.book-footer {
  text-align: right;
}
.tips-container {
  padding: 15px;
  font-size: 14px;
  color: #666;
}
</style>
