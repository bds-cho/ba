#!/bin/bash

# CHECK IF EXACTLY ONE ARG IS PASSED
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <file_to_exclude>"
    exit 1
fi

# CHECK IF RESET
if [ "$1" = "reset" ]; then
    for file in *.tf.bak; do
        mv "$file" "${file%.bak}"
    done
    exit 0
fi

# EXCLUDE FILES BY RENAMING
for file in $(find . -maxdepth 1 -type f -name "*.tf" | grep -v -e 'main.tf' -e "$1"); do
    mv "$file" "${file}.bak"
done

# DEPLOY
terraform apply
