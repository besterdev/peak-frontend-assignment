#!/usr/bin/env bash
# Install and switch to the Node version in .nvmrc (22.19.0)
#
# Usage (preferred — switches Node in your current shell):
#   source scripts/use-node.sh
#   # or: nvm use
#
# Usage (install only; does not change parent shell):
#   npm run use-node

set -euo pipefail

_USE_NODE_SOURCED=0
if [ "${BASH_SOURCE[0]-}" != "${0-}" ]; then
  _USE_NODE_SOURCED=1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .nvmrc ]; then
  echo "error: .nvmrc not found in $ROOT_DIR" >&2
  if [ "$_USE_NODE_SOURCED" -eq 1 ]; then return 1; else exit 1; fi
fi

NODE_VERSION="$(tr -d '[:space:]' < .nvmrc)"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
elif command -v brew >/dev/null 2>&1 && [ -s "$(brew --prefix nvm 2>/dev/null)/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$(brew --prefix nvm)/nvm.sh"
else
  echo "error: nvm not found. Install nvm first: https://github.com/nvm-sh/nvm" >&2
  if [ "$_USE_NODE_SOURCED" -eq 1 ]; then return 1; else exit 1; fi
fi

echo "Using Node $NODE_VERSION..."
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

echo "Active: $(node -v) ($(command -v node))"

if [ "$_USE_NODE_SOURCED" -eq 0 ]; then
  echo
  echo "Note: run \`source scripts/use-node.sh\` (or \`nvm use\`) in your terminal to switch this shell."
fi
