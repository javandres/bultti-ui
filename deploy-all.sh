#!/bin/bash
set -e

# Builds and deploys all images for the Azure environments

ORG=${ORG:-hsl}

for TAG in dev stage production; do
  DOCKER_IMAGE=bulttiregistry.azurecr.io/$ORG/bultti-ui:${TAG}

  docker build -t $DOCKER_IMAGE .
  docker push $DOCKER_IMAGE
done
