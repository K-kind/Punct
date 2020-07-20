<template>
  <div class="container">
    <AboutInfo />
    <div class="about__bottom-links">
      <router-link to="/signup" class="about__signup-link">
        <i class="el-icon-caret-right"></i>
        新規登録はこちら
      </router-link>
      <el-divider>または</el-divider>
      <p>
        体験用データを持つテストユーザーで、お試しいだだくことができます。
      </p>
      <TestLogin :bigButton="true" />
    </div>
  </div>
</template>

<script>
import TestLogin from '@/components/TestLogin.vue'
import AboutInfo from '@/components/AboutInfo.vue'

export default {
  name: 'About',
  components: {
    TestLogin,
    AboutInfo
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
p, li, a {
  font-size: 1.6rem;
  line-height: 1.8;
}
.about {
  &__bottom-links {
    padding: 32px 0;
    text-align: center;
    p {
      padding-bottom: 14px;
    }
  }
  &__signup-link {
    @include green-link;
    font-weight: bold;
  }
}
</style>
