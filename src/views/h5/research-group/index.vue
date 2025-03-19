<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的课题组" left-text="返回" left-arrow @click-left="returnTo" />
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
        :title="item.research_group_name"
        :status="item.status ? '正常' : '异常'"
      >
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂未参加课题组" />
  </div>
</template>
<script>
import { researchGroupUserList } from '@/api/research';
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
        status: '1',
        user_id: '',
      },
      queryUserForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        status: '1',
        research_group_id: '',
        research_group_name: '',
      },
      list: [],
      userList: [],
      verifyArr: new Array(),
      total: 0,
      userTotal: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      researchGroupUserList(this.queryForm)
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
