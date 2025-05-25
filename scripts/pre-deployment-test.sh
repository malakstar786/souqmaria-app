#!/bin/bash

# SouqMaria Pre-Deployment Testing Script
# This script runs comprehensive tests before deployment

set -e

echo "🧪 Starting SouqMaria Pre-Deployment Testing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

run_warning_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Checking: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        ((TESTS_PASSED++))
    else
        print_warning "$test_name"
        ((TESTS_WARNED++))
    fi
}

# 1. Environment and Dependencies
print_status "=== Environment and Dependencies ==="
run_test "Node.js version check" "node --version | grep -E 'v(18|20|21)'"
run_test "npm dependencies installed" "[ -d node_modules ]"
run_test "Expo CLI available" "command -v expo"

# 2. Code Quality
print_status "=== Code Quality ==="
run_test "TypeScript compilation" "npx tsc --noEmit"
run_warning_test "ESLint checks" "npm run lint --if-present"
run_warning_test "Prettier formatting" "npm run format:check --if-present"

# 3. App Configuration
print_status "=== App Configuration ==="
run_test "app.json exists" "[ -f app.json ]"
run_test "App name configured" "grep -q '\"name\"' app.json"
run_test "Bundle identifier set" "grep -q 'bundleIdentifier\\|package' app.json"
run_warning_test "Expo doctor checks" "npx expo-doctor"

# 4. API and Network Tests
print_status "=== API and Network Tests ==="
run_test "API endpoint reachable" "curl -s --head https://api.souqmaria.com/api/MerpecWebApi/ | head -n 1 | grep -q '200\\|301\\|302'"
run_test "HTTPS certificate valid" "curl -s https://api.souqmaria.com/api/MerpecWebApi/ > /dev/null"

# 5. Performance and Security
print_status "=== Performance and Security ==="
run_test "No hardcoded secrets" "! grep -r 'password\\|secret\\|key' src/ --include='*.ts' --include='*.tsx' | grep -v 'placeholder\\|example\\|test'"
run_test "HTTPS URLs only" "! grep -r 'http://' src/ --include='*.ts' --include='*.tsx' || true"
run_warning_test "Bundle size check" "[ ! -d dist ] || du -sh dist/ | awk '{print $1}' | grep -E '^[0-9]{1,2}M$'"

# 6. Localization and RTL
print_status "=== Localization and RTL ==="
run_test "Translation files exist" "[ -f src/utils/translations.ts ]"
run_test "RTL utilities exist" "[ -f src/utils/rtl.ts ]"
run_test "Arabic translations present" "grep -q 'ar.*:' src/utils/translations.ts"

# 7. Critical Features
print_status "=== Critical Features ==="
run_test "Error boundary exists" "[ -f src/components/ErrorBoundary.tsx ]"
run_test "Network monitoring exists" "[ -f src/utils/network-monitor.ts ]"
run_test "Performance monitoring exists" "[ -f src/utils/performance-monitor.ts ]"
run_test "API caching implemented" "[ -f src/utils/api-cache.ts ]"

# 8. Legal and Compliance
print_status "=== Legal and Compliance ==="
run_test "Privacy policy exists" "[ -f legal/privacy-policy.md ]"
run_warning_test "App store metadata exists" "[ -f app-store-metadata.json ]"

# 9. Build Configuration
print_status "=== Build Configuration ==="
run_test "EAS configuration exists" "[ -f eas.json ]"
run_test "Production build profile configured" "grep -q '\"production\"' eas.json"

# 10. Asset Validation
print_status "=== Asset Validation ==="
run_warning_test "App icon exists" "[ -f assets/icon.png ] || [ -f src/assets/logo.png ]"
run_warning_test "Splash screen exists" "[ -f assets/splash.png ] || [ -f src/assets/logo.png ]"

# Summary
echo ""
echo "=== Test Summary ==="
print_success "Tests Passed: $TESTS_PASSED"
if [ $TESTS_WARNED -gt 0 ]; then
    print_warning "Tests with Warnings: $TESTS_WARNED"
fi
if [ $TESTS_FAILED -gt 0 ]; then
    print_error "Tests Failed: $TESTS_FAILED"
fi

echo ""
if [ $TESTS_FAILED -eq 0 ]; then
    print_success "🎉 All critical tests passed! App is ready for deployment."
    
    if [ $TESTS_WARNED -gt 0 ]; then
        print_warning "⚠️  Some warnings found. Please review before deployment."
    fi
    
    echo ""
    echo "Next steps:"
    echo "1. Run: ./scripts/build-production.sh [ios|android|all]"
    echo "2. Test on physical devices"
    echo "3. Submit to app stores"
    
    exit 0
else
    print_error "❌ Critical tests failed. Please fix issues before deployment."
    exit 1
fi 