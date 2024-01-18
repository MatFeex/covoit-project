#!/bin/bash
rm -r covoit-project
git clone -b dev https://github.com/MatFeex/covoit-project.git
docker compose up -d --no-deps --build backend