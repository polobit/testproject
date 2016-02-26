#!/bin/bash
cd ../

git stash

chmod u+x ./../deploy-beta.sh
./../deploy-beta.sh agile-frontend async

# git checkout sandbox_sync_conversion

# git pull origin sandbox_sync_conversion

# ant create-target

# appcfg.sh -A agilecrmbeta -V newui update ../target/agile-java-server/agile-frontend.war/

rm WebContent/jscore/min/flatfull/js-all-min.js

git stash

git checkout sandbox_beta
