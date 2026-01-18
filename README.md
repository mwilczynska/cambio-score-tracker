# Cambio Score Tracker

A mobile-friendly score tracking application for the card game Cambio. Available as both a web app and a native mobile app for Android and iOS.

## Platforms

### Web App
- Hosted on GitHub Pages
- Works on any browser (mobile or desktop)
- Located in `/web` folder

### Mobile App (Expo React Native)
- Native Android APK available
- iOS via Expo Go app
- Located in `/mobile` folder

## Features

- **Score Tracking**: Enter scores for each round with +/- toggle for negative scores
- **Session Management**: Track multiple game sessions
- **Automatic Calculations**:
  - Session totals (cumulative scores within a session)
  - Overall totals (lifetime cumulative scores)
  - Delta tracking (score differences between players)
- **Character Expressions**: Dynamic character images that change based on who's losing
- **Persistent Storage**: Data saved locally (browser localStorage or device storage)
- **CSV Import/Export**: Backup and restore your game history
- **Historical Rounds**: View and edit/delete past rounds

## Project Structure

```
cambio-score-tracker/
├── web/                    # Web application (GitHub Pages)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── images/
├── shared/                 # Shared business logic (ES modules)
│   ├── CambioTracker.js
│   ├── csvUtils.js
│   └── constants.js
└── mobile/                 # Expo React Native app
    ├── App.js
    ├── app.json
    ├── eas.json
    └── src/
        ├── components/
        ├── hooks/
        ├── screens/
        └── shared/
```

## How to Use

### Adding Scores

1. Enter Mike's score and Preeta's score
2. Use the +/- button to toggle negative scores (-1, -2 are possible in Cambio)
3. Tap "Add New Round"
4. Totals are automatically calculated

### Starting a New Session

Tap "Start New Session" when beginning a new game. This resets session totals while maintaining overall totals.

### Importing/Exporting Data

- **Export**: Tap "Export CSV" to save a backup of all scores
- **Import**: Tap "Import CSV" to restore from a backup file

## Running the Web App

Open `web/index.html` in a browser, or use a local server:

```bash
cd web
python -m http.server 8000
# Then open http://localhost:8000
```

## Installing the Mobile App

### Android Installation

1. Download the APK file from the [Expo Build Page](https://expo.dev/accounts/chawinski/projects/cambio-score-tracker/builds)
2. On your Android device, open the downloaded APK file
3. If prompted, allow installation from unknown sources:
   - Go to **Settings > Security** (or **Settings > Apps > Special access**)
   - Enable **Install unknown apps** for your browser or file manager
4. Tap **Install** when prompted
5. Once installed, open **Cambio Score Tracker** from your app drawer

### iOS Installation (via Expo Go)

Since iOS requires an Apple Developer account ($99/year) for direct app distribution, iOS users can run the app through Expo Go for free:

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Open Expo Go on your iPhone/iPad
3. Tap the **Home** tab and select **Scan QR code**, or tap **Enter URL manually**
4. Enter this URL: `exp://u.expo.dev/3d67f210-9c06-4c47-9cff-40d8a2d922f2`
5. The app will load and run within Expo Go

**Note for iOS users**: The app runs inside Expo Go, so you'll see "Expo Go" in your app switcher. All features work identically to the Android version.

## Development Setup

### Running Locally (Expo Go)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone.

### Building Android APK

```bash
cd mobile
eas build -p android --profile preview
```

Or build via the Expo website:
1. Go to [expo.dev](https://expo.dev/accounts/chawinski/projects/cambio-score-tracker)
2. Click **Create a build**
3. Set **Git ref** to `master` and **Root directory** to `mobile`
4. Select Android and the preview profile

### Publishing Updates for iOS Users

```bash
cd mobile
eas update --branch preview --message "Your update message"
```

iOS users will automatically receive updates when they open the app in Expo Go.

## CSV Format

```
Session,Mike_Score,Preeta_Score,Mike_Session_Total,Preeta_Session_Total,Mike_Overall_Total,Preeta_Overall_Total
```

## Technology Stack

### Web
- HTML5, CSS3, Vanilla JavaScript
- ES Modules for shared logic
- localStorage for persistence

### Mobile
- React Native with Expo
- AsyncStorage for persistence
- expo-file-system, expo-sharing, expo-document-picker

## Version History

- **v1.0-webapp-only**: Original web-only version (preserved as git tag)
- **v2.0**: Added mobile app with shared business logic

## Data Privacy

All data is stored locally on your device. No data is sent to any server.
