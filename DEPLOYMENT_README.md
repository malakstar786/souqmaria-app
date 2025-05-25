# SouqMaria Mobile App - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g @expo/cli`)
- EAS CLI installed (`npm install -g eas-cli`)
- Apple Developer Account (for iOS)
- Google Play Console Account (for Android)

### 1. Pre-Deployment Testing
```bash
# Run comprehensive pre-deployment tests
npm run test:pre-deployment

# Or manually run the script
./scripts/pre-deployment-test.sh
```

### 2. Build for Production
```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android

# Build for both platforms
npm run build:all

# Or use the comprehensive build script
npm run build:production ios
```

### 3. Submit to App Stores
```bash
# Submit to iOS App Store
npm run submit:ios

# Submit to Google Play Store
npm run submit:android
```

## 📋 Detailed Deployment Steps

### Phase 1: Pre-Deployment Preparation

#### 1.1 Environment Setup
```bash
# Install dependencies
npm ci

# Verify environment
npm run doctor
```

#### 1.2 Code Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

#### 1.3 Configuration Validation
- [ ] Update `app.json` with correct bundle identifiers
- [ ] Set proper app version and build numbers
- [ ] Configure app icons and splash screens
- [ ] Update `eas.json` with Apple Team ID and service account

### Phase 2: Build Configuration

#### 2.1 iOS Configuration
1. **Apple Developer Account Setup**
   - Create App Store Connect app
   - Generate provisioning profiles
   - Set up certificates

2. **Update eas.json**
   ```json
   {
     "submit": {
       "production": {
         "ios": {
           "appleId": "your-apple-id@example.com",
           "ascAppId": "your-app-store-connect-app-id",
           "appleTeamId": "your-apple-team-id"
         }
       }
     }
   }
   ```

#### 2.2 Android Configuration
1. **Google Play Console Setup**
   - Create app in Play Console
   - Generate service account key
   - Set up app signing

2. **Service Account Setup**
   ```bash
   # Place your service account JSON file
   cp path/to/your/google-service-account.json ./google-service-account.json
   ```

### Phase 3: Asset Preparation

#### 3.1 App Icons
Required sizes:
- **iOS**: 1024x1024 (App Store), 180x180 (iPhone), 167x167 (iPad)
- **Android**: 512x512 (Play Store), adaptive icon layers

#### 3.2 Screenshots
Required for both stores:
- **iPhone**: 6.7", 6.5", 5.5" displays
- **iPad**: 12.9", 11" displays
- **Android**: Phone and tablet variants

#### 3.3 Store Metadata
Use the provided `app-store-metadata.json` template:
- App descriptions (English and Arabic)
- Keywords and categories
- Privacy policy and support URLs

### Phase 4: Testing and Validation

#### 4.1 Automated Testing
```bash
# Run all pre-deployment tests
npm run test:pre-deployment
```

#### 4.2 Manual Testing Checklist
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test Arabic language switching
- [ ] Test offline functionality
- [ ] Test payment flow (if applicable)
- [ ] Test deep linking
- [ ] Performance testing on low-end devices

### Phase 5: Production Build

#### 5.1 Build Commands
```bash
# iOS Production Build
eas build --platform ios --profile production

# Android Production Build
eas build --platform android --profile production

# Both Platforms
eas build --platform all --profile production
```

#### 5.2 Build Monitoring
- Monitor build progress in EAS dashboard
- Download and test builds on devices
- Verify app signing and certificates

### Phase 6: Store Submission

#### 6.1 iOS App Store
```bash
# Submit to App Store
eas submit --platform ios --profile production
```

**Manual Steps:**
1. Complete App Store Connect metadata
2. Upload screenshots and app preview
3. Set pricing and availability
4. Submit for review

#### 6.2 Google Play Store
```bash
# Submit to Play Store
eas submit --platform android --profile production
```

**Manual Steps:**
1. Complete Play Console store listing
2. Upload screenshots and feature graphic
3. Set content rating and pricing
4. Submit for review

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Expo cache
expo r -c

# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

#### Certificate Issues (iOS)
- Verify Apple Developer account status
- Check provisioning profiles
- Ensure certificates are not expired

#### Signing Issues (Android)
- Verify service account permissions
- Check app signing configuration
- Ensure upload key is correct

### Performance Issues
```bash
# Analyze bundle size
npx expo export --platform android --dev false
du -sh dist/

# Check for large assets
find src/ -name "*.png" -o -name "*.jpg" -exec ls -lh {} \;
```

## 📊 Post-Deployment Monitoring

### 1. App Store Analytics
- Monitor download and conversion rates
- Track user reviews and ratings
- Analyze crash reports

### 2. Performance Monitoring
- Set up crash reporting (Sentry/Crashlytics)
- Monitor API response times
- Track user engagement metrics

### 3. User Feedback
- Monitor app store reviews
- Set up in-app feedback collection
- Track support requests

## 🔄 Update and Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Update Expo SDK
npx expo install --fix
```

### Hotfix Deployment
```bash
# Quick build for critical fixes
eas build --platform all --profile production --auto-submit
```

## 📞 Support and Resources

- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Policies**: https://play.google.com/about/developer-content-policy/

---

**Last Updated**: January 2025
**Version**: 1.0.0 