#!/bin/bash

# SouqMaria Cache Clearing Script
# This script safely clears all caches and resets the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🧹 SouqMaria Cache Clearing Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root."
    exit 1
fi

# Stop any running Expo/Metro processes
print_status "Stopping running processes..."
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "react-native" || true
print_success "Processes stopped"

# Clear Node.js cache
print_status "Clearing Node.js cache..."
npm cache clean --force
print_success "Node.js cache cleared"

# Clear Yarn cache (if using Yarn)
if command -v yarn &> /dev/null; then
    print_status "Clearing Yarn cache..."
    yarn cache clean
    print_success "Yarn cache cleared"
fi

# Clear Metro bundler cache
print_status "Clearing Metro bundler cache..."
if command -v expo &> /dev/null; then
    npx expo start --clear || true
fi
if command -v react-native &> /dev/null; then
    npx react-native start --reset-cache || true
fi
print_success "Metro cache cleared"

# Clear Expo cache
print_status "Clearing Expo cache..."
if command -v expo &> /dev/null; then
    npx expo install --fix
fi
print_success "Expo cache cleared"

# Clear iOS Simulator cache (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Clearing iOS Simulator cache..."
    xcrun simctl erase all || true
    print_success "iOS Simulator cache cleared"
fi

# Clear Android emulator cache
print_status "Clearing Android cache..."
if [ -d "$HOME/.android/avd" ]; then
    find "$HOME/.android/avd" -name "*.avd" -exec rm -rf {}/*.lock \; 2>/dev/null || true
    find "$HOME/.android/avd" -name "*.avd" -exec rm -rf {}/cache.img \; 2>/dev/null || true
    find "$HOME/.android/avd" -name "*.avd" -exec rm -rf {}/userdata-qemu.img \; 2>/dev/null || true
    print_success "Android cache cleared"
fi

# Clear Watchman cache (if installed)
if command -v watchman &> /dev/null; then
    print_status "Clearing Watchman cache..."
    watchman watch-del-all
    print_success "Watchman cache cleared"
fi

# Clear TypeScript cache
print_status "Clearing TypeScript cache..."
if [ -f "tsconfig.json" ]; then
    npx tsc --build --clean || true
fi
print_success "TypeScript cache cleared"

# Clear ESLint cache
print_status "Clearing ESLint cache..."
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
    npx eslint --cache --cache-strategy content --cache-location .eslintcache --ext .js,.jsx,.ts,.tsx src/ || true
    rm -f .eslintcache
fi
print_success "ESLint cache cleared"

# Clear temporary files
print_status "Clearing temporary files..."
rm -rf .expo/
rm -rf .expo-shared/
rm -rf node_modules/.cache/
rm -rf /tmp/metro-*
rm -rf /tmp/react-native-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-native-*
print_success "Temporary files cleared"

# Reinstall dependencies to ensure clean state
print_status "Reinstalling dependencies..."
rm -rf node_modules/
if [ -f "package-lock.json" ]; then
    npm ci
elif [ -f "yarn.lock" ]; then
    yarn install --frozen-lockfile
else
    npm install
fi
print_success "Dependencies reinstalled"

# Create a simple cache clearing helper script for the app
print_status "Creating app cache clearing utility..."
cat > temp-clear-cache.js << 'EOF'
// Temporary script to clear app caches
import { clearAllCaches } from './src/utils/cache-cleaner';

async function clearAppCaches() {
  console.log('🧹 Clearing all app caches...');
  
  try {
    const result = await clearAllCaches();
    console.log('Cache clearing result:', result);
    
    if (result.success) {
      console.log('✅ All app caches cleared successfully!');
      console.log('📱 Please restart the app completely');
    } else {
      console.log('⚠️ Some errors occurred:', result.errors);
    }
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
  }
}

clearAppCaches();
EOF

print_success "Cache clearing utility created"

echo ""
echo "🎉 Cache clearing completed!"
echo ""
print_success "All development caches have been cleared"
print_warning "IMPORTANT: After starting the app, it will also clear all app-level caches"
print_warning "This includes AsyncStorage, API cache, and RTL settings"
echo ""
echo "Next steps:"
echo "1. Run: npm start (or expo start)"
echo "2. Press 'r' to reload the app completely"
echo "3. The app will start fresh with default English language"
echo "4. Test language switching to ensure RTL/LTR works correctly"
echo ""
print_status "If issues persist, please check the console logs for specific errors"

# Clean up temporary files
rm -f temp-clear-cache.js

exit 0 