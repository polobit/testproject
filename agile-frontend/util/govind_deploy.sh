#!/bin/bash
cd ../

git stash

git checkout govind_agile

git pull origin govind_agile

ant create-target

appcfg.sh -A agilecrmbeta -V newui update ../target/agile-java-server/agile-frontend.war/

git checkout development_modules
