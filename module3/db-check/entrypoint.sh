#!/bin/bash
RETRIES=${RETRIES:-30}
CHECK=${CHECK:-node main.js}

wait_for_pgsql() {
  retries=$RETRIES
  until $CHECK >/dev/null 2>&1 || [ "$retries" -eq "0" ]; do
    >&2 echo "DB is unavailable - sleeping..."
    sleep 1
    retries=$((retries-1))
  done
  if [ "$retries" -eq "0" ]; then
    >&2 echo "Unable to connect to database in $RETRIES retries. Giving up."
    exit 2
  fi
  >&2 echo "DB is up - executing command."
}

wait_for_pgsql

exec "$@"
