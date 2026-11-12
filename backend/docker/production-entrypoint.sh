#!/bin/sh
set -eu
if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY deve ser fornecida pelo ambiente de produção." >&2
    exit 1
fi
exec "$@"
