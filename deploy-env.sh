#!/bin/bash
set -e

PS3='Select an environment: '
option_labels=("Local" "Development" "Staging" "Production" "Prod" "Old")
select opt in "${option_labels[@]}"; do
  case $opt in
  "Local")
    echo "You chose Local"
    ENV=local
    break
    ;;
  "Development")
    echo "You chose Development"
    ENV=dev
    break
    ;;
  "Staging")
    echo "You chose Staging"
    ENV=stage
    break
    ;;
  "Production")
    echo "You chose Production"
    ENV=production
    break
    ;;
  "Prod")
    echo "You chose Prod"
    ENV=prod
    break
    ;;
  "Old")
    echo "You chose Old"
    ENV=old
    break
    ;;
  *)
    ENV=production
    break
    ;;
  esac
done

echo "Building for the $opt ($ENV) environment..."

ORG=${ORG:-hsl}
DOCKER_IMAGE=bulttiregistry.azurecr.io/${ORG}/bultti-ui:${ENV}

docker build -t ${DOCKER_IMAGE} .
docker push ${DOCKER_IMAGE}
