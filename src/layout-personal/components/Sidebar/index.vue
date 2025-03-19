<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in personal_permission_routes"
          :key="route.path"
          :active-class="activeClass"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      activeClass: '',
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'personal_permission_routes']),
    // routes() {
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (this.isCollapse) {
        if (meta.activeClass) this.activeClass = meta.activeClass;
      } else {
        this.activeClass = '';
      }
      if (meta.activeMenu) {
        return meta.activeMenu;
      }

      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      const route = this.$route;
      const { meta } = route;
      if (!this.sidebar.opened) {
        if (meta.activeClass) this.activeClass = meta.activeClass;
      } else {
        this.activeClass = '';
      }
      return !this.sidebar.opened;
    },
  },
};
</script>
