<template>
  <div>
    <el-card class="search-box">
      <div slot="header" class="search-box-header">
        <span>{{ title }}</span>
      </div>
      <div
        v-loading="loading"
        element-loading-text="数据查询中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-table :header-cell-style="{ background: '#fafafa' }" :data="list" style="width: 100%">
          <el-table-column width="150px" type="index" :index="indexMethod" label="排名" align="center"/>
          <el-table-column label="设备名称">
            <template slot-scope="scope">
              <span @click="tryOpen('/appointment/detail/' + scope.row.apparatus_id)">{{
                scope.row.apparatus_name
              }}</span>
            </template>
          </el-table-column>
          <div slot="empty">
            <empty />
          </div>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { apparatusRankList } from '@/api/apparatus';
import { platformList } from '@/api/platform';
import { userList } from '@/api/user';
import Empty from '@/components/Empty';
import { mapGetters } from 'vuex';
import { timeFormat } from '@/utils/index';

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
      queryForm: {
        page: 1,
        size: 20,
        sort: 'created_at',
        sort_type: 'desc',
        start_date: '',
        end_date: '',
      },
      title: '',
      total: 0,
      platforms: [],
      users: [],
      list: [],
      domain: process.env.VUE_APP_DOMAIN,
    };
  },
  created() {
    this.title = this.$route.meta.title;
    this.queryList();
  },
  methods: {
    tryOpen(url) {
      if (this.checkAudit('仪器预约')) {
        this.navOpen(url);
      }
    },
    queryList() {
      var currentDate = new Date();
      var month = timeFormat(
        new Date(currentDate.setDate(currentDate.getDate() - 30)),
        'yyyy-MM-dd',
      );
      var year = timeFormat(
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        'yyyy-MM-dd',
      );
      this.queryForm.end_date = timeFormat(new Date(), 'yyyy-MM-dd');
      if (this.$route.meta.sortType === 'month') {
        this.queryForm.start_date = month;
      } else {
        this.queryForm.start_date = year;
      }
      this.loading = true;
      apparatusRankList(this.queryForm)
        .then((res) => {
          this.loading = false;
          if (res.status === 200) {
            this.list = res.data;
          }
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    submit() {
      this.queryForm.page = 1;
      this.queryList();
    },
    indexMethod(index) {
      return index + (this.queryForm.page - 1) * this.queryForm.size + 1;
    },
  },
};
</script>
