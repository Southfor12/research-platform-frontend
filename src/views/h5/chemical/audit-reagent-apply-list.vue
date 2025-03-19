<template>
  <div>
    <van-sticky>
      <van-nav-bar title="试剂耗材申领审核" left-text="返回" left-arrow @click-left="returnTo" />
      <van-dropdown-menu>
        <van-dropdown-item
          @change="resetQuery"
          v-model="queryForm.mentor_audit"
          :options="statusOptions"
        />
      </van-dropdown-menu>
    </van-sticky>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="queryList">
      <div>
        <van-panel
          v-for="(item, index) in list"
          :key="index"
          :title="'申领人：' + item.user_name"
          :desc="'备注：' + (item.note ? item.note : '-')"
          :class="getStatus(item).class"
          :status="getStatus(item).title"
        >
          <div class="book-container">
            <div class="book-item">
              采购明细：
              <span style="margin-right: 5px" v-for="(item1, index) in item.reagents" :key="index"
                >{{ item1.reagent_name }}×{{ item1.price_number_num }}</span
              >
            </div>
            <div class="book-item">
              金额： <span>{{ item.total_charge }}</span>
            </div>
          </div>
          <div v-if="item.mentor_audit === 0" slot="footer" class="book-footer">
            <van-button size="small" type="primary" @click="handleAudit(item.id, 1)"
              >通过</van-button
            >
            <van-button size="small" type="danger" @click="handleAudit(item.id, -1)"
              >拒绝</van-button
            >
          </div>
        </van-panel>
      </div>
    </van-list>
    <van-dialog
      v-model="auditDialogVisible"
      title="提示"
      show-cancel-button
      :before-close="comfirmAudit"
    >
      <van-cell-group v-if="auditForm.status === -1">
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
  </div>
</template>
<script>
import { chemicalBookingList, mentorAuditChemicalBooking } from '@/api/chemical';
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
        booking_type: '2',
        mentor_id: '',
        mentor_audit: '',
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
        { text: '待导师审核', value: '0' },
        { text: '导师已通过', value: '1' },
        { text: '导师已拒绝', value: '-1' },
      ],
    };
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
      this.queryForm.mentor_audit = value;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      this.queryForm.mentor_id = this.member.id;
      chemicalBookingList(this.queryForm)
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
      if (this.auditForm.status === -1 && !this.auditForm.reason) {
        Notify({ type: 'warning', message: '请填写拒绝理由' });
        done(false);
        return false;
      }
      mentorAuditChemicalBooking(this.auditForm).then((response) => {
        if (response.status === 1) {
          this.list.forEach((item) => {
            if (item.id === this.auditForm.id) {
              item.mentor_audit = response.data.booking.mentor_audit;
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
    getStatus(item) {
      var data = { title: '', class: 'check-pending' };
      switch (item.mentor_audit) {
        case 0:
          data.title = '待导师审核';
          break;
        case 1:
          if (item.status === 0) {
            data.title = '待负责人审核';
          } else if (item.status === 1) {
            data.title = '已通过';
            data.class = 'check-pass';
          } else {
            data.title = '负责人已拒绝';
            data.class = 'cancle-booking';
          }
          break;
        case -1:
          data.title = '导师已拒绝';
          data.class = 'cancle-booking';
          break;
      }
      return data;
    },
    checkNode(node) {
      return checkNode(node);
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
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
