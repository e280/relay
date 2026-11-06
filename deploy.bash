#!/usr/bin/env bash
set -euo pipefail

cd /home/deployer/app
npm ci --omit=dev

systemctl --user restart app
systemctl --user --no-pager status app

