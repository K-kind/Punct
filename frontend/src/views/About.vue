<template>
  <div class="container">
    <div class="about__header">
      <h1 class="about__heading">Punct<span>（パンクト）</span></h1>
      <p class="about__text">
        Punctual（パンクチュアル：時間に正確）な行動をサポートするタスク管理アプリです。<br>
        3ステップでタスクに1つずつ取り組み、かかった時間を記録します。
      </p>
      <ul class="about__steps">
        <li>内容と予定時間を入力してタスクを作成</li>
        <li>「進行中」にタスクをセットし、タイマーを開始</li>
        <li>完了ボタンを押して、経過時間を保存</li>
      </ul>
    </div>
    <div class="about__video">
      <video src="@/assets/capture.mp4" controls></video>
    </div>
    <div class="about__bottom-links">
      <router-link to="/signup" class="about__signup-link">
        <i class="el-icon-caret-right"></i>
        新規登録はこちら
      </router-link>
      <el-divider>または</el-divider>
      <p>
        体験用データを持つテストユーザーで、お試しいだだくことができます。
      </p>
      <TestLogin />
    </div>
  </div>
</template>

<script>
// import { CREATE } from '@/store/mutation-types'
import TestLogin from '@/components/TestLogin.vue'

export default {
  name: 'About',
  components: {
    TestLogin
  }
  // created() {
  //   let message = 'ログインしました。'
  //   let duration = 2500
  //   let path = '/'
  //   if (!this.$store.state.auth.userName) {
  //     message = '認証に失敗しました。'
  //     duration = 4000
  //     path = '/login'
  //   }
  //   this.$store.dispatch(
  //     `message/${CREATE}`,
  //     { flash: message, duration }
  //   ).then(() => {
  //     this.$router.push(path)
  //   })
  // }
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
  &__header {
    padding-bottom: 24px;
  }
  &__heading {
    text-align: center;
    span {
      font-size: 1.4rem;
    }
  }
  // &__text {
  // }
  &__steps {
    padding-top: 16px;
    padding-left: 16px;
    li {
      list-style: decimal;
    }
  }
  &__video {
    width: 60%;
    video {
      width: 100%;
      border: 1px solid $theme-gray;
      border-bottom-width: 2px;
    }
  }
  &__bottom-links {
    padding: 32px 0 24px;
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
