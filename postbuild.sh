#!/bin/bash

# Extract version number from package.json
VERSION=$(node -pe "require('./package.json').version")

# Create a subfolder in Google Drive with the version number
mkdir -p "G:/My Drive/Where It Goes/Releases/$VERSION"

# Copy the APK file to the new folder
cp ./android/app/build/outputs/apk/release/app-release.apk "G:/My Drive/Where It Goes/Releases/$VERSION/WhereItGoes-v$VERSION.apk"


