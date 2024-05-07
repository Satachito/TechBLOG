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

コードは以下のようになります。説明のためにペラ１でCDNで書いています。
[ここ(https://tech.sat.tokyo/Contents/FirebaseAuth.html)](https://tech.sat.tokyo/Contents/FirebaseAuth.html)で実際に動作させておきます。

```html
<button id=USER_B onclick=LOGIN_D.showModal()>Sign in/up</button>
<dialog id=LOGIN_D>
	<a		onclick=LOGIN_D.close()	>❌					</a>
	<input	id=EMAIL_I		type=email		placeholder=email		autocomplete=username		>
	<input	id=PASSWORD_I	type=password	placeholder=password	autocomplete=new-password	>
	<button	id=EMAIL_LOGIN_B		>Login with email	</button>
	<button	id=CREATE_ACCOUNT_B		>Create account		</button>
	<button	id=RESET_PASSWORD_B		>Reset password		</button>
	<br><hr><br>
	<button	id=GOOGLE_LOGIN_B		>Login with Google	</button>
	<button	id=FACEBOOK_LOGIN_B		>Login with Facebook</button>
	<button	id=GITHUB_LOGIN_B		>Login with GitHub	</button>
</dialog>

<dialog id=MY_D>
	<a		onclick=MY_D.close()	>❌					</a>
	<button	id=LOGOUT_B				>Logout				</button>
	<button	id=DELETE_ACCOUNT_B		>Remove account		</button>
</dialog>

<style>
*, *::before, *::after {
;	box-sizing	: border-box
}

input, button {
;	width		: 100%
;	margin		: 10px 0
}

a, button {
;	cursor		: pointer
}
</style>

<script type=module>
import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
const
app = initializeApp(
//	YOUR CONFIG HERE
)

import {
	getAnalytics
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js'
const
analytics = getAnalytics( app )

import {
	getAuth
,	onAuthStateChanged
,	signInWithEmailAndPassword
,	signInWithPopup
,	signInWithRedirect
,	getRedirectResult
,	sendPasswordResetEmail
,	sendEmailVerification
,	createUserWithEmailAndPassword
,	GoogleAuthProvider
,	FacebookAuthProvider
,	GithubAuthProvider
,	signOut
,	deleteUser
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
const
auth = getAuth( app )

const
E = _ => document.getElementById( _ )

E( 'GOOGLE_LOGIN_B'		).onclick = () => signInWithRedirect( auth, new GoogleAuthProvider		() )
E( 'FACEBOOK_LOGIN_B'	).onclick = () => signInWithRedirect( auth, new FacebookAuthProvider	() )
E( 'GITHUB_LOGIN_B'		).onclick = () => signInWithRedirect( auth, new GithubAuthProvider		() )

E( 'EMAIL_LOGIN_B'		).onclick = () => signInWithEmailAndPassword		( auth, E( 'EMAIL_I' ).value, E( 'PASSWORD_I' ).value	).catch( er => alert( er.message ) )
E( 'CREATE_ACCOUNT_B'	).onclick = () => createUserWithEmailAndPassword	( auth, E( 'EMAIL_I' ).value, E( 'PASSWORD_I' ).value	).catch( er => alert( er.message ) )

E( 'RESET_PASSWORD_B'	).onclick = () => sendPasswordResetEmail( auth, E( 'EMAIL_I' ).value ).then( () => alert( 'Password reset mail sent' ) ).catch( er => alert( er.message ) )

E( 'LOGOUT_B'			).onclick = () => signOut( auth )
E( 'DELETE_ACCOUNT_B'	).onclick = () => deleteUser( auth.currentUser )

onAuthStateChanged(
	auth
,	user => (
		E( 'LOGIN_D' ).close()
	,	E( 'MY_D' ).close()
	,	user
		?	(	user.emailVerified || (
					sendEmailVerification( user ).then( () => alert( 'A confirmation email has been sent to the address provided. Kindly click the link within the email to confirm delivery.' ) )
				,	signOut( auth )
				)
			,	E( 'USER_B' ).textContent	= 'MyPage: ' + user.email
			,	E( 'USER_B' ).onclick		= () => E( 'MY_D' ).showModal()
			)
		:	(	E( 'USER_B' ).textContent	= 'Sign in/up'
			,	E( 'USER_B' ).onclick		= () => E( 'LOGIN_D' ).showModal()
			)
	)
)
</script>
```

#### 注意点

##### onAuthStateChanged

ユーザーのログイン状態が変わると`onAuthStateChanged`が呼ばれます。またページの最初のロードの場合も呼ばれます。なので`onAuthStateChanged`の中にログイン状態で変化させたいものを記述します。

##### メールの検証

ユーザーが`createUserWithEmailAndPassword`,`signInWithPopup`または`signInWithRedirect`を使用してアカウントを作成した場合、`onAuthStateChanged`が呼ばれてユーザーが取得できた段階でもまだメアドの検証がされていない可能性があります。これは`user.emailVerified`見ればわかります。`user.emailVerified`が`false`の場合は`sendEmailVerification`で検証用のメールを送ります。
またユーザーが検証用のメールの中のリンクをクリックしてメアドを検証してもそれはリアルタイムには反映されないので`signOut`でログイン状態を解除するのがいいでしょう。

##### メアド列挙攻撃に対する防御

2023年9月より、Firebaseはログイン機能を強化し、ユーザーのセキュリティを強化する機能であるメール列挙攻撃に対する防御(Email Enumeration Protection)を導入しました。従来のログインシステムでは、攻撃者はランダムなパスワードでさまざまなメールアドレスを試します。エラーメッセージを分析することで、メールアドレスが登録されているかどうかを判別し、システムの脆弱性を突きます。

この機能により、パスワードの正確さに関わらず、すべてのログイン試行が一般的な`Invalid credentials`メッセージを返すようになります。その結果、攻撃者はエラー応答のみに基づいて電子メールアドレスの妥当性を判断することができなくなり、列挙攻撃を緩和することができます。

この機能はオンオフを切り替えることができますがオンが推奨です。新規にプロジェクトを作るとこの機能はデフォルトでオンになっています。以下この機能がオンになっていることを前提とします。ただし、Firebase Auth Emulator はこの機能をサポートしていないため、認証機能のデプロイとデバッグを十分に行う必要があることに注意してください。

この機能によって挙動が変わったメソッドは以下のものです。

###### signInWithEmailAndPassword

メアドが違う場合にも、パスワードが違う場合にも両方`Invalid credentials`を返すようになりました。

###### fetchSignInMethodsForEmail

空の配列を返すようになりました。

###### sendPasswordResetEmail

存在しないメールアドレスに対してエラーを表示しないようになりました。

---

## Firebase Firestore

Firestore はウェブクライアントとサーバーサイドアプリケーションの両方からアクセスできる NoSQL データベースです。

### Firestore の機能

- **NoSQL ドキュメントデータベース：** Firestore は NoSQL ドキュメントデータベースです。つまり、JSONのようなドキュメントにデータを格納します。そのため、ユーザープロフィール、商品データ、チャットメッセージなど、非構造化データの保存に適しています。
- **リアルタイム更新：** Firestore はリアルタイム更新をサポートしており、クライアントはデータに変更が生じた際に通知を受け取ることができます。これにより、チャットアプリ、ソーシャルメディアアプリ、ゲームアプリなどのリアルタイムアプリケーションを構築するのに適しています。
- **スケーラブルで安全：** Firestore は、Google のインフラによって支えられている、非常にスケーラブルで安全なデータベースです。つまり、膨大なユーザー数とリクエストを処理でき、データの安全性が確保されます。
- **使いやすい：** Firestore は使いやすく、よく文書化された API を備えています。また、さまざまなプログラミング言語で Firestore 向けのアプリケーションを簡単に開発できるように、多数のクライアントライブラリが用意されています。

---

## Firebase Functions

### 架空のサービスにおける外部 API の接続

この架空のサービスでは、機能するために外部 API との接続が不可欠です。しかし、クライアントサイド (ウェブ) アプリケーションを直接外部 API に接続すると、セキュリティ上の課題が生じます。このような障害を克服するために、バックエンドサービスが重要な役割を果たします。

### バックエンドサービスが不可欠な理由

- **同一オリジンのポリシー：** ウェブブラウザは、同一オリジンのポリシーと呼ばれるセキュリティ対策を実施しています。これは、ウェブページと、そのページを提供したドメインとは異なるドメインのリソースとの通信を制限します。外部 API に対する直接のクライアントサイドアクセスは、このポリシーに違反します。
- **アクセストークンのセキュリティ：** 外部 API は、多くの場合、アクセストークンを使用した認証を要求します。これらのトークンは機密データや機能へのアクセス権を付与するものであり、セキュリティ上の理由からクライアントサイドに公開されるべきではありません。バックエンドサービスは、これらのトークンを安全に保管・管理することができます。

### バックエンドサービスの利点

- **セキュリティ：** バックエンドはセキュアな仲介役として機能し、アクセストークンなどの機密情報をクライアントサイドから遮断します。
- **柔軟性：** バックエンドは、特定のプロトコル (REST など) や認証メカニズム (OAuth など) に関係なく API 呼び出しを処理することができます。必要に応じてさまざまな外部 API に適応させることができます。
- **スケーラビリティ：** バックエンドサービスは、大量の API リクエストを処理するように設計することができ、クライアントサイドアプリケーションのパフォーマンスと信頼性を確保します。
- **定期実行：** 特定の機能は、定期的な処理を必要とする場合があります。例えば、この架空のサービスでは、金価格を 1 日 1 回取得すれば十分かもしれません。 ウェブサイトをスクレイピングする際は、負荷をかけすぎないように注意することが重要です。

### 実際の例：シンプルなプロクシ

```html
const admin             = require( 'firebase-admin' )
admin.initializeApp()

const { onRequest }     = require( 'firebase-functions/v2/https' )
const fetch             = require( 'node-fetch' )
exports.ticker          = onRequest(
    ( q, s ) => fetch( 'https://example.com/FX/ticker' ).then(
        r => {
            if ( !r.ok ) throw new Error( r.statusText )
            return r.json()
        }   
    ).then(
        j => send( j ) 
    )   
)
```

この例では`ticker`というAPIを定義しています。
`https://example.com/FX/ticker`はFXの価格情報をJSONで返してくれる外部APIと仮定します。
外部APIにデータを取りに行って、それをそのまま呼び出し元に戻しています。
外部APIに自分のAPIを接続しているので、プロクシ（代理）といいます。

ただこのAPIは２つの大きな改善すべき点があります。

#### オリジン間リソース共有(CORS:Cross-Origin Resource Sharing)

このAPIにクライアントサイド（Web page)からアクセスしようとすると、殆どの場合同一オリジンポリシー(Same Origin Policy)に引っかかってアクセスできません。これを回避するためには`CORS`用のコードをインプリします。

```
	( q, s ) => (
		s.set( 'Access-Control-Allow-Origin', '*' )
	,	q.method === 'OPTIONS'
		?	(	s.set( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization' )
			,	s.set( 'Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE' )
			,	s.status( 200 ).end()
			)
		:	fetch( 'https://example.com/ticker' ).then(
				r => {
					if ( !r.ok ) throw new Error( r.statusText )
					return r.json()
				}
			).then(
				j => send( j )
			)
		;
	)
```

#### アクセス制限

次の問題はこのAPIが世界中のどこからでもアクセスできてしまうことです。
これを避ける方法はいくつかありますが、Firebaseを使うと簡単にできるようになります。まずWeb側で Firebase Authenticate を使って ユーザー情報を含む Token を作成して、Authorization ヘッダーにセットして、Functions の中で Authorization ヘッダーから Token を取り出して verify する方法を紹介します。

Functions 側で取り出す方法
```
	( q, s ) => admin.auth().verifyIdToken( q.headers.authorization.split( 'Bearer ' )[ 1 ] ).then(
		user => fetch( 'https://example.com/ticker' ).then(
			r => {
				if ( !r.ok ) throw new Error( r.statusText )
				return r.json()
			}
		).then(
			j => send( j )
		)
	)
```

この API のアドレスがhttps://ticker-jmabzvke5a-uc.a.run.appだとすると
Web側は以下のようなコードになります。

```html
<script type=module>
import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
const
app = initializeApp(
//	YOUR CONFIG HERE
)

import {
	getAuth
,	getIdToken
} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js'
const
auth = getAuth( app )

getIdToken( auth.currentUser, true ).then(
	token => {
		fetch(
			'https://ticker-jmabzvke5a-uc.a.run.app'
		,	{ headers: { 'Authorization': 'Bearer ' + token } }
		).then(
			r => {
				if ( !r.ok ) throw new Error( r.statusText )
				return r.json()
			}
		).then(
			_ => // Do something with JavaScript Object
		).catch(
			_ => alert( _.message )
		)
	}
)
</script>
```

実際のコードの例を以下においておきます。
[https://github.com/Satachito/exp-fb/blob/main/functions/index.js](https://github.com/Satachito/exp-fb/blob/main/functions/index.js)

#### 注意点

外部APIがアクセストークンを必要とする場合、ソースコード中にアクセストークンをハードコードすると、漏洩の可能性が出てきます。
例えばソースコードを公開レポジトリにおくと、そこからアクセストークンが漏洩します。
そのような場合は Google Secret Manager を使うとアクセストークンを隠蔽できます。これは Firebase の機能ではありませんが、Firebase は現在 Google に統合されているので、Firebase からシームレスに SecreteManager を使うことができます。

