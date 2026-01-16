#!/bin/bash

docker desktop start
docker container start url-shortener-db
docker attach url-shortener-db