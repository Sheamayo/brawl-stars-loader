# 完全セットアップガイド - Brawl Stars AI Tool

**3つのコンポーネント統合フロー**

```
┌──────────────────────────────────────────────────┐
│ STEP 1: dylib をビルド（GitHub Actions）        │
│ /home/user/brawl-stars-mod                      │
└──────────────────────────────────────────────────┘
              ↓
      BrawlStarsTool.dylib
              ↓
┌──────────────────────────────────────────────────┐
│ STEP 2: Loader App に埋め込み＆ビルド（EAS）     │
│ /home/user/BrawlStarsToolLoader                 │
└──────────────────────────────────────────────────┘
              ↓
      BrawlStarsTool-Loader.ipa
              ↓
┌──────────────────────────────────────────────────┐
│ STEP 3: gbox で署名＆iPhone にインストール      │
│ + Brawl Stars アプリ（未改造）                  │
└──────────────────────────────────────────────────┘
              ↓
     iPhone で Loader App 起動 → AI Tool 有効化
```

---

## STEP 1: dylib ビルド（GitHub Actions）

### 1.1 GitHub リポジトリ作成

```bash
cd /home/user/brawl-stars-mod
git init
git add .
git commit -m "Initial: BrawlStarsTool AI autoplay"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brawl-stars-tool.git
git push -u origin main
```

**`YOUR_USERNAME`** を自分の GitHub ユーザー名に置き換え。

### 1.2 GitHub Actions 自動実行

Push 完了後、GitHub Actions が自動でビルド開始：

1. リポジトリの **Actions** タブを開く
2. **Build BrawlStarsTool dylib** ワークフロー確認
3. 🟢 成功を待つ

### 1.3 dylib ダウンロード

ビルド成功後：

1. ワークフロー詳細ページへ
2. **Artifacts** セクションで **BrawlStarsTool-dylib** をダウンロード
3. 解凍して `BrawlStarsTool.dylib` を取得

### 1.4 dylib を Loader App に配置

```bash
cp BrawlStarsTool.dylib /home/user/BrawlStarsToolLoader/ios/BrawlStarsToolLoader/
```

---

## STEP 2: Loader App IPA をビルド（EAS Build）

### 2.1 Expo Account 作成

1. https://expo.dev/signup
2. メール・パスワードで登録
3. メール確認完了

### 2.2 EAS CLI インストール

```bash
npm install -g eas-cli
```

### 2.3 Loader App リポジトリ初期化（オプション）

```bash
cd /home/user/BrawlStarsToolLoader
git init
git add .
git commit -m "BrawlStarsTool Loader App v1.0"
git remote add origin https://github.com/YOUR_USERNAME/brawl-stars-loader.git
git push -u origin main
```

### 2.4 EAS ログイン

```bash
eas login
# Expo account メール＆パスワード入力
```

### 2.5 プロジェクト初期化

```bash
cd /home/user/BrawlStarsToolLoader
eas build:configure
# iOS を選択
```

### 2.6 IPA ビルド実行

```bash
eas build --platform ios
```

プロンプト選択：
- **Build type**: `release`
- **Provisioning Profile**: `Automatic`

### 2.7 IPA ダウンロード

ビルド完了後、コンソールに表示される URL をコピーして、ブラウザでダウンロード。

```
✓ Build successful.
📱 IPA: https://eas.blob.service.expo-api.io/...ipa
```

---

## STEP 3: gbox で署名＆iPhone にインストール

### 3.1 gbox.io を開く

### 3.2 Loader App IPA をアップロード

1. **IPA を選択** ボタン
2. ダウンロードした `BrawlStarsTool-Loader.ipa` を選択
3. アップロード

### 3.3 署名

1. **Certificate で署名** オプション選択
2. 自分の iOS Signing Certificate を選択
3. **署名** ボタン

### 3.4 署名済み IPA をダウンロード

完了後、DL ボタンで署名済み IPA を取得。

### 3.5 iPhone にインストール

1. Loader App signed IPA を iPhone に配送（USB/AirDrop など）
2. Loader App インストール完了

### 3.6 Brawl Stars をインストール

iPhone の App Store から通常通り **Brawl Stars** をインストール。

---

## STEP 4: iPhone で使用開始

### 4.1 Loader App 起動

iPhone ホーム画面から **BrawlStarsTool Loader** をタップ。

### 4.2 認証

1. パスワード入力フィールドに `Ezstash0` と入力
2. **UNLOCK** をタップ

### 4.3 dylib 注入＆Brawl Stars 起動

1. **INJECT & LAUNCH BRAWL STARS** をタップ
2. Brawl Stars が自動起動
3. 数秒待機
4. Brawl Stars 画面に AI Tool UI が表示される

### 4.4 AI Tool 使用

Brawl Stars 内に表示される Tool UI：

- **🤖 AI AUTOPLAY** - ツール表示
- パスワード（`Ezstash0`）で認証
- **START AUTOPLAY** をタップ
- AI がゲームを自動プレイ

---

## トラブルシューティング

### dylib ビルドが失敗

**Solution:**

```bash
cd /home/user/brawl-stars-mod
git push origin main  # 再度プッシュ

# Actions タブでログを確認
# エラーメッセージを確認
```

### EAS Build が失敗

```bash
cd /home/user/BrawlStarsToolLoader
rm -rf node_modules
npm install
npm audit fix
eas build --platform ios --clear-cache
```

### Loader App が起動しない

- iPhone を再起動
- gbox で正しく署名されているか確認
- Console.app で crash log を確認

### AI Tool が表示されない（stub dylib の場合）

→ これは正常。real dylib をダウンロード後、Loader App をリビルド。

```bash
cp <real-dylib> /home/user/BrawlStarsToolLoader/ios/BrawlStarsToolLoader/BrawlStarsTool.dylib
eas build --platform ios
```

### Brawl Stars が起動しない

- Brawl Stars アプリがインストールされているか確認
- Loader App 起動 → Brawl Stars を手動で開いてみる

---

## パスワード変更（オプション）

Loader App のパスワードを変更：

```typescript
// /home/user/BrawlStarsToolLoader/app/index.tsx
const CORRECT_PASSWORD = 'Ezstash0';  // ← ここを変更
```

変更後、再ビルド：

```bash
cd /home/user/BrawlStarsToolLoader
eas build --platform ios
```

---

## 更新フロー

### dylib を更新

1. `/home/user/brawl-stars-mod/BrawlStarsTool.swift` を編集
2. `git push origin main` → GitHub Actions 自動ビルド
3. 新しい dylib をダウンロード
4. Loader App に配置 → `eas build --platform ios`

### Loader App UI を更新

1. `/home/user/BrawlStarsToolLoader/app/index.tsx` を編集
2. `eas build --platform ios`

---

## セキュリティ注意

⚠️ このツールは以下の理由で App Store に提出できません：

- Private API 使用（dylib 注入）
- 他のアプリへの干渉
- Apple のガイドライン違反

**個人・開発用途のみ**で使用してください。

---

## サポート

エラーやトラブルは以下のファイルを確認：

- dylib ビルド: `/home/user/brawl-stars-mod/GITHUB_SETUP.md`
- Loader App IPA: `/home/user/BrawlStarsToolLoader/BUILD_IPA.md`
- Loader App 詳細: `/home/user/BrawlStarsToolLoader/LOADER_README.md`

---

**Ready to go!** 🎮🤖
