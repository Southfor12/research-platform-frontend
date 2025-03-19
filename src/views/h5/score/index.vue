<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的信用分" left-text="返回" left-arrow @click-left="returnTo" />
      <van-dropdown-menu>
        <van-dropdown-item v-model="queryForm.type" :options="scoreStatus" @change="resetQuery" />
      </van-dropdown-menu>
    </van-sticky>
    <van-panel title="我的剩余信用分" class="bottom-10" :status="member.credit_score + '分'" />
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
        :title="(item.type === 1 ? '+' : '-') + item.score"
        :status="item.type === 1 ? '奖励' : '扣分'"
      >
        <van-cell title="描述" :value="item.note" />
        <van-cell title="时间" :value="item.created_at" />
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂无信用分记录" />
  </div>
</template>
<script>
import { userScoreList } from '@/api/user';
import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';

export default {
  components: {
    Empty,
  },
  computed: {
    ...mapGetters(['member']),
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
        type: '',
        user_id: '',
      },
      scoreStatus: [
        { text: '全部状态', value: '' },
        { text: '奖励', value: 1 },
        { text: '扣分', value: -1 },
      ],
      list: [],
      total: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      userScoreList(this.queryForm)
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
    resetQuery() {
      this.queryForm.page = 1;
      this.list = [];
      this.finished = false;
      this.queryList();
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
  },
};
</script>
