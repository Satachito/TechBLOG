## Firebase でメンバーシップサービスを始めよう

近年、クラウドサービスの発達により、誰でも簡単に会員制のオンラインサービスを始められる環境が整ってきました。

特に、FirebaseのようなBaaS（Backend as a Service）を利用することで、開発者はバックエンド構築の複雑なプロセスを大幅に簡略化することができます。

Firebaseは、認証、データベース、ファイルストレージ、サーバーレス機能など、オンラインサービスを構築するために必要な機能の多くを提供するため、開発者はサービスのコア機能に集中することができます。

また、Firebaseはサービスの成長に合わせて自動的にスケールするため、運用コストを大幅に削減できます。

この記事では、Firebaseを使って会員制のオンラインサービスを始めるための具体的な手順を、例として架空のサービスを作りながら解説します。

### 架空サービスの仕様

<img src=Contents/HOME.png alt="Home image" width=320></img>

#### コンセプト

- タイプ：投資情報ポータル
- 収益モデル：広告及びメルマガ購読

#### 機能要件

- ユーザー管理
- コンテンツ管理
- 入金処理
- 外部アクセス統合
  - APIs
  - Scraping

#### セキュリティ要件

- 個人情報は保存しない
- メアドとその活動を保存する

#### 技術要件

- シングルページアプリケーション(SPA)
- フロントエンド：Vanilla JS
- バックエンド：Firebase
  - データベース：Firebase Firestore
  - ユーザー認証：Firebase Authentication
- 入金方法：BitCoin
- 外部アクセス
  - 暗号資産API
  - FX API
  - 貴金属価格 Scraping

ソースコードは[https://github.com/Satachito/exp-fb](https://github.com/Satachito/exp-fb)にあります。

また実際に[ここ(https://exp-fb-c223c.web.app)](https://exp-fb-c223c.web.app)で動作させておきます。

---
## Firebase Authentication

Firebaseはアプリ開発を容易にする強力なプラットフォームです。しかし、現在頻繁にアップデートが行われており、特にモジュラーAPIを導入したv9への移行が目立ちます。この新しいAPIは、従来のAPIとは構文を大きく変えています。

モジュラーAPIは柔軟性と効率性を向上させますが、レガシーコードとの互換性は失われます。互換バージョンも Firebase チームによって提供されていますが、プロジェクトの将来性を考慮するとモジュラーAPIへの移行が推奨されます。

互換バージョンで使えるFirebase-UIはFirebaseに含まれるログインなどの機能を実装するのに便利なUIライブラリです。しかし、Firebase-UI はまだモジュラーAPI をサポートしていません。

またFirebaseの継続的な進化を考えると、将来さらに大きな変更があることが予想されます。

この進化する状況を考慮すると、ログイン機能を実装するためにFirebaseの機能を直接利用することが、最も持続可能なアプローチであることがわかります。

実際に以下のようなログインシークエンスを作ってみましょう。

* ログイン前

<img src=Contents/SS1.png alt="ログイン前" width=320></img>

* ログインダイアログ

<img src=Contents/SS2.png alt="ログインダイアログ" width=320></img>

* ログイン中

<img src=Contents/SS3.png alt="ログイン中" width=320></img>

* マイページ

<img src=Contents/SS4.png alt="マイページ" width=320></img>

<iframe height="300" style="width: 100%;" scrolling="no" title="Firebase AUTH" src="https://codepen.io/satachito/embed/RwOyxzr?default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/satachito/pen/RwOyxzr">
  Firebase AUTH</a> by Satachito (<a href="https://codepen.io/satachito">@satachito</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
