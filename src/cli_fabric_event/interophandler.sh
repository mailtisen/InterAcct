#!/bin/bash

req="$1"
reqstage="$2"
invokee="$3"
relayarg="$4"
invokeechaincode="$5"

request_id=$(jq -r '.Request_Id' "$req")
source_network=$(jq -r '.SourceNetwork' "$req")
destination_network=$(jq -r '.DestinationNetwork' "$req")
endorsement=$(jq -r '.EndorsedByDestination' "$req")
object_requested=$(jq -r '.RequestedObject' "$req")
encrypted_payload=$(jq -r '.EncryptedPayload' "$req")

if [[ -z "$request_id" || -z "$source_network" || -z "$destination_network" || -z "$endorsement" || -z "$object_requested" || -z "$encrypted_payload" ]]; then
    echo "error: missing required fields in req"
    exit 1
fi

$invokee chaincode invoke mychannel "$invokeechaincode" CreateAndReturnKey \
"[\"param\", \"Request_Id=$request_id, SourceNetwork=$source_network, DestinationNetwork=$destination_network, EndorsedByDestination=$endorsement, Requested Object=$object_requested, EncryptedPayload=$encrypted_payload\"]" \
--local-network=network1

sleep 5

response=$($invokee interop --local-network=network2 --requesting-org=Org1MSP \
"$relayarg"/network1/mychannel:"$invokeechaincode":Read:param)

echo "$response" | jq '.' > "$reqstage"

echo "response saved to $reqstage"
