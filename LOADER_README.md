# Brawl Stars Tool Loader

**AI-powered Brawl Stars Tool injection via dedicated Loader App**

## Overview

Instead of modifying the Brawl Stars IPA directly, this Loader App:
1. **Authenticates** user with password
2. **Injects** the pre-compiled dylib into the Brawl Stars process
3. **Launches** Brawl Stars with AI Tool active

## Advantages

✅ Brawl Stars IPA remains unmodified (original install)  
✅ Loader App is the only component that needs gbox signing  
✅ Can be updated independently of Brawl Stars version  
✅ No need to re-patch Brawl Stars on every update  

## Architecture

```
┌─────────────────────────────────────────────────┐
│         iPhone with gbox signature              │
├─────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐   │
│ │    BrawlStarsTool Loader App (React)     │   │
│ │  - Password input screen                 │   │
│ │  - Dylib injection control               │   │
│ │  - Brawl Stars launch button              │   │
│ └──────────────────────────────────────────┘   │
│          ↓                                       │
│ ┌──────────────────────────────────────────┐   │
│ │    BrawlStarsTool.dylib (embedded)       │   │
│ │  - AI autoplay logic                     │   │
│ │  - Screen analysis                       │   │
│ │  - Auto-tap commands                     │   │
│ └──────────────────────────────────────────┘   │
│          ↓ inject via dlopen                    │
│ ┌──────────────────────────────────────────┐   │
│ │    Brawl Stars (unmodified)              │   │
│ │  - Receives dylib at startup             │   │
│ │  - AI Tool UI appears in-game            │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Setup Steps

### 1. Build Dylib via GitHub Actions

Follow `/home/user/brawl-stars-mod/GITHUB_SETUP.md` to:
- Create GitHub repo with BrawlStarsTool.swift
- GitHub Actions auto-compiles dylib
- Download compiled dylib

### 2. Embed Dylib into Loader App

```bash
# Copy dylib into app bundle (in Xcode build phase)
cp BrawlStarsTool.dylib ios/BrawlStarsToolLoader/embedded/
```

### 3. Build Loader App IPA

**Option A: EAS Build (recommended)**
```bash
cd /home/user/BrawlStarsToolLoader
npx eas build --platform ios
```

**Option B: Local with eas-cli**
```bash
npm install -g eas-cli
eas build --platform ios --local
```

### 4. Sign with gbox

1. Download the Loader App IPA from EAS Build
2. Open **gbox.io**
3. Upload Loader App IPA
4. Sign with your certificate
5. Download signed IPA → Install on iPhone

### 5. Install & Use

**On iPhone:**
1. Install Brawl Stars (normal, unmodified)
2. Install signed Loader App
3. Open Loader App
4. Enter password: `Ezstash0`
5. Click "UNLOCK"
6. Click "INJECT & LAUNCH BRAWL STARS"
7. Brawl Stars launches with AI Tool active

## Development

### File Structure

```
BrawlStarsToolLoader/
├── app/
│   └── index.tsx                    # Main UI (React Native)
├── ios/
│   └── BrawlStarsToolLoader/
│       └── native/
│           └── DylibInjector.m      # Objective-C dylib injection
├── src/
│   └── native/
│       └── DylibInjectorModule.ts   # TypeScript bridge
├── app.json                          # Expo config
└── LOADER_README.md                  # This file
```

### Modify UI

Edit `app/index.tsx` to customize appearance, add features, etc.

### Update Dylib Logic

1. Edit `/home/user/brawl-stars-mod/BrawlStarsTool.swift`
2. Push to GitHub → Actions auto-builds
3. Download new dylib
4. Replace embedded dylib
5. Rebuild Loader App

## Troubleshooting

### Dylib Injection Fails

- Verify dylib file exists in app bundle
- Check Console.app for error logs
- Ensure dylib is real (not stub) from GitHub Actions

### Brawl Stars Doesn't Launch

- Try opening Brawl Stars manually first
- Check if Brawl Stars custom URL scheme is supported
- Verify Brawl Stars is installed

### AI Tool Doesn't Appear

- Ensure dylib injected successfully (check logs)
- Wait a moment after Brawl Stars launches
- Check Brawl Stars app logs via Xcode or Console.app

## Password

Default password: `Ezstash0`

Change in `app/index.tsx`:
```typescript
const CORRECT_PASSWORD = 'Ezstash0';  // ← Change this
```

## Privacy & Security

⚠️ **Warning:** This tool uses private APIs and should only be used for personal testing/development. It is not suitable for App Store distribution.

---

**Next:** Follow `/home/user/brawl-stars-mod/GITHUB_SETUP.md` to set up dylib compilation.
