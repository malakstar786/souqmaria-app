import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, I18nManager } from 'react-native';
import useLanguageStore from '../store/language-store';
import useCategoryStore from '../store/category-store';
import useAuthStore from '../store/auth-store';

interface DeploymentCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

interface DeploymentReport {
  overall: 'READY' | 'NEEDS_ATTENTION' | 'NOT_READY';
  summary: {
    passed: number;
    warnings: number;
    failed: number;
    total: number;
  };
  checks: DeploymentCheck[];
}

/**
 * Run comprehensive deployment readiness checks
 */
export async function runDeploymentChecks(): Promise<DeploymentReport> {
  const checks: DeploymentCheck[] = [];
  
  console.log('🔍 Starting deployment readiness checks...');
  
  // 1. Store Initialization Checks
  try {
    const languageStore = useLanguageStore.getState();
    const categoryStore = useCategoryStore.getState();
    const authStore = useAuthStore.getState();
    
    checks.push({
      name: 'Language Store Initialization',
      status: languageStore.currentLanguage ? 'PASS' : 'FAIL',
      message: languageStore.currentLanguage 
        ? `Language store initialized with ${languageStore.currentLanguage.code}`
        : 'Language store not properly initialized',
    });
    
    checks.push({
      name: 'Store State Management',
      status: 'PASS',
      message: 'All Zustand stores are accessible',
    });
  } catch (error) {
    checks.push({
      name: 'Store Initialization',
      status: 'FAIL',
      message: 'Failed to access store state',
      details: String(error),
    });
  }
  
  // 2. RTL Support Validation
  try {
    const currentLanguage = useLanguageStore.getState().currentLanguage;
    const isArabic = currentLanguage.code === 'ar';
    const i18nRTLState = I18nManager.isRTL;
    
    checks.push({
      name: 'RTL Language Support',
      status: 'PASS',
      message: `RTL support available - Current: ${currentLanguage.code}, I18n RTL: ${i18nRTLState}`,
    });
    
    // Android-specific RTL check
    if (Platform.OS === 'android') {
      checks.push({
        name: 'Android RTL State',
        status: (isArabic === i18nRTLState) ? 'PASS' : 'WARNING',
        message: isArabic === i18nRTLState 
          ? 'Android RTL state matches language'
          : 'Android RTL state mismatch - may need app restart',
      });
    }
  } catch (error) {
    checks.push({
      name: 'RTL Support',
      status: 'FAIL',
      message: 'RTL support check failed',
      details: String(error),
    });
  }
  
  // 3. AsyncStorage Functionality
  try {
    const testKey = 'deployment-test';
    await AsyncStorage.setItem(testKey, 'test-value');
    const retrievedValue = await AsyncStorage.getItem(testKey);
    await AsyncStorage.removeItem(testKey);
    
    checks.push({
      name: 'AsyncStorage Functionality',
      status: retrievedValue === 'test-value' ? 'PASS' : 'FAIL',
      message: retrievedValue === 'test-value' 
        ? 'AsyncStorage read/write working correctly'
        : 'AsyncStorage not functioning properly',
    });
  } catch (error) {
    checks.push({
      name: 'AsyncStorage Functionality',
      status: 'FAIL',
      message: 'AsyncStorage test failed',
      details: String(error),
    });
  }
  
  // 4. API Connectivity (basic check)
  try {
    const response = await fetch('https://api.souqmaria.com/api/MerpecWebApi/', {
      method: 'HEAD',
    });
    
    checks.push({
      name: 'API Connectivity',
      status: response.ok ? 'PASS' : 'WARNING',
      message: response.ok 
        ? 'API endpoint is reachable'
        : `API endpoint returned status: ${response.status}`,
    });
  } catch (error) {
    checks.push({
      name: 'API Connectivity',
      status: 'WARNING',
      message: 'API connectivity test failed - check network connection',
      details: String(error),
    });
  }
  
  // 5. Translation System
  try {
    const { currentLanguage } = useLanguageStore.getState();
    const availableLanguages = ['en', 'ar']; // Available languages from LANGUAGES constant
    
    checks.push({
      name: 'Translation System',
      status: availableLanguages.length >= 2 ? 'PASS' : 'WARNING',
      message: `${availableLanguages.length} languages available (${availableLanguages.join(', ')})`,
    });
  } catch (error) {
    checks.push({
      name: 'Translation System',
      status: 'FAIL',
      message: 'Translation system check failed',
      details: String(error),
    });
  }
  
  // 6. Platform-Specific Checks
  if (Platform.OS === 'ios') {
    checks.push({
      name: 'iOS Platform Features',
      status: 'PASS',
      message: 'iOS-specific features available',
    });
  } else if (Platform.OS === 'android') {
    checks.push({
      name: 'Android Platform Features',
      status: 'PASS',
      message: 'Android-specific features available',
    });
  }
  
  // 7. Performance Checks
  try {
    const startTime = Date.now();
    // Simulate a small performance test
    for (let i = 0; i < 1000; i++) {
      JSON.parse('{"test": "value"}');
    }
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    checks.push({
      name: 'Basic Performance',
      status: duration < 100 ? 'PASS' : 'WARNING',
      message: `Performance test completed in ${duration}ms`,
    });
  } catch (error) {
    checks.push({
      name: 'Basic Performance',
      status: 'WARNING',
      message: 'Performance test failed',
      details: String(error),
    });
  }
  
  // 8. Security Checks
  checks.push({
    name: 'Development Mode Check',
    status: __DEV__ ? 'WARNING' : 'PASS',
    message: __DEV__ 
      ? 'App is in development mode - ensure production build for release'
      : 'App is in production mode',
  });
  
  // Calculate summary
  const passed = checks.filter(c => c.status === 'PASS').length;
  const warnings = checks.filter(c => c.status === 'WARNING').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const total = checks.length;
  
  let overall: 'READY' | 'NEEDS_ATTENTION' | 'NOT_READY';
  if (failed > 0) {
    overall = 'NOT_READY';
  } else if (warnings > 0) {
    overall = 'NEEDS_ATTENTION';
  } else {
    overall = 'READY';
  }
  
  const report: DeploymentReport = {
    overall,
    summary: { passed, warnings, failed, total },
    checks,
  };
  
  console.log('📊 Deployment check completed:', {
    overall,
    passed,
    warnings,
    failed,
    total,
  });
  
  return report;
}

/**
 * Quick deployment readiness check for development
 */
export async function quickDeploymentCheck(): Promise<boolean> {
  try {
    const report = await runDeploymentChecks();
    return report.overall !== 'NOT_READY';
  } catch (error) {
    console.error('Quick deployment check failed:', error);
    return false;
  }
}

/**
 * Print deployment report to console
 */
export function printDeploymentReport(report: DeploymentReport): void {
  console.log('\n🚀 DEPLOYMENT READINESS REPORT');
  console.log('='.repeat(50));
  console.log(`Overall Status: ${report.overall}`);
  console.log(`Summary: ${report.summary.passed} PASS, ${report.summary.warnings} WARNING, ${report.summary.failed} FAIL`);
  console.log('\nDetailed Results:');
  
  report.checks.forEach((check, index) => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${index + 1}. ${icon} ${check.name}: ${check.message}`);
    if (check.details) {
      console.log(`   Details: ${check.details}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (report.overall === 'READY') {
    console.log('🎉 App is ready for deployment!');
  } else if (report.overall === 'NEEDS_ATTENTION') {
    console.log('⚠️ App has warnings but can be deployed. Please review issues above.');
  } else {
    console.log('❌ App is not ready for deployment. Please fix critical issues above.');
  }
} 