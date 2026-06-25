# Build Loader App IPA (EAS Build)

## Quick Start

この Loader App IPA を作成する最速の方法は **EAS Build**（Expo Cloud Build）です。

### ステップ 1: Expo Account 作成

1. https://expo.dev に移動
2. Sign Up で無料アカウント作成
3. メール確認完了

### ステップ 2: EAS CLI インストール

```bash
npm install -g eas-cli
```

### ステップ 3: ログイン

```bash
cd /home/user/BrawlStarsToolLoader
eas login
```

Expo account のメール・パスワードでログイン

### ステップ 4: プロジェクト初期化

```bash
eas build:configure
```

プロンプトで iOS を選択

### ステップ 5: ビルド実行

```bash
eas build --platform ios
```

ビルド開始。以下の選択肢が出ます：

- **Build type**: `release` を選択（本番用）
- **Provisioning Profile**: `Automatic` を選択

### ステップ 6: IPA ダウンロード

ビルド完了後、コンソールに Download URL が表示されます。

```
✓ Build finished.
📱 IPA URL: https://eas.blob.service.expo-api.io/...ipa
```

URL をコピーして、ブラウザでダウンロード。

## Alternative: Local Build (macOS only)

Mac がある場合：

```bash
cd /home/user/BrawlStarsToolLoader
npm install
npx expo prebuild --clean
open ios/BrawlStarsToolLoader.xcworkspace

# Xcode で手動ビルド
```

## IPA を gbox で署名

1. ダウンロードした `.ipa` をコピー
2. **gbox.io** を開く
3. **IPA を選択** → Loader App IPA をアップロード
4. **Certificate で署名**
5. **Download** → 署名済み IPA
6. iPhone にインストール

## 使用方法

### iPhone での流れ

1. Loader App 起動
2. パスワード入力：`Ezstash0`
3. **UNLOCK** をタップ
4. **INJECT & LAUNCH BRAWL STARS** をタップ
5. Brawl Stars 自動起動
6. AI Tool が画面に表示される

## トラブルシューティング

### ビルドが失敗

```bash
# キャッシュをクリア
rm -rf node_modules
npm install
eas build --platform ios --clear-cache
```

### IPA がダウンロードできない

- EAS ダッシュボード（https://expo.dev/builds）で ビルドステータス確認
- Failed ならログを確認

### Loader App が起動しない

- gbox で正しく署名されているか確認
- iPhone を再起動

### AI Tool が表示されない

- dylib がまだ stub 版。GitHub Actions でビルド完了を待つ
- dylib を差し替え後、Loader App をリビルド

## dylib を差し替える

GitHub Actions で real dylib がビルド完了したら：

```bash
# 新しい dylib をダウンロード
# → /home/user/BrawlStarsToolLoader/ios/BrawlStarsToolLoader/BrawlStarsTool.dylib に配置

# リビルド
eas build --platform ios
```

---

**Password**: `Ezstash0`
