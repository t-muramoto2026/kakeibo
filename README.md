# 家計簿 PWA

Claudeのアーティファクト版「家計簿」を、単体で動くWebアプリ（PWA）にしたものです。
Webサイトとして公開すると、iPhone・Androidのホーム画面に追加してアプリのように使えます。

## 中身

```
index.html   アプリ本体
manifest.json ホーム画面に追加したときの名前・アイコン・色の設定
sw.js         オフラインでも開けるようにするサービスワーカー
icons/        アプリアイコン（192px・512px、通常版とmaskable版）
```

## Artifact版との違い

- 記録はブラウザの `localStorage` に保存されます（キー：`kakeibo-transactions-v1` が記録、
  `kakeibo-categories-v1` が項目）。**端末ごとの保存で、他の端末とは同期されません。**
  機種変更やブラウザのデータ削除に備えて、ときどき「エクスポート」でCSVを保存してください。
  別の端末へは「インポート」で移せます。
- CSVのエクスポートは、ブラウザ標準のダウンロードで保存されます。
- それ以外の機能はArtifact版の最新版と同じです（ミントソーダのデザイン、電卓入力、
  内訳の上位3項目表示と全項目の開閉、中項目ごとの明細、カレンダー／一覧、月別集計、
  項目の管理、CSVの入出力、ダークモード対応など）。

---

## 公開手順A：GitHub Pages（おすすめ・無料）

GitHubのアカウントがあれば、ブラウザの操作だけで公開できます。

1. https://github.com にログインし、右上の「＋」→「New repository」を選びます。
2. Repository name に `kakeibo` などの名前を入れ、**Public** を選んで「Create repository」を押します。
   （無料プランでGitHub Pagesを使うには Public にする必要があります。公開されるのはアプリの
   ファイルだけで、記録データは各自の端末にしか保存されないので、家計の内容が見られることは
   ありません。）
3. 作成したリポジトリの画面で「uploading an existing file」のリンク（または「Add file」→
   「Upload files」）を押します。
4. このフォルダの中身（`index.html`、`manifest.json`、`sw.js`、`icons` フォルダ、`README.md`）を
   まとめてドラッグ＆ドロップし、「Commit changes」を押します。
   ※ フォルダごとではなく、**フォルダの中身**をアップロードしてください。`index.html` が
   リポジトリの一番上に来ていればOKです。
5. リポジトリの「Settings」→ 左メニューの「Pages」を開きます。
6. 「Build and deployment」の Source を **Deploy from a branch**、Branch を **main** と **/(root)** にして
   「Save」を押します。
7. 1〜2分待ってページを再読み込みすると、上部に
   `https://（ユーザー名）.github.io/kakeibo/` のようなURLが表示されます。これが公開URLです。

## 公開手順B：Netlify Drop（アカウント登録だけで、さらに手軽）

1. https://app.netlify.com/drop を開き、無料アカウントでログインします。
2. このフォルダ（`kakeibo-pwa` フォルダ）をそのままページにドラッグ＆ドロップします。
3. 数秒で `https://（ランダムな名前）.netlify.app` のURLが発行されます。
   サイト設定からURLの名前を変更することもできます。

どちらの方法でも、自動でHTTPS（鍵マーク付きのURL）になります。PWAとして
ホーム画面に追加したりオフラインで使ったりするにはHTTPSが必要ですが、どちらも対応済みです。

---

## スマホのホーム画面に追加する

**iPhone（Safari）**
1. SafariでURLを開きます（Chromeなど他のブラウザではなくSafariで開いてください）。
2. 画面下の共有ボタン（□に↑のマーク）を押します。
3. 「ホーム画面に追加」を選び、「追加」を押します。

**Android（Chrome）**
1. ChromeでURLを開きます。
2. 右上の「︙」メニューから「ホーム画面に追加」または「アプリをインストール」を選びます。

ホーム画面のアイコンから起動すると、ブラウザのアドレスバーがない、アプリのような画面で開きます。
一度開けば、電波がないところでも使えます。

> 注意：iPhoneでは「Safariで開いたとき」と「ホーム画面のアイコンから開いたとき」で保存場所が
> 別になります。記録は必ずホーム画面のアイコンから開いて付けるようにしてください。

---

## アプリを更新するとき

- **GitHub Pages**：リポジトリで「Add file」→「Upload files」から、新しい `index.html` などを
  アップロードして上書きし、「Commit changes」を押します。1〜2分で反映されます。
- **Netlify**：サイトの「Deploys」画面に、新しいフォルダをドラッグ＆ドロップします。

`index.html` はオンライン時に毎回最新版を読み込む設定なので、利用者はアプリを開き直すだけで
新しい版になります（開きっぱなしの場合は、一度閉じてから開き直してください）。
アイコンや `sw.js` を変更したときは、`sw.js` の `CACHE_VERSION`（例：`kakeibo-v3`）の数字を
1つ上げてからアップロードしてください。

記録データは端末側に保存されているので、アプリを更新しても消えません。

---

## 動作確認のメモ

- `index.html` をパソコンでダブルクリックしても動作確認はできますが、`file://` で開いた場合は
  サービスワーカー（オフライン対応）が動きません。オフライン対応は公開後のURLで確認してください。
- PWAとして正しく認識されているかは、パソコンのChromeで公開URLを開き、デベロッパーツール →
  「Application」タブの Manifest / Service workers で確認できます。

## 将来Google Playに出したくなったら

公開したURLをもとに、Googleの [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) で
Androidアプリ（.aab）を作れます（Trusted Web Activity）。Google Playのデベロッパー登録
（初回25ドル）と、個人アカウントの場合はクローズドテストが必要です。
