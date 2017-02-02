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

git checkout .

git stash

git checkout agile_production_1_4

git pull origin agile_production_1_4

ant create-target  -DRELEASE_VERSION=$2 -DPRODUCTION=true;

echo "deploying in version $2"

appcfg.sh --oauth2 -A agile-crm-cloud -V $2 --enable_jar_classes update $PROJECT_TARGET_LOCATION/agile-java-server/"$1".war/

notify-send "Version Update Notification" "Verstion Updation Completed"

#cd ../
