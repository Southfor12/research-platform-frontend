<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="member-container" @visible-change="handleVisibleChange">
        <span class="el-dropdown-link">
          {{ member.name }} ({{ member.mobile }})<i
            :class="iconArraowDown ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
            class="el-icon--right"
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="member.role_id" icon="el-icon-setting" @click.native="goSystem"
            >系统管理</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-edit-outline" @click.native="goHome"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-switch-button" divided @click.native="logout"
            >退出系统</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      iconArraowDown: true,
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'member']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    handleVisibleChange(command) {
      command ? (this.iconArraowDown = false) : (this.iconArraowDown = true);
    },
    goHome() {
      this.$router.push({ path: '/info-center/reset-password' });
    },
    goSystem() {
      this.$router.push({ path: '/home' });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 65px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    width: 65px;
    text-align: center;
    font-size: 20px;
    line-height: 61px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 65px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .member-container {
      margin-right: 15px;

      .el-dropdown-link {
        cursor: pointer;
        color: #303133;
      }

      .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
