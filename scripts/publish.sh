#!/bin/bash

# Check if package directory is provided
if [ -z "$1" ]; then
  echo "Please provide a package directory (e.g., core, plugins/suggestions)"
  exit 1
fi

# Check if version is provided
if [ -z "$2" ]; then
  echo "Please provide a version (major, minor, patch, or specific version)"
  exit 1
fi

PACKAGE_DIR=$1
VERSION=$2

# Function to get package info from package.json
get_package_info() {
  local field=$1
  node -p "require('./packages/${PACKAGE_DIR}/package.json').$field"
}

# Get package name and current version
PACKAGE_NAME=$(get_package_info "name")
CURRENT_VERSION=$(get_package_info "version")

# Change to package directory
cd "packages/$PACKAGE_DIR" || {
  echo "Error: Package directory 'packages/$PACKAGE_DIR' not found"
  exit 1
}

# Update version in package.json
if [[ $VERSION == "major" || $VERSION == "minor" || $VERSION == "patch" ]]; then
  NEW_VERSION=$(npm --no-git-tag-version version $VERSION)
  NEW_VERSION=${NEW_VERSION:1} # Remove the 'v' prefix
else
  npm --no-git-tag-version version $VERSION
  NEW_VERSION=$VERSION
fi

# Go back to root
cd ../..

# Create and push git tag
git add "packages/$PACKAGE_DIR/package.json"
git commit -m "chore(release): $PACKAGE_NAME@$NEW_VERSION"
git tag "$PACKAGE_NAME@$NEW_VERSION"
git push origin "$PACKAGE_NAME@$NEW_VERSION"
git push

echo "Created and pushed tag $PACKAGE_NAME@$NEW_VERSION" 