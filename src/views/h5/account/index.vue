<template>
  <div>
    <van-sticky>
      <van-nav-bar title="可使用账号" left-text="返回" left-arrow @click-left="returnTo" />
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
        :title="item.research_group_account_name"
      >
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂无可使用账号" />
  </div>
</template>
<script>
import { researchGroupAccountAuthList, researchGroupAccountCashFlow } from '@/api/research';
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
        is_deleted: '0',
        user_id: '',
      },
      queryBillForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        research_group_account_name: '',
        research_group_account_id: '',
      },
      list: [],
      billList: [],
      billTotal: 0,
      total: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryBillForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      researchGroupAccountAuthList(this.queryForm)
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
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
  },
};
</script>
