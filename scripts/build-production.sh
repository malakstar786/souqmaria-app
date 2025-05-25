#!/bin/bash

# SouqMaria Production Build Script
# This script prepares and builds the app for production deployment

set -e  # Exit on any error

echo "🚀 Starting SouqMaria Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    print_error "app.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required tools are installed
print_status "Checking required tools..."

if ! command -v npx &> /dev/null; then
    print_error "npx is not installed. Please install Node.js and npm."
    exit 1
fi

if ! command -v expo &> /dev/null; then
    print_error "Expo CLI is not installed. Installing..."
    npm install -g @expo/cli
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf .expo/

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linting
print_status "Running linting checks..."
if npm run lint --if-present; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Please review and fix."
fi

# Run type checking
print_status "Running TypeScript type checking..."
if npx tsc --noEmit; then
    print_success "Type checking passed"
else
    print_error "Type checking failed. Please fix TypeScript errors."
    exit 1
fi

# Run tests if available
print_status "Running tests..."
if npm test --if-present; then
    print_success "Tests passed"
else
    print_warning "Tests failed or not available"
fi

# Check app configuration
print_status "Validating app configuration..."
if npx expo-doctor; then
    print_success "App configuration is valid"
else
    print_warning "App configuration issues found. Please review."
fi

# Build for production
print_status "Building for production..."

# iOS Build
if [ "$1" = "ios" ] || [ "$1" = "all" ]; then
    print_status "Building for iOS..."
    npx eas build --platform ios --profile production
    print_success "iOS build completed"
fi

# Android Build
if [ "$1" = "android" ] || [ "$1" = "all" ]; then
    print_status "Building for Android..."
    npx eas build --platform android --profile production
    print_success "Android build completed"
fi

# Web Build (if needed)
if [ "$1" = "web" ]; then
    print_status "Building for Web..."
    npx expo export --platform web
    print_success "Web build completed"
fi

print_success "🎉 Production build process completed!"
print_status "Next steps:"
echo "  1. Test the build on physical devices"
echo "  2. Submit to App Store/Play Store"
echo "  3. Monitor deployment and user feedback"

# Generate build report
print_status "Generating build report..."
echo "Build completed at: $(date)" > build-report.txt
echo "Platform: $1" >> build-report.txt
echo "App version: $(grep '"version"' app.json | cut -d'"' -f4)" >> build-report.txt
echo "Node version: $(node --version)" >> build-report.txt
echo "Expo CLI version: $(npx expo --version)" >> build-report.txt

print_success "Build report saved to build-report.txt" 