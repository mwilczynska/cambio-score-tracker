# Cambio Score Tracker

A simple, mobile-friendly web application for tracking scores in the card game Cambio. Built for Mike and Preeta to easily log and track their game scores on any device.

## Features

- **Mobile-Responsive Design**: Works perfectly on both iPhone and Android phones
- **Session Management**: Track multiple game sessions
- **Automatic Calculations**:
  - Session totals (cumulative scores within a session)
  - Overall totals (lifetime cumulative scores)
- **Persistent Storage**: All data saved locally in browser
- **CSV Import/Export**: Upload historical scores or backup your data
- **Recent Rounds View**: See your last 10 rounds at a glance

## How to Use

### Adding Scores

1. Enter Mike's score and Preeta's score for the current round
2. Click "Add Round"
3. Totals are automatically calculated and displayed

### Starting a New Session

Click "Start New Session" when beginning a new game session. This resets the session totals while maintaining overall totals.

### Importing Your Historical Data

1. Click "Import CSV"
2. Select your `cambio_scores.csv` file
3. Confirm the import (this will replace current data)

### Exporting Data

Click "Export CSV" to download a backup of all your scores in CSV format.

## CSV Format

The application uses the following CSV structure:

```
Session,Mike_Score,Preeta_Score,Mike_Session_Total,Preeta_Session_Total,Mike_Overall_Total,Preeta_Overall_Total
```

- **User inputs**: Session, Mike_Score, Preeta_Score
- **Auto-calculated**: Mike_Session_Total, Preeta_Session_Total, Mike_Overall_Total, Preeta_Overall_Total

## Local Development

Simply open `index.html` in a web browser. No build process or server required!

## Deploying to Web

This is a static website that can be hosted on:

- **GitHub Pages**: Push to GitHub and enable Pages in repository settings
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **Any static hosting service**

## Technology Stack

- HTML5
- CSS3 (with CSS Grid and Flexbox for responsive design)
- Vanilla JavaScript (no frameworks required)
- localStorage API for data persistence

## Browser Compatibility

Works on all modern browsers including:
- Chrome/Edge (mobile and desktop)
- Safari (iOS and macOS)
- Firefox
- Samsung Internet

## Data Privacy

All data is stored locally in your browser. No data is sent to any server or third party.

## Future Enhancements

Potential features for future versions:
- Player statistics and charts
- Game history filtering and search
- Multiple player support
- Dark mode
- PWA (installable app)
