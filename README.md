# Punct（パンクト）
時間通り（Punctual）にタスクを管理するための、シンプルなSPAです。
タスクを作成して、1つずつ取り組み、かかった時間を記録します。

https://punct.work
<img width="1200" alt="README 画像 Punct" src="https://user-images.githubusercontent.com/55728594/88036508-9dae8700-cb7e-11ea-906b-c49f519c28bc.gif">

## 工夫した点
- ストレスなくスムーズに動くUI/UX
- ドラッグ&ドロップによる移動など、直感的な操作性
- 初期データを持つテストユーザーでの試用
- Jest（ユニット）、Cypress（E2E）、RSpec（バックエンド）の3種のテスト
- 改善速度を速めるCI/CDパイプライン

## 使用技術
### バックエンド
- Ruby 2.7.1
- Ruby on Rails 6.0.3
- MySQL 5.7
- Nginx 1.19.0

### フロントエンド
- Vue.js 2.6.11
- Vue-CLI 4.4.1

### インフラ
- AWS
  - コンテナ技術（ECS | ECR）
  - データベース（RDS）
  - 基本インフラ（VPC | EC2 | ELB | Route53 | IAM）
  - メール送信（SES）
- CircleCI
- Docker | Docker Compose

<img width="1200" alt="インフラ構成図" src="https://user-images.githubusercontent.com/55728594/88043792-c9366f00-cb88-11ea-8f73-2f57921e55c6.png">

## gem
- テスト、静的解析
  - rspec | capybara | factory_bot_rails | shoulda-matcher
  - rubocop
- メール送信、SNSログイン
  - aws-sdk-rails
  - omniauth
- バッチ処理
  - whenever

## JSライブラリ
- element-ui（コンポーネントライブラリ）
- dayjs（日付操作）
- chart.js（グラフ描画）
