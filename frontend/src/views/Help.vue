<template>
  <div class="help-container">
    <AboutInfo />
    <div class="help">
      <el-divider><h2>使い方</h2></el-divider>
      <div class="help__body--top">
        <h3 class="help__body-heading">ホーム</h3>
        <p>本日以降のタスクを扱う、メインのページです。3種類のタスクがあります。</p>
        <div class="help__details">
          <h4 class="help__details-heading">1. デイリータスク</h4>
          <p>
            本アプリでメインとして扱うタスクです。以下のように利用します。
          </p>
          <ul class="help__details-ul">
            <li>
              <strong>タスクの追加</strong>: 「本日のタスク」や「6日間のタスク」のボードで「タスクを追加」をクリック<br>
              →タスクの内容と作業にかかる予定時間（分）を入力
            </li>
            <li><strong>内容の変更</strong>: タスクをクリックし、編集</li>
            <li><strong>タスクの移動</strong>: 他のボードにドラッグ&ドロップ</li>
            <li>
              <strong>タスクの開始</strong>: 画面上部の「進行中のタスク」にドラッグまたは<i class="el-icon-upload2"></i>ボタンをクリック<br>
              ※ 一度に1つのタスクのみ進行できます。
            </li>
            <li><strong>タスクの完了</strong>: 完了ボタンをクリックまたは、「本日の完了タスク」に直接ドラッグ</li>
            <li>未完了のタスクは、次の日に持ち越されます</li>
          </ul>
        </div>
        <div class="help__details">
          <h4 class="help__details-heading">2. 週間タスク</h4>
          <p>
            1週間ごとの大まかなタスクです。以下のように利用します。
          </p>
          <ul class="help__details-ul">
            <li><strong>タスクの追加</strong>: 「週間タスクを追加」をクリックし、タスク内容を入力</li>
            <li><strong>内容の変更</strong>: タスクをクリックし、編集</li>
            <li><strong>タスクの移動</strong>: ボード内だけでドラッグ&ドロップできます</li>
            <li><strong>タスクの完了</strong>: チェックする</li>
            <li>
              <strong>他の週を表示</strong>: <i class="el-icon-caret-left"></i>や<i class="el-icon-caret-right"></i>のボタンをクリック<br>
              →「6日間のタスク」の内容も連動して表示されます。
            </li>
          </ul>
        </div>
        <div class="help__details">
          <h4 class="help__details-heading">3. 月間タスク</h4>
          <p>
            1ヶ月ごとのさらに大まかなタスクです。週間タスクと同じように利用します。
          </p>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="help__body">
        <h3 class="help__body-heading">アーカイブ</h3>
        <p>
          過去の完了済みタスクを見ることができます。<br>
          グラフは、1日ごとのタスクの実測時間と予定時間を集計したデータを、3週間分ずつ表示します。
      </p>
      </div>
    </div>
  </div>
</template>

<script>
import AboutInfo from '@/components/AboutInfo.vue'

export default {
  name: 'Help',
  components: {
    AboutInfo
  }
}
</script>

<style scoped lang="scss">
.help-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  overflow: scroll;
  height: 100%;
}
p, li {
  font-size: 1.6rem;
  line-height: 1.8;
}
.help {
  padding: 40px 0 32px;
  width: 841px;
  &__body {
    &--top {
      padding-top: 24px;
    }
  }
  &__body-heading {
    font-size: 2.0rem;
    line-height: 1.8;
  }
  &__details {
    padding-top: 16px;
  }
  &__details-heading {
    font-size: 1.6rem;
    line-height: 1.8;
  }
  &__details-ul {
    list-style: disc;
    padding: 8px 0;
    padding-left: 24px;
  }
}
</style>
