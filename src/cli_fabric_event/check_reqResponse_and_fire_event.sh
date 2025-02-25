#!/bin/bash

# File paths
OUTPUT_FILE="outputs.json"
REQUESTLIST_FILE="requestlist.json"

# Extract Request_ID from output.json
REQUEST_ID=$(jq -r '.Request_ID' "$OUTPUT_FILE")

# Search requestlist.json for matching request ID
MATCH=$(jq -r --arg reqid "$REQUEST_ID" '.[] | select(.requestno == $reqid)' "$REQUESTLIST_FILE")

if [ -n "$MATCH" ]; then
  # Extract peer name and org name
  PEER_NAME=$(echo "$MATCH" | jq -r '.peername')
  ORG_NAME=$(echo "$MATCH" | jq -r '.orgname')

  # Simulate firing an event
  echo "Event Fired: Access response for Request ID $REQUEST_ID has reached. Peer: $PEER_NAME, Organization: $ORG_NAME"
else
  echo "No matching request ID $REQUEST_ID found in requestlist.json"
fi
