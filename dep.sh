#!/bin/bash
yarn build
rm -rf ../orangecat.github.io/*
cp -R build/* ../orangecat.github.io
cd ../orangecat.github.io
git add .
git commit -m "update"
git push
