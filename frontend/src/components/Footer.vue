<template>
  <div class="footer">
    <div class="footer__links">
      <router-link to="/contact" class="footer__link">
        <i class="el-icon-caret-right"></i>
        お問い合わせ
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: center;
  &__link {
    @include gray-link;
    text-decoration: underline;
  }
}
</style>
