<template>
  <div class="h5-container">
    <h5-main />
    <van-tabbar v-if="showTabbar" v-model="activeItem" @change="tabChange">
      <van-tabbar-item icon="orders-o">预约</van-tabbar-item>
      <van-tabbar-item v-if="checkNode('apparatus')" icon="todo-list-o">预约审批</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { H5Main } from './components';
import { checkNode } from '@/utils/validate';
import 'vant/lib/index.css';

export default {
  name: 'H5Layout',
  components: {
    H5Main,
  },
  computed: {
    ...mapGetters(['member']),
  },
  watch: {
    $route() {
      this.routeChange();
    },
  },
  mounted() {},
  data() {
    return {
      activeItem: 0,
      showTabbar: false,
    };
  },
  created() {
    localStorage.setItem('client-type', 'h5');
    this.routeChange();
  },
  methods: {
    routeChange() {
      if (this.$route.meta.tabItem >= 0) {
        this.showTabbar = true;
        this.activeItem =
          !this.checkNode('apparatus') && this.$route.meta.tabItem === 2
            ? 1
            : this.$route.meta.tabItem;
      } else {
        this.showTabbar = false;
      }
    },
    tabChange(index) {
      switch (index) {
        case 0:
          this.$router.push({ path: '/h5/apparatus/list' });
          break;
        case 1:
          if (this.checkNode('apparatus')) {
            this.$router.push({ path: '/h5/appointment/list' });
          } else {
            this.$router.push({ path: '/h5/info-center' });
          }
          break;
        case 2:
          this.$router.push({ path: '/h5/info-center' });
          break;
      }
    },
    checkNode(node) {
      return false;
      // return checkNode(node)
    },
  },
};
</script>
<style lang="scss" scoped>
.h5-container {
  min-height: 100%;
  background: #efefef;
}
</style>
