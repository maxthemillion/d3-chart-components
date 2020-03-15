#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build-package
npm login
npm publish --access public