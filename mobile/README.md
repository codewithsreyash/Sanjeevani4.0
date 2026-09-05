# Sanjeevani 4.0 - Expo Mobile App (Rural Healthcare Continuum)

This is the cross-platform **Expo (React Native + TypeScript)** mobile application for **Sanjeevani 4.0**, designed for rural community health workers (ASHA/ANM), PHC doctors, and citizens.

## Features
- **4 Healthcare Portals in One App**:
  - **ASHA / ANM Worker**: Door-to-door village outreach, patient registration, vital signs recording with instant auto-triage emergency flag calculation, home follow-up checklist, and 1-tap offline buffer sync.
  - **Doctor OPD Workstation**: Incoming referral queue sorted by urgency, referral acceptance into active consultation, and clinical diagnosis/prescription recording with automatic ASHA follow-up task dispatch.
  - **Citizen ABHA Health Locker**: View digital ABHA card, toggle ABDM digital health consent, monitor vital trends, and view past prescriptions.
  - **District Command HQ**: 4-tier healthcare continuum oversight, live tamper-evident clinical audit trail, and backend network IP configuration.
- **AI Voice Clinical Assistant**: Multilingual voice and text guidance (English, Hindi, Marathi).
- **Offline-First Resilience**: Works without internet connection using `@react-native-async-storage/async-storage` and syncs with the central SQLite database over REST API.

---

## How to Run

### 1. Ensure the Backend Server is Running
In the root directory (`Sanjeevani4.0`):
```bash
npm run dev
```
*(Runs the Express + SQLite backend on `http://localhost:3000`)*

### 2. Start the Mobile Expo App
In the `mobile/` directory:
```bash
cd mobile
npx expo start
```

### 3. Open on Your Device:
- **On Android Device / iPhone (Expo Go)**:
  1. Install the free **Expo Go** app from Google Play Store or Apple App Store.
  2. Scan the QR code displayed in your terminal.
  3. Ensure your phone is connected to the same Wi-Fi network as your computer.
- **On Android Emulator**:
  Press `a` in the terminal (automatically connects to `http://10.0.2.2:3000`).
- **On Web Preview**:
  Press `w` in the terminal to open the mobile app in your web browser.
