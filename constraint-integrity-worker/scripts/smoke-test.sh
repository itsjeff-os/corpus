#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-http://127.0.0.1:8787}"
SESSION="demo"

curl -sS -X PUT "$BASE_URL/sessions/$SESSION/constraints" \
  -H 'content-type: application/json' \
  --data @examples/seed-constraints.json >/dev/null

echo "== Failing proposal =="
curl -sS -X POST "$BASE_URL/sessions/$SESSION/validate" \
  -H 'content-type: application/json' \
  --data @examples/failing-proposal.json

echo

echo "== Passing proposal =="
curl -sS -X POST "$BASE_URL/sessions/$SESSION/validate" \
  -H 'content-type: application/json' \
  --data @examples/passing-proposal.json

echo

echo "== Session state =="
curl -sS "$BASE_URL/sessions/$SESSION/state"
