#!/bin/bash
#
# Generate the reports for the standards validator

echo "Running generate reports script"
echo "Current working directory: $(pwd)"
echo "Contents of current working directory: $(ls -a)"
echo "Creating report folder in case it does not exist"
mkdir -p ./report
node ./index.js
echo "Contents of the report folder: $(ls ./report)"
echo "Finished running generate reports script"

