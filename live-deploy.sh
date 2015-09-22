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

git checkout sandbox_flatfull_modules

git pull origin sandbox_flatfull_modules

ant create-target  -DRELEASE_VERSION=$2 -DPRODUCTION=true;

#appcfg.sh -A agile-crm-cloud -V "async" update target/agile-java-server/"$1".war/

#cd ../