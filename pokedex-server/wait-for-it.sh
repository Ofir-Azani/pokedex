#!/usr/bin/env bash
# wait-for-it.sh — wait until a host:port is reachable

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  echo "⏳ Waiting for $host:$port..."
  sleep 1
done

echo "✅ $host:$port is available — starting app"
exec $cmd