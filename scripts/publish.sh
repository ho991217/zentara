#!/bin/bash

# Check if package name is provided
if [ -z "$1" ]; then
  echo "Please provide a package name (@zentara/core or @zentara/plugin-suggestions)"
  exit 1
fi

# Check if version is provided
if [ -z "$2" ]; then
  echo "Please provide a version (major, minor, patch, or specific version)"
  exit 1
fi

PACKAGE_NAME=$1
VERSION=$2

# Function to get current version from package.json
get_current_version() {
  node -p "require('./packages/${1}/package.json').version"
}

# Function to increment version
increment_version() {
  local current_version=$1
  local increment_type=$2
  
  if [[ $increment_type == "major" || $increment_type == "minor" || $increment_type == "patch" ]]; then
    npm version $increment_type --no-git-tag-version
    NEW_VERSION=$(npm pkg get version | tr -d '"')
  else
    NEW_VERSION=$increment_type
  fi
  
  echo $NEW_VERSION
}

# Determine package directory
case $PACKAGE_NAME in
  "@zentara/core")
    PACKAGE_DIR="core"
    ;;
  "@zentara/plugin-suggestions")
    PACKAGE_DIR="plugins/suggestions"
    ;;
  *)
    echo "Invalid package name. Please use @zentara/core or @zentara/plugin-suggestions"
    exit 1
    ;;
esac

# Get current version and increment it
cd "packages/$PACKAGE_DIR"
CURRENT_VERSION=$(get_current_version $PACKAGE_DIR)
NEW_VERSION=$(increment_version $CURRENT_VERSION $VERSION)

# Update package.json version
npm version $NEW_VERSION --no-git-tag-version

# Create and push git tag
git add package.json
git commit -m "chore(release): $PACKAGE_NAME@$NEW_VERSION"
git tag "$PACKAGE_NAME@$NEW_VERSION"
git push origin "$PACKAGE_NAME@$NEW_VERSION"
git push

echo "Created and pushed tag $PACKAGE_NAME@$NEW_VERSION" 