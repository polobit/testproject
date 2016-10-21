## Create a temp folder
rm -r agile-ec2-sync-temp
mkdir -p agile-ec2-sync-temp/jscore/min
mkdir -p agile-ec2-sync-temp/tpl/min/precompiled

## Copy all files with inner folders
cp -r ../WebContent/jscore/min/flatfull/ agile-ec2-sync-temp/jscore/min/
cp -r ../WebContent/jscore/min/locales/ agile-ec2-sync-temp/jscore/min/
cp -r ../WebContent/tpl/min/precompiled/flatfull/ agile-ec2-sync-temp/tpl/min/precompiled/
cp -r ../WebContent/tpl/min/precompiled/locales/ agile-ec2-sync-temp/tpl/min/precompiled/

## Make it zip
cd agile-ec2-sync-temp
zip -r sync.zip *
