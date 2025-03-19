<template>
  <div>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="预约人">
        <div class="width-180">{{ form.creator_name }}</div>
      </el-form-item>
      <el-form-item label="实验操作人">
        <div v-html="form.user_name"></div>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="预约类型">
        <div class="width-180">
          {{ form.type === 1 ? '自主检测' : '送样检测' }}
        </div>
      </el-form-item>
      <el-form-item label="预约时间">
        <div v-html="form.booking_time"></div>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="样品名称">
        <div class="width-180">{{ form.sample_name }}</div>
      </el-form-item>
      <el-form-item label="样品数量">{{ form.sample_num }}份</el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="检测要求">
        <div class="width-180">{{ form.note || '-' }}</div>
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="报告类型">
        <span v-if="form.report_type === 0">原始数据</span>
        <span v-if="form.report_type === 1">数据报告/中文</span>
        <span v-if="form.report_type === 2">数据报告/英文</span>
        <span v-if="form.report_type === 3">数据报告/中英文</span>
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="报告发送方式">
        {{ form.reposrt_send_type === 1 ? '自取' : '寄送' }}
      </el-form-item>
      <el-form-item label="所选收费项目">
        <span v-for="(item, index) in form.items" :key="index">
          {{ index + 1 }}、{{ item.title }}
        </span>
        <div v-if="form.items.length === 0">未选任何收费项</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item v-if="form.type === 1" label="耗材">
        <div class="width-180" v-for="(item, index) in form.reagents" :key="index">
          名称：{{ item.reagent_name }}，预约使用量：{{ item.price_number_num }}单位量
        </div>
        <div class="width-180" v-if="form.reagents.length === 0">无</div>
      </el-form-item>
      <el-form-item v-if="form.type === 1" label="自带耗材">
        {{ form.carry_reagents ? form.carry_reagents.split(',') : '无' }}
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item v-if="form.type === 1" label="危化品">
        <div class="width-180" v-for="(item, index) in form.hcses" :key="index">
          名称：{{ item.reagent_name }}，预约使用量：{{ item.price_number_num }}单位量，等级：{{
            item.level
          }}，规格：{{ item.specification }}
        </div>
        <div class="width-180" v-if="form.hcses.length === 0">无</div>
      </el-form-item>
      <el-form-item v-if="form.type === 1" label="自带危化品">
        {{ form.carry_hcses ? form.carry_hcses.split(',') : '无' }}
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="130px">
      <el-form-item label="总费用">
        <div class="width-180">{{ form.total_charge }}元</div>
      </el-form-item>
      <el-form-item label="实际费用">{{
        form.is_charge ? form.total_amount + '元' : '未结算'
      }}</el-form-item>
    </el-form>
    <el-form label-width="130px">
      <el-form-item label="发票信息">
        <div v-if="form.invoice.id > 0">
          <el-form label-width="100px">
            <el-form-item label="发票类型">
              <span v-if="form.invoice.type === 1">增值税普通发票</span>
              <span v-if="form.invoice.type === 2">增值税普通发票</span>
              <span v-if="form.invoice.type === 3">组织（非企业）增值税普通发票</span>
            </el-form-item>
            <el-form-item label="发票抬头">{{
              form.invoice.head ? form.invoice.head : '-'
            }}</el-form-item>
            <el-form-item label="纳税人识别号">{{
              form.invoice.no ? form.invoice.no : '-'
            }}</el-form-item>
            <el-form-item label="开户银行">{{
              form.invoice.bank ? form.invoice.bank : '-'
            }}</el-form-item>
            <el-form-item label="银行账户">{{
              form.invoice.bank_no ? form.invoice.bank_no : '-'
            }}</el-form-item>
            <el-form-item label="联系地址">{{
              form.invoice.address ? form.invoice.address : '-'
            }}</el-form-item>
            <el-form-item label="联系电话">{{
              form.invoice.mobile ? form.invoice.mobile : '-'
            }}</el-form-item>
          </el-form>
        </div>
        <span v-else>无</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { trainList } from '@/api/train';

export default {
  name: 'ApparatusInfo',
  props: {
    form: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      train: [],
      apparatusTrain: [],
      serviceTrain: [],
    };
  },
  methods: {},
};
</script>
