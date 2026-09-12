#!/bin/bash

# Test script to verify routing works across all locales and page types
# Checks: / → /en/ redirect, /en/* pages, /ar/* pages

BASE_URL="${1:-http://localhost:4321}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

test_route() {
  local path="$1"
  local expected_status="${2:-200}"
  local description="$3"

  local response=$(curl -s -w "\n%{http_code}" "$BASE_URL$path")
  local body=$(echo "$response" | head -n -1)
  local status=$(echo "$response" | tail -n 1)

  if [ "$status" = "$expected_status" ]; then
    echo -e "${GREEN}✓${NC} $description"
    echo "  Path: $path | Status: $status"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $description"
    echo "  Path: $path | Expected: $expected_status | Got: $status"
    ((FAIL++))
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing Root Redirect"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/" "308" "Root / redirects (308 status)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing English Home & Main Pages (/en/*)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/en/" "200" "English home /en/"
test_route "/en/about/" "200" "English about page"
test_route "/en/contact/" "200" "English contact page"
test_route "/en/treatments/" "200" "English treatments index"
test_route "/en/doctors/" "200" "English doctors index"
test_route "/en/services/" "200" "English services index"
test_route "/en/blog/" "200" "English blog index"
test_route "/en/cases/" "200" "English cases index"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing English Detail Pages (/en/treatments/*, etc)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/en/treatments/back-pain/" "200" "English treatment: back-pain"
test_route "/en/treatments/sports-injuries/" "200" "English treatment: sports-injuries"
test_route "/en/doctors/" "200" "English doctors list"
test_route "/en/services/chiropractic/" "200" "English service: chiropractic"
test_route "/en/services/botox/" "200" "English service: botox (if exists)"
test_route "/en/blog/" "200" "English blog list"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing Arabic Home & Main Pages (/ar/*)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/ar/" "200" "Arabic home /ar/"
test_route "/ar/about/" "200" "Arabic about page"
test_route "/ar/contact/" "200" "Arabic contact page"
test_route "/ar/treatments/" "200" "Arabic treatments index"
test_route "/ar/doctors/" "200" "Arabic doctors index"
test_route "/ar/services/" "200" "Arabic services index"
test_route "/ar/blog/" "200" "Arabic blog index"
test_route "/ar/cases/" "200" "Arabic cases index"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing Arabic Detail Pages (/ar/treatments/*, etc)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/ar/treatments/back-pain/" "200" "Arabic treatment: back-pain"
test_route "/ar/treatments/sports-injuries/" "200" "Arabic treatment: sports-injuries"
test_route "/ar/services/chiropractic/" "200" "Arabic service: chiropractic"
test_route "/ar/services/botox/" "200" "Arabic service: botox (if exists)"
test_route "/ar/blog/" "200" "Arabic blog list"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing Root Routes (Old System - should still work)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_route "/about/" "200" "Root about page"
test_route "/contact/" "200" "Root contact page"
test_route "/treatments/" "200" "Root treatments index"
test_route "/treatments/back-pain/" "200" "Root treatment: back-pain"
test_route "/doctors/" "200" "Root doctors index"
test_route "/services/" "200" "Root services index"
test_route "/services/botox/" "200" "Root service: botox"
test_route "/blog/" "200" "Root blog index"
test_route "/cases/" "200" "Root cases index"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Check output above.${NC}"
  exit 1
fi
