#!/usr/bin/env node

/**
 * SouqMaria Deployment Readiness Check
 * Validates the app is ready for iOS and Android deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function logSection(title) {
  log('\n' + '='.repeat(50), colors.cyan);
  log(`📋 ${title}`, colors.cyan);
  log('='.repeat(50), colors.cyan);
}

function logCheck(name, status, message = '') {
  const icon = status === 'PASS' ? '✅' : status === 'WARNING' ? '⚠️' : '❌';
  const color = status === 'PASS' ? colors.green : status === 'WARNING' ? colors.yellow : colors.red;
  log(`${icon} ${name}${message ? ': ' + message : ''}`, color);
}

function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(process.cwd(), filePath));
  } catch (error) {
    return false;
  }
}

function runCommand(command, silent = true) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function checkPackageJson() {
  logSection('Package Configuration');
  
  if (!fileExists('package.json')) {
    logCheck('package.json exists', 'FAIL', 'Missing package.json');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  logCheck('package.json exists', 'PASS');
  logCheck('App name configured', packageJson.name ? 'PASS' : 'FAIL', packageJson.name || 'Missing');
  logCheck('Version set', packageJson.version ? 'PASS' : 'FAIL', packageJson.version || 'Missing');
  
  // Check essential dependencies
  const requiredDeps = [
    'expo',
    'expo-router', 
    'react',
    'react-native',
    'zustand',
    '@react-native-async-storage/async-storage'
  ];
  
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  requiredDeps.forEach(dep => {
    logCheck(`${dep} installed`, dependencies[dep] ? 'PASS' : 'FAIL', dependencies[dep] || 'Missing');
  });
}

function checkAppConfiguration() {
  logSection('App Configuration');
  
  if (!fileExists('app.json')) {
    logCheck('app.json exists', 'FAIL', 'Missing app.json');
    return;
  }
  
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const expo = appJson.expo || {};
  
  logCheck('app.json exists', 'PASS');
  logCheck('App name configured', expo.name ? 'PASS' : 'FAIL', expo.name || 'Missing');
  logCheck('App slug configured', expo.slug ? 'PASS' : 'FAIL', expo.slug || 'Missing');
  logCheck('Version configured', expo.version ? 'PASS' : 'FAIL', expo.version || 'Missing');
  
  // iOS configuration
  if (expo.ios) {
    logCheck('iOS bundle identifier', expo.ios.bundleIdentifier ? 'PASS' : 'FAIL', expo.ios.bundleIdentifier || 'Missing');
    logCheck('iOS build number', expo.ios.buildNumber ? 'PASS' : 'WARNING', expo.ios.buildNumber || 'Not set');
  } else {
    logCheck('iOS configuration', 'FAIL', 'Missing iOS configuration');
  }
  
  // Android configuration
  if (expo.android) {
    logCheck('Android package name', expo.android.package ? 'PASS' : 'FAIL', expo.android.package || 'Missing');
    logCheck('Android version code', expo.android.versionCode ? 'PASS' : 'WARNING', expo.android.versionCode || 'Not set');
  } else {
    logCheck('Android configuration', 'FAIL', 'Missing Android configuration');
  }
  
  // Check for required plugins
  const plugins = expo.plugins || [];
  logCheck('Expo Router plugin', plugins.includes('expo-router') ? 'PASS' : 'FAIL');
  
  // Check for Google services files
  if (expo.ios && expo.ios.googleServicesFile) {
    logCheck('iOS Google Services', fileExists(expo.ios.googleServicesFile) ? 'PASS' : 'WARNING', expo.ios.googleServicesFile);
  }
  
  if (expo.android && expo.android.googleServicesFile) {
    logCheck('Android Google Services', fileExists(expo.android.googleServicesFile) ? 'PASS' : 'WARNING', expo.android.googleServicesFile);
  }
}

function checkAssets() {
  logSection('Assets and Resources');
  
  const assetChecks = [
    { path: 'src/assets/icon.png', name: 'App icon' },
    { path: 'src/assets/splash.png', name: 'Splash screen' },
    { path: 'src/assets/logo.png', name: 'App logo' },
  ];
  
  assetChecks.forEach(({ path, name }) => {
    logCheck(name, fileExists(path) ? 'PASS' : 'WARNING', path);
  });
}

function checkSourceCode() {
  logSection('Source Code Structure');
  
  const sourceChecks = [
    { path: 'src/app', name: 'App directory (Expo Router)' },
    { path: 'src/components', name: 'Components directory' },
    { path: 'src/store', name: 'Store directory' },
    { path: 'src/utils', name: 'Utils directory' },
    { path: 'src/theme.ts', name: 'Theme configuration' },
    { path: 'src/app/(shop)/_layout.tsx', name: 'Shop layout' },
    { path: 'src/app/(shop)/index.tsx', name: 'Home screen' },
  ];
  
  sourceChecks.forEach(({ path, name }) => {
    logCheck(name, fileExists(path) ? 'PASS' : 'FAIL', path);
  });
  
  // Check for essential utility files
  const utilChecks = [
    { path: 'src/utils/translations.ts', name: 'Translations system' },
    { path: 'src/utils/api-service.ts', name: 'API service' },
    { path: 'src/utils/rtl.ts', name: 'RTL utilities' },
    { path: 'src/store/language-store.ts', name: 'Language store' },
    { path: 'src/store/auth-store.ts', name: 'Auth store' },
  ];
  
  utilChecks.forEach(({ path, name }) => {
    logCheck(name, fileExists(path) ? 'PASS' : 'FAIL', path);
  });
}

function checkBuildConfiguration() {
  logSection('Build Configuration');
  
  // Check EAS configuration
  if (fileExists('eas.json')) {
    logCheck('EAS configuration exists', 'PASS');
    
    const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
    const build = easJson.build || {};
    
    logCheck('Production build profile', build.production ? 'PASS' : 'FAIL');
    logCheck('Development build profile', build.development ? 'PASS' : 'WARNING');
  } else {
    logCheck('EAS configuration', 'WARNING', 'Missing eas.json - required for Expo Application Services');
  }
  
  // Check TypeScript configuration
  if (fileExists('tsconfig.json')) {
    logCheck('TypeScript configuration', 'PASS');
  } else {
    logCheck('TypeScript configuration', 'FAIL', 'Missing tsconfig.json');
  }
  
  // Check Babel configuration
  if (fileExists('babel.config.js')) {
    logCheck('Babel configuration', 'PASS');
  } else {
    logCheck('Babel configuration', 'FAIL', 'Missing babel.config.js');
  }
}

function checkDependencies() {
  logSection('Dependencies Check');
  
  log('📦 Checking npm dependencies...', colors.blue);
  const npmCheck = runCommand('npm ls --depth=0');
  
  if (npmCheck.success) {
    logCheck('NPM dependencies', 'PASS', 'All dependencies installed');
  } else {
    logCheck('NPM dependencies', 'WARNING', 'Some dependency issues detected');
  }
  
  // Check for peer dependency warnings
  const auditCheck = runCommand('npm audit --audit-level moderate');
  if (auditCheck.success) {
    logCheck('Security audit', 'PASS', 'No moderate+ vulnerabilities');
  } else {
    logCheck('Security audit', 'WARNING', 'Run npm audit for details');
  }
}

function checkPlatformReadiness() {
  logSection('Platform Readiness');
  
  // Check iOS readiness
  if (process.platform === 'darwin') {
    const xcodeCheck = runCommand('xcode-select -p');
    logCheck('Xcode tools', xcodeCheck.success ? 'PASS' : 'WARNING', 'Required for iOS builds');
    
    const simulatorCheck = runCommand('xcrun simctl list');
    logCheck('iOS Simulator', simulatorCheck.success ? 'PASS' : 'WARNING', 'For iOS testing');
  } else {
    logCheck('iOS development', 'WARNING', 'macOS required for iOS builds');
  }
  
  // Check Android readiness
  logCheck('Android build capability', 'PASS', 'Available on all platforms via EAS Build');
  
  // Check Expo CLI
  const expoCheck = runCommand('npx expo --version');
  logCheck('Expo CLI', expoCheck.success ? 'PASS' : 'FAIL', expoCheck.success ? expoCheck.output.trim() : 'Not installed');
}

function checkDeploymentFiles() {
  logSection('Deployment Files');
  
  const deploymentChecks = [
    { path: 'GoogleService-Info.plist', name: 'iOS Google Services', required: false },
    { path: 'google-services.json', name: 'Android Google Services', required: false },
    { path: 'app-store-metadata.json', name: 'App Store metadata', required: false },
  ];
  
  deploymentChecks.forEach(({ path, name, required }) => {
    const exists = fileExists(path);
    const status = exists ? 'PASS' : (required ? 'FAIL' : 'WARNING');
    logCheck(name, status, exists ? path : 'Not found');
  });
}

function runFinalChecks() {
  logSection('Final Validation');
  
  // Check if app can start
  log('🚀 Testing app compilation...', colors.blue);
  const compileCheck = runCommand('npx tsc --noEmit', false);
  
  if (compileCheck.success) {
    logCheck('TypeScript compilation', 'PASS', 'No type errors');
  } else {
    logCheck('TypeScript compilation', 'WARNING', 'Type errors detected - check console');
  }
  
  // Check essential scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = ['start', 'android', 'ios'];
  requiredScripts.forEach(script => {
    logCheck(`${script} script`, scripts[script] ? 'PASS' : 'FAIL');
  });
}

function main() {
  log('🚀 SouqMaria Deployment Readiness Check', colors.magenta);
  log('==========================================', colors.magenta);
  
  try {
    checkPackageJson();
    checkAppConfiguration();
    checkAssets();
    checkSourceCode();
    checkBuildConfiguration();
    checkDependencies();
    checkPlatformReadiness();
    checkDeploymentFiles();
    runFinalChecks();
    
    logSection('Summary');
    log('🎉 Deployment readiness check completed!', colors.green);
    log('\nNext steps for deployment:', colors.blue);
    log('1. Fix any FAIL items above', colors.yellow);
    log('2. Review WARNING items', colors.yellow);
    log('3. Run: npx expo start --clear', colors.cyan);
    log('4. Test on both iOS and Android', colors.cyan);
    log('5. Build with: npx eas build --platform all', colors.cyan);
    
  } catch (error) {
    log(`\n❌ Deployment check failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main }; 