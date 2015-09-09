#!/bin/bash
cd ../

git stash

git checkout sandbox_sync_conversion

git pull origin sandbox_sync_conversion

ant create-target

appcfg.sh -A agilecrmbeta -V async update ../target/agile-java-server/agile-frontend.war/

rm WebContent/jscore/min/flatfull/js-all-min.js

git stash

git checkout agile-beta-development
