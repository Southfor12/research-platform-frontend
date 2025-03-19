<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>

<style type="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 65px);
  width: 100%;
  position: relative;
  overflow: hidden;
  flex: auto;
}
.fixed-header + .app-main {
  padding: 60px 30px;
}
</style>
