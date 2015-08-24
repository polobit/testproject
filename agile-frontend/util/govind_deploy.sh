#!/bin/bash
cd ../

git stash

git checkout govind_agile_merged_sandbox

git pull origin govind_agile_merged_sandbox

ant create-target

appcfg.sh -A agilecrmbeta -V newui update ../target/agile-java-server/agile-frontend.war/

rm WebContent/jscore/min/flatfull/js-all-min.js

git stash

git checkout development_modules
