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

git checkout sandbox_latest_converse_new

git pull origin sandbox_latest_converse_new

ant create-target  -DRELEASE_VERSION="$2" -DPRODUCTION=false;


appcfg.sh -A agilecrmbeta -V "$2" update "$PROJECT_TARGET_LOCATION"/agile-java-server/"$1".war/

#cd ../



