<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的实验室" left-text="返回" left-arrow @click-left="returnTo" />
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
        :title="item.platform_name"
        :status="dateFormat(item.expired_at) + '过期'"
      >
        <van-cell title="可携带危化品" :value="item.hcses ? item.hcses : '-'" />
        <!-- <div slot="footer" class="text-right" v-if="item.status === 1 && item.is_arrive === 0">
                    <van-button size="small" type="primary" @click="toSignIn(item.id)">签到</van-button>
                    <van-button size="small" type="danger" @click="toCancel(item.id)">取消报名</van-button>
                </div> -->
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂无加入的实验室" />
  </div>
</template>
<script>
import { platformList, platformUserList, platformScoreRecordList } from '@/api/platform';
import { checkNode } from '@/utils/validate';
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
      dialogVisible: false,
      dialogScoreVisible: false,
      queryForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        platform_id: '',
        user_id: '',
        name: '',
      },
      queryScoreForm: {
        page: 1,
        size: 10,
        user_id: '',
        platform_id: '',
        platform_name: '',
        is_deleted: 0,
      },
      queryUserForm: {
        page: 1,
        size: 10,
        sort: 'created_at',
        sort_type: 'desc',
        is_deleted: 0,
        platform_id: '',
        platform_name: '',
      },
      scoreTotal: 0,
      domain: process.env.VUE_APP_DOMAIN,
      list: [],
      userList: [],
      scoreList: [],
      platforms: [],
      total: 0,
      userTotal: 0,
    };
  },
  created() {
    this.queryForm.user_id = this.member.id;
    this.queryScoreForm.user_id = this.member.id;
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      platformUserList(this.queryForm)
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
    queryScoreList() {
      platformScoreRecordList(this.queryScoreForm).then((res) => {
        if (res.status === 200) {
          this.scoreList = res.data.data;
          this.scoreTotal = res.data.total;
        }
      });
    },
    dateFormat(time) {
      return time.substring(0, 10);
    },
    getPlatforms() {
      platformList({ page: 1, size: 100, is_deleted: 0 }).then((res) => {
        if (res.status === 200) {
          this.platforms = res.data.data;
        }
      });
    },
    showUserList(row) {
      this.userList = [];
      this.queryUserForm.page = 1;
      this.queryUserForm.platform_name = row.platform_name;
      this.queryUserForm.platform_id = row.platform_id;
      this.queryUserList();
      this.dialogVisible = true;
    },
    queryUserList() {
      platformUserList(this.queryUserForm).then((res) => {
        if (res.status === 200) {
          this.userList = res.data.data;
          this.userTotal = res.data.total;
        }
      });
    },
    toScoreList(row) {
      this.scoreList = [];
      this.queryScoreForm.page = 1;
      this.queryScoreForm.platform_id = row.platform_id;
      this.queryScoreForm.platform_name = row.platform_name;
      this.queryScoreList();
      this.dialogScoreVisible = true;
    },
    returnTo() {
      this.$router.push({ path: '/h5/info-center' });
    },
  },
};
</script>
