<template>
  <div>
    <van-sticky>
      <van-nav-bar title="我的考试" left-text="返回" left-arrow @click-left="returnTo" />
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
        :title="'考试名称：' + item.exam_name"
        :status="getStatus(item)"
      >
        <van-cell title="满分" :value="item.exam_total_score + '分'" />
        <van-cell title="合格分数线" :value="item.exam_pass_score + '分'" />
        <van-cell title="我的成绩" :value="item.user_score + '分'" />
        <van-cell title="考试时间" :value="item.created_at" />
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="未参加过考试" />
  </div>
</template>
<script>
import { examRecordList } from '@/api/security';
import { mapGetters } from 'vuex';
import { checkNode } from '@/utils/validate';
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
        is_deleted: 0,
        user_id: '',
      },
      domain: process.env.VUE_APP_DOMAIN,
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
      examRecordList(this.queryForm)
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
    getStatus(item) {
      if (item.user_score >= item.exam_pass_score && item.user_score < item.exam_total_score) {
        return '合格';
      } else if (item.user_score === item.exam_total_score) {
        return '满分';
      } else {
        return '不合格';
      }
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
