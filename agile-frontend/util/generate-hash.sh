#!/bin/bash

# The below statement will calculate the Hash of all files in the given paths and 
# print it in a JSON object. To add new paths, just add the path followed by \ 
# in the line after the find command (second line).
# To the extent possible don't give path to file directly here, rather give the path to
# the nearest folder that is guaranteed to exist. If the file at the path specified is not present,
# this command will not work
find ../WebContent/jscore/min/flatfull/ \
../WebContent/tpl/min/flatfull/ \
../WebContent/tpl/min/precompiled/ \
../WebContent/flatfull/final-lib/min/ \
../WebContent/flatfull/css/min/ \
../WebContent/flatfull/lib/ \
../WebContent/flatfull/jscore/handlebars/ \
-type f \
| xargs md5sum \
| awk -F " |/" 'BEGIN{printf "<script type=\x27text/javascript\x27/>_AGILE_FILE_HASH={"} NR > 1 {printf ","}  {printf "\x27" $NF "\x27" ":" "\x27" $1 "\x27"} END{print "};</script>"}' \
> file-hash.json

mv file-hash.json ../WebContent/.


