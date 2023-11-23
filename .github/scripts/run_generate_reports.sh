#!/bin/bash
#
# Generate the reports for the standards validator

echo "Running generate reports script"
echo "Current working directory: $(pwd)"
echo "Contents of current working directory: $(ls -a)"
node ./index.js
echo "Finished running generate reports script"

