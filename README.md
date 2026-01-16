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

## Running the Mobile App

### Development (Expo Go)

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

Download the APK and install on Android devices.

### iOS Distribution

iOS users can use the Expo Go app:
1. Install "Expo Go" from the App Store
2. Run `eas update` to publish
3. Share the project URL with iOS users

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
