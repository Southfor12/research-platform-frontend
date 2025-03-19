<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的培训" left-text="返回" left-arrow @click-left="returnTo" />
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="queryForm.is_arrive"
          :options="arriveStatus"
          @change="resetQuery"
        />
      </van-dropdown-menu>
    </van-sticky>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="list.length === 0 && finished ? '' : '没有更多了'"
      @load="loadMore"
    >
      <van-panel
        v-for="(item, index) in list"
        :key="index"
        class="bottom-10"
        :title="item.train_name"
        :status="item.is_passed ? '已通过' : '未通过'"
      >
        <van-cell title="订单号" :value="item.order_no" />
        <van-cell title="签到状态" :value="item.is_arrive ? '已签到' : '未签到'" />
        <div slot="footer" class="text-right" v-if="item.status === 1 && item.is_arrive === 0">
          <van-button size="small" type="primary" @click="toSignIn(item.id)">签到</van-button>
          <van-button size="small" type="danger" @click="toCancel(item.id)">取消报名</van-button>
        </div>
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂无培训" />
  </div>
</template>
<script>
import { platformList } from '@/api/platform';
import { trainEnrollList, deleteTrainEnroll, cancelTrainEnroll, trainSignIn } from '@/api/train';
import { checkNode } from '@/utils/validate';
import { mapGetters } from 'vuex';
import { Dialog } from 'vant';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      finished: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        user_id: '',
        is_arrive: '',
      },
      arriveStatus: [
        { text: '全部状态', value: '' },
        { text: '未签到', value: 0 },
        { text: '已签到', value: 1 },
      ],
      platforms: [],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryList();
    this.getPlatforms();
  },
  computed: {
    ...mapGetters(['member']),
  },
  methods: {
    queryList() {
      this.loading = true;
      trainEnrollList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            res.data.data.forEach((element) => {
              this.list.push(element);
            });
            this.total = res.data.total;
            if (this.total === this.list.length) this.finished = true;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    loadMore() {
      this.queryForm.page++;
      this.queryList();
    },
    getTypes(type) {
      switch (type) {
        case 1:
          return '仪器培训';
        case 2:
          return '服务培训';
        case 3:
          return '技术培训';
      }
    },
    toCancel(id) {
      Dialog.confirm({
        title: '提示',
        message: '确定要取消报名吗？',
      }).then(() => {
        cancelTrainEnroll({ id }).then((response) => {
          if (response.status === 1) {
            this.resetQuery();
          }
        });
      });
    },
    resetQuery() {
      this.queryForm.page = 1;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    handleDelete(row, status) {
      const text = status === 0 ? '恢复' : '删除';
      this.$confirm('确定要' + text + '报名吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTrainEnroll({ id: row.id, is_deleted: status }).then((response) => {
          if (response.status === 1) {
            this.queryList();
          }
        });
      });
    },
    getPlatforms() {
      platformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    toSignIn(id) {
      trainSignIn({ id }).then((response) => {
        if (response.status === 1) {
          this.resetQuery();
        }
      });
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
  },
};
</script>
