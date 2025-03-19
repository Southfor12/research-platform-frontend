<template>
  <section class="index-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'IndexMain',
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>

<style type="scss" scoped></style>
