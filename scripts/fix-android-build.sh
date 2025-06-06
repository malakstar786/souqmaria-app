#!/bin/bash

echo "🔧 Fixing Android Build Issues..."

# Clear all caches
echo "📦 Clearing caches..."
rm -rf node_modules
rm -rf .expo
rm -rf android
rm -rf ios
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Fix any peer dependency issues
echo "📦 Fixing dependencies..."
npx expo install --fix

# Clear Metro cache
echo "📦 Clearing Metro cache..."
npx expo start --clear --reset-cache || true

# Check for common issues
echo "🔍 Checking for common issues..."

# Check if google-services.json exists
if [ ! -f "google-services.json" ]; then
    echo "❌ google-services.json is missing!"
    echo "Please add your Google Services configuration file."
    exit 1
fi

# Check if eas.json is configured properly
if [ ! -f "eas.json" ]; then
    echo "❌ eas.json is missing!"
    echo "Please configure EAS Build."
    exit 1
fi

echo "✅ Android build preparation complete!"
echo "Now run: npx eas build --platform android --profile production" 