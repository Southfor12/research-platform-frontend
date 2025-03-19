<template>
  <div class="info-center-container">
    <van-panel title="我的信息">
      <van-cell title="姓名" icon="manager-o" :value="member.name" />
      <van-cell title="手机号" icon="phone-o" :value="member.mobile" />
    </van-panel>
    <!-- <van-cell-group class="top-15">
            <van-cell title="我的培训" @click="to('/h5/my-train')" is-link icon="notes-o" />
            <van-cell title="我的考试" @click="to('/h5/my-exam')" is-link icon="newspaper-o" />
            <van-cell title="我的信用分" @click="to('/h5/my-score')" is-link icon="points" />
            <van-cell title="可使用账号" @click="to('/h5/my-account')" is-link icon="balance-o" />
            <van-cell title="可预约仪器" @click="to('/h5/my-apparatus')" is-link icon="desktop-o" />
            <van-cell title="我的实验室" @click="to('/h5/my-platform')" is-link icon="hotel-o" />
            <van-cell title="我的课题组" @click="to('/h5/my-research-group')" is-link icon="apps-o" />
        </van-cell-group> -->
    <van-grid clickable class="top-15">
      <!-- <van-grid-item icon="orders-o" text="我的预约" url="/h5/my-appointment" />
            <van-grid-item icon="notes-o" text="我的培训" url="/h5/my-train" />
            <van-grid-item icon="newspaper-o" text="我的考试" url="/h5/my-exam" />
            <van-grid-item icon="points" text="我的信用分" url="/h5/my-score" />
            <van-grid-item icon="balance-o" text="可使用账号" url="/h5/my-account" />
            <van-grid-item icon="desktop-o" text="可预约仪器" url="/h5/my-apparatus" />
            <van-grid-item icon="hotel-o" text="我的实验室" url="/h5/my-platform" />
            <van-grid-item icon="apps-o" text="我的课题组" url="/h5/my-research-group" /> -->
      <van-grid-item icon="orders-o" text="我的预约" @click="to('/h5/my-appointment')" />
      <van-grid-item icon="notes-o" text="我的培训" @click="to('/h5/my-train')" />
      <van-grid-item icon="newspaper-o" text="我的考试" @click="to('/h5/my-exam')" />
      <van-grid-item icon="points" text="我的信用分" @click="to('/h5/my-score')" />
      <van-grid-item icon="balance-o" text="可使用账号" @click="to('/h5/my-account')" />
      <van-grid-item icon="desktop-o" text="可预约仪器" @click="to('/h5/my-apparatus')" />
      <van-grid-item icon="hotel-o" text="我的实验室" @click="to('/h5/my-platform')" />
      <van-grid-item icon="apps-o" text="我的课题组" @click="to('/h5/my-research-group')" />
    </van-grid>
    <van-cell-group v-if="checkNode('research_group')" class="top-15">
      <van-cell
        title="学生入室审核"
        @click="to('/h5/leader-audit-apply-list')"
        is-link
        icon="peer-pay"
      />
      <van-cell
        title="学生离室审核"
        @click="to('/h5/leader-audit-exit-list')"
        is-link
        icon="credit-pay"
      />
      <van-cell
        title="试剂耗材申领审核"
        @click="to('/h5/audit-reagent-apply-list')"
        is-link
        icon="todo-list-o"
      />
      <van-cell
        title="危化品申领审核"
        @click="to('/h5/audit-hcs-apply-list')"
        is-link
        icon="warning-o"
      />
    </van-cell-group>
    <van-cell-group v-if="checkNode('platform')" class="top-15">
      <van-cell
        title="入室审核"
        @click="to('/h5/platform-audit-apply-list')"
        is-link
        icon="peer-pay"
      />
      <van-cell
        title="离室审核"
        @click="to('/h5/platform-audit-exit-list')"
        is-link
        icon="credit-pay"
      />
      <van-cell
        title="试剂耗材申购审核"
        @click="to('/h5/audit-order-list')"
        is-link
        icon="warning-o"
      />
    </van-cell-group>
    <van-cell-group class="top-15" style="margin-bottom: 50px">
      <van-cell title="退出" @click="logout" is-link icon="exchange" />
    </van-cell-group>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { checkNode } from '@/utils/validate';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['member']),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/h5/login`);
    },
    checkNode(node) {
      return false;
      // return checkNode(node)
    },
    to(url) {
      this.$router.push(url);
    },
  },
};
</script>
