#!/usr/bin/env bash

stage=$1

ANSIBLE_HOST_DEVELOP=18.198.218.11
ANSIBLE_USER=ubuntu
#target=develop
docker_compose_version="v2.2.3"
version_python_interpreter=3
services_for_build="auth marketplace cards-cli jackpot"
img_name_for_build=registry.git.sfxdx.ru/poker-dapp/poker-marketplace-backend
project_name=poker-marketplace-backend
target=develop

##################################################
###
###            Case jobs
###
###################################################
case $stage in
prepare)
    ansible-playbook -i ci_cd/ansible/inventory/hosts-develop.yml ci_cd/ansible/deploy.yml -l $target \
    -e ansible_user="$ANSIBLE_USER" \
    -e ansible_host="$ANSIBLE_HOST_DEVELOP" \
    -e docker_compose_version="$docker_compose_version" \
    -e version_python_interpreter="$version_python_interpreter"
    ;;

build)
    docker build -f ci_cd/backend.Dockerfile . -t $img_name_for_build:$target \
    --build-arg SERVICES="$services_for_build"
    ;;
compose)
    echo "job compose"
    ansible-playbook -i ci_cd/ansible/inventory/hosts-develop.yml ci_cd/ansible/deploy.yml -l $target\
    -e "services_for_build='$services_for_build'" \
    -e "project_name='$project_name'" \
    -e "target='$target'" \
    -e "img_name_for_build='$img_name_for_build'"
    ;;

*)
    echo "prepare or build or compose"
    ;;
esac
exit 0
