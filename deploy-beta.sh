#!/bin/bash


SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

echo $DIR

cd $DIR

cd "$1"

echo "$PROJECT_TARGET_LOCATION";

git checkout .

git stash

git checkout theme-1-1

git pull origin theme-1-1

# Change queue acls in beta before deploy

sed -i 's/yaswanth@agilecrm.com/naresh@faxdesk.com/g' "$PROJECT_TARGET_LOCATION"/../agile-frontend/WebContent/WEB-INF/queue.xml

ant create-target  -DRELEASE_VERSION="$2" -DPRODUCTION=false;


appcfg.sh --oauth2 -A agilecrmbeta -V "$2" update "$PROJECT_TARGET_LOCATION"/agile-java-server/"$1".war/

# Reset queue acls after deploy

sed -i 's/naresh@faxdesk.com/yaswanth@agilecrm.com/g' "$PROJECT_TARGET_LOCATION"/../agile-frontend/WebContent/WEB-INF/queue.xml

#cd ../

git checkout sandbox_pre_live_new
