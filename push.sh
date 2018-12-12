#!/usr/bin/env bash

GIT_SHA=$(git rev-parse --short HEAD)
REMOTE_TAG="rozrywki2018/payments_api:${GIT_SHA}"

docker tag "payments_api:${GIT_SHA}" "${REMOTE_TAG}"

docker push "${REMOTE_TAG}"