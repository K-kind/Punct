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
      <video src="@/assets/capture.mp4" controls width="841"></video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutInfo',
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
    // width: 60%;
    video {
      // width: 100%;
      border: 1px solid $theme-gray;
      border-bottom-width: 2px;
    }
  }
}
</style>
