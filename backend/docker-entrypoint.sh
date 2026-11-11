#!/bin/sh
set -eu

echo "Applying Prisma migrations..."
npx prisma migrate deploy

if [ "${SEED_DATABASE:-false}" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

exec node dist/main.js
