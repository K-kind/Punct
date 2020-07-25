<template>
  <div class="about">
    <div class="about__container">
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
      <div class="about__footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import TestLogin from '@/components/TestLogin.vue'
import AboutInfo from '@/components/AboutInfo.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'About',
  components: {
    TestLogin,
    AboutInfo,
    Footer
  }
}
</script>

<style scoped lang="scss">
p, li, a {
  font-size: 1.6rem;
  line-height: 1.8;
}
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  overflow: scroll;
  height: 100%;
  &__container {
    padding: 0 16px 0;
  }
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
  &__footer {
    padding: 24px 0;
  }
}
</style>
