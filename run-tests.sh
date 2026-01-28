#!/bin/bash

set -e

echo "=== Building and Testing Bank Account Project ==="

# Build and test API
echo ""
echo "=== Building API ==="
cd bank-account-api
npm run build

echo ""
echo "=== Running API Tests ==="
npm run test:all

# Build and test UI
echo ""
echo "=== Building UI ==="
cd ../bank-account-ui
npm run build

echo ""
echo "=== All builds and tests completed successfully ==="
