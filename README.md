# Dahenfeld

![Build Status](https://github.com/tdittmann/dahenfeld/actions/workflows/main.yml/badge.svg)
![Known Vulnerabilities](https://snyk.io/test/github/tdittmann/dahenfeld/badge.svg)
[![codecov](https://codecov.io/gh/tdittmann/dahenfeld/graph/badge.svg?token=CdPZyndcfi)](https://codecov.io/gh/tdittmann/dahenfeld)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=bugs)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=tdittmann_dahenfeld&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=tdittmann_dahenfeld)

Web application for Dahenfeld.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Environment file

You need to configure your own environment file (`/.env`) which contains some mandatory data.

```
# Backend
VITE_BACKEND_URL=""
VITE_BACKEND_AUTH_USER=""
VITE_BACKEND_AUTH_PASSWORD=""

# Virtual Tour
VITE_VIRTUAL_TOUR_API_KEY=""
VITE_VIRTUAL_TOUR_MAP_ID=""

# Firebase
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_MEASUREMENT_ID=""
VITE_FIREBASE_VAPID_KEY=""
```

For Azure Action you need to pass this as a base64 encoded string to `ENVIRONMENT_VARIABLE`. Use
e.g. `openssl base64 -in .env | tr -d '\n' | pbcopy` on MacOS in the root directory.

## Release Guide

Before releasing the apps to the stores you need to update the following files and increment to the correct version:

* config.xml
* package.json
* imprint.page.ts

After that you need to build the project and copy files:

```
ionic build --prod
npx cap copy
```

### Android

Open Android Studio with the following command

```
npx cap open android
```

Change version code & version name and generate a signed apk or bundle: Build -> Generate signed APK / Bundle. Select
keystore, set password
and alias and click "next". After that the apk or bundle should be created. Locate the file, upload it
on https://play.google.com/apps/publish
with a new release.

#### Push-Notifications

In order to use push notificiations you need an `google-services.json` in the directory `android/app/`. The file can be
found in [Google Firebase](https://firebase.google.com/).

### iOS

Open the project in XCode with

```
npx cap open ios
```

change version. Select "Generic iOS Device" in dropdown at the top. Then use Product -> Archive to upload the file.
After that you can continue the release
process on https://itunesconnect.apple.com/.

#### Push-Notifications

You need to enable the push notifications in XCode. Add them as Capability, then you are ready to go.
