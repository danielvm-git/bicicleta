#!/bin/bash
set -e

echo "Testing POST /api/builds..."
BUILD_RESPONSE=$(curl -s -X POST http://localhost:3000/api/builds \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Build",
    "description": "A build for testing",
    "totalPrice": 516.74,
    "componentIds": [2267, 2290]
  }')

echo "Response from POST:"
echo "$BUILD_RESPONSE"

BUILD_ID=$(echo $BUILD_RESPONSE | jq '.id')

if [ -z "$BUILD_ID" ]; then
  echo "Failed to get BUILD_ID from response"
  exit 1
fi

echo "Testing GET /api/builds..."
GET_RESPONSE=$(curl -s http://localhost:3000/api/builds)

echo "Response from GET (first 100 chars):"
echo "${GET_RESPONSE:0:100}..."

if [[ "$GET_RESPONSE" == *"$BUILD_ID"* ]]; then
  echo "Verification PASSED: Build $BUILD_ID found in list"
else
  echo "Verification FAILED: Build $BUILD_ID not found in list"
  exit 1
fi
