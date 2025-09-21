#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building packages..."
cd packages/db && pnpm build && cd ../..
cd packages/ui && pnpm build && cd ../..

echo "Building web app..."
cd apps/web
SKIP_ENV_VALIDATION=1 pnpm build
cd ../..