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

コードは以下のようになります。[ここ(https://tech.sat.tokyo/Contents/FirebaseAuth.html)](https://tech.sat.tokyo/Contents/FirebaseAuth.html)で実際に動作させておきます。

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

ユーザーが`createUserWithEmailAndPassword`,`signInWithPopup`または`signInWithRedirect`を使用してアカウントを作成した場合、`onAuthStateChanged`が呼ばれてユーザーが取得できた段階でもまだメアドの検証がされていない可能性があります。これは`user.emailVerified`見ればわかります。
`user.emailVerified`が`false`の場合は`sendEmailVerification`で検証用のメールを送ります。またユーザーが検証用のメールの中のリンクをクリックしてメアドを検証してもそれはリアルタイムには反映されないので`signOut`でログイン状態を解除します。

