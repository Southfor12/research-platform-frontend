<template>
  <div>
    <van-sticky>
      <van-nav-bar title="可预约仪器" left-text="返回" left-arrow @click-left="returnTo" />
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
        :title="item.apparatus_name"
      >
        <van-cell
          title="折扣"
          :value="item.discount === 100 ? '无折扣' : (item.discount / 10).toFixed(1) + '折'"
        />
        <div slot="footer" class="text-right">
          <van-button size="small" @click="toAppoint(item.apparatus_id)">前往预约</van-button>
        </div>
      </van-panel>
    </van-list>
    <empty v-if="list.length === 0 && finished" description="暂无可预约仪器" />
  </div>
</template>
<script>
import { myApparatusList, deleteApparatusAuthUser } from '@/api/apparatus';
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
        is_sharing: 1,
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
      myApparatusList(this.queryForm)
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
    toAppoint(id) {
      this.$router.push('/h5/appointment/do/' + id);
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
