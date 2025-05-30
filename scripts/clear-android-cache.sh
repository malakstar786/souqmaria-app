#!/bin/bash

# SouqMaria Android Cache Clearing Script
# This script clears ALL Android-specific caches and resets the app to a clean state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[ANDROID]${NC} $1"
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

print_section() {
    echo -e "\n${PURPLE}=== $1 ===${NC}"
}

echo "🤖 SouqMaria Android Cache Clearing Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root."
    exit 1
fi

# Confirmation prompt
echo -e "${YELLOW}⚠️  WARNING: This will clear ALL Android caches and reset the app to a clean state.${NC}"
echo -e "${YELLOW}   This includes Metro, Expo, Gradle, and Android emulator data.${NC}"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled by user"
    exit 0
fi

echo ""
print_status "Starting Android cache clearing process..."

# Stop any running processes
print_section "Stopping Running Processes"
print_status "Killing Expo and Metro processes..."
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "react-native" || true
pkill -f "adb" || true
print_success "Processes stopped"

# Clear Metro bundler cache
print_section "Metro Bundler Cache"
print_status "Clearing Metro bundler cache..."
if command -v npx >/dev/null 2>&1; then
    npx react-native start --reset-cache --verbose 2>/dev/null &
    sleep 3
    pkill -f "metro" || true
    print_success "Metro cache cleared"
else
    print_warning "npx not found, skipping Metro cache clear"
fi

# Clear Expo cache
print_section "Expo Cache"
print_status "Clearing Expo cache..."
if command -v expo >/dev/null 2>&1; then
    expo r -c --clear || true
    print_success "Expo cache cleared"
else
    print_warning "Expo CLI not found, skipping Expo cache clear"
fi

# Clear Watchman cache (if available)
print_section "Watchman Cache"
if command -v watchman >/dev/null 2>&1; then
    print_status "Clearing Watchman cache..."
    watchman watch-del-all || true
    print_success "Watchman cache cleared"
else
    print_warning "Watchman not found, skipping"
fi

# Clear Gradle cache (Android specific)
print_section "Android Gradle Cache"
print_status "Clearing Gradle cache and build artifacts..."

# Clear Gradle caches
if [ -d "$HOME/.gradle" ]; then
    print_status "Clearing global Gradle cache..."
    rm -rf "$HOME/.gradle/caches" || true
    rm -rf "$HOME/.gradle/daemon" || true
    print_success "Global Gradle cache cleared"
fi

# Clear local Android build artifacts
if [ -d "android" ]; then
    print_status "Clearing local Android build artifacts..."
    cd android
    if [ -f "gradlew" ]; then
        ./gradlew clean || true
        print_success "Gradle clean completed"
    fi
    
    # Remove build directories
    rm -rf build || true
    rm -rf app/build || true
    rm -rf .gradle || true
    
    print_success "Android build artifacts cleared"
    cd ..
else
    print_warning "Android directory not found, skipping Gradle cleanup"
fi

# Clear Android emulator data
print_section "Android Emulator Data"
print_status "Clearing Android emulator app data..."

# Get list of running emulators
if command -v adb >/dev/null 2>&1; then
    EMULATORS=$(adb devices | grep emulator | cut -f1)
    
    if [ ! -z "$EMULATORS" ]; then
        for emulator in $EMULATORS; do
            print_status "Clearing app data on emulator: $emulator"
            adb -s $emulator shell pm clear host.exp.exponent || true
            adb -s $emulator shell pm clear com.souqmaria.mobileappsm || true
            adb -s $emulator shell pm clear expo.modules.dev.launcher || true
        done
        print_success "Emulator app data cleared"
    else
        print_warning "No running Android emulators found"
    fi
else
    print_warning "ADB not found, skipping emulator cleanup"
fi

# Clear React Native cache directories
print_section "React Native Cache"
print_status "Clearing React Native cache directories..."

# Clear common RN cache locations
if [ -d "$HOME/.metro" ]; then
    rm -rf "$HOME/.metro" || true
    print_success "Metro cache directory cleared"
fi

if [ -d "/tmp/metro-*" ]; then
    rm -rf /tmp/metro-* || true
    print_success "Metro temp files cleared"
fi

if [ -d "/tmp/react-*" ]; then
    rm -rf /tmp/react-* || true
    print_success "React temp files cleared"
fi

# Clear npm/yarn cache
print_section "Package Manager Cache"
if command -v npm >/dev/null 2>&1; then
    print_status "Clearing npm cache..."
    npm cache clean --force || true
    print_success "npm cache cleared"
fi

if command -v yarn >/dev/null 2>&1; then
    print_status "Clearing yarn cache..."
    yarn cache clean || true
    print_success "yarn cache cleared"
fi

# Clear Android AVD cache (if exists)
print_section "Android AVD Cache"
if [ -d "$HOME/.android/avd" ]; then
    print_status "Clearing Android AVD cache files..."
    find "$HOME/.android/avd" -name "cache.img*" -delete || true
    find "$HOME/.android/avd" -name "userdata-qemu.img*" -delete || true
    print_success "AVD cache files cleared"
else
    print_warning "Android AVD directory not found"
fi

# Clear Expo local data
print_section "Expo Local Data"
print_status "Clearing Expo local data and settings..."

if [ -d "$HOME/.expo" ]; then
    # Clear Expo cache but preserve auth
    rm -rf "$HOME/.expo/packager-info" || true
    rm -rf "$HOME/.expo/settings.json" || true
    print_success "Expo local data cleared"
fi

# Clear project-specific cache files
print_section "Project Cache Files"
print_status "Clearing project-specific cache files..."

# Remove common cache files and directories
rm -rf .expo || true
rm -rf .metro || true
rm -rf node_modules/.cache || true
rm -rf babel.cache.json || true

print_success "Project cache files cleared"

# Reinstall dependencies
print_section "Reinstalling Dependencies"
print_status "Reinstalling node modules for fresh start..."

rm -rf node_modules || true
rm -f package-lock.json || true
rm -f yarn.lock || true

if command -v npm >/dev/null 2>&1; then
    print_status "Installing dependencies with npm..."
    npm install
    print_success "Dependencies reinstalled"
else
    print_error "npm not found, please manually run 'npm install'"
fi

# Final cleanup
print_section "Final Cleanup"
print_status "Performing final cleanup..."

# Clear any remaining temp files
rm -rf /tmp/expo-* || true
rm -rf /tmp/react-native-* || true

print_success "Final cleanup completed"

# Summary
echo ""
echo "🎉 Android Cache Clearing Complete!"
echo "=================================="
echo ""
print_success "✅ Metro bundler cache cleared"
print_success "✅ Expo cache cleared"
print_success "✅ Gradle cache and build artifacts cleared"
print_success "✅ Android emulator app data cleared"
print_success "✅ React Native cache cleared"
print_success "✅ Package manager cache cleared"
print_success "✅ Dependencies reinstalled"
echo ""
print_status "🚀 Your Android environment is now completely clean!"
echo ""
print_warning "Next steps:"
echo "1. Start your Android emulator"
echo "2. Run: npm start"
echo "3. Press 'a' to run on Android"
echo ""
print_warning "Note: The first build may take longer as everything is being rebuilt from scratch." 