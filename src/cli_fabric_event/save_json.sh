#!/bin/bash

# File containing the command output
OUTPUT_FILE="outputs.txt"

# JSON output file
JSON_FILE="outputs.json"

# Extract the relevant portion of the output
grep "Result from network query:" "$OUTPUT_FILE" | \
sed -n 's/.*Result from network query: Request_Id=\(.*\), SourceNetwork=\(.*\), DestinationNetwork=\(.*\), EndorsedBySource=\(.*\), Requested Object=\(.*\)$/{"Request_ID":"\1","SourceNetwork":"\2","DestinationNetwork":"\3","EndorsedBySource":"\4","RequestedObject":"\5"}/p' > "$JSON_FILE"

echo "Saved output to $JSON_FILE"
