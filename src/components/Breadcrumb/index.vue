<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        :class="{ 'admin-item': platformType === 'admin' }"
        v-for="(item, index) in levelList"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp';

export default {
  props: {
    platformType: {
      type: String,
      default: 'admin',
    },
  },
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter((item) => item.meta && item.meta.title);
      const first = matched[0];

      if (!this.isHome(first) && this.platformType === 'index') {
        matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched);
      }
      if (!this.isHome(first) && this.platformType === 'admin') {
        // matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }

      if (this.$route.meta.activeMenu && this.$route.meta.preName) {
        const spliceMatched = matched.splice(0, matched.length - 1);
        matched = spliceMatched
          .concat({
            path: this.$route.meta.activeMenu,
            meta: { title: this.$route.meta.preName },
          })
          .concat(matched);
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false,
      );
    },
    isHome(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      // if (path === '/platform-score-record/list') {
      //   this.$router.push(path + '/' + localStorage.getItem('score-list-id'))
      //   return
      // }
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    },
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.admin-item {
  line-height: 65px;
}
</style>
