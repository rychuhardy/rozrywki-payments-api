#!/usr/bin/env bash

GIT_SHA="$(git rev-parse --short HEAD)"

docker build . -t payments_api:latest
docker tag payments_api:latest "payments_api:${GIT_SHA}"