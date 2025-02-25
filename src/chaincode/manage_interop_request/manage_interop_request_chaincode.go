package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type InteropRequest struct {
	CredExID             string `json:"cred_ex_id"`
	RequesterName        string `json:"requester_name"`
	RequestType          string `json:"request_type"`
	SourceNetworkID      string `json:"source_network_id"`
	ObjectRequested      string `json:"object_requested"`
	RequesterApproved    string `json:"requester_approved"`
	Signed               string `json:"signed"`
	DestinationNetworkID string `json:"destination_network_id"`
	RequestID            string `json:"request_id"`
	State                string `json:"state"`
	ConnectionID         string `json:"connection_id"`
}

// SaveDetails saves a new record to the ledger
func (s *SmartContract) SaveDetails(ctx contractapi.TransactionContextInterface, credExID string, requesterName string, requestType string, sourceNetworkID string, objectRequested string, requesterApproved string, signed string, destinationNetworkID string, requestID string, state string, connectionID string) error {
	request := InteropRequest{
		CredExID:             credExID,
		RequesterName:        requesterName,
		RequestType:          requestType,
		SourceNetworkID:      sourceNetworkID,
		ObjectRequested:      objectRequested,
		RequesterApproved:    requesterApproved,
		Signed:               signed,
		DestinationNetworkID: destinationNetworkID,
		RequestID:            requestID,
		State:                state,
		ConnectionID:         connectionID,
	}

	requestAsBytes, _ := json.Marshal(request)
	return ctx.GetStub().PutState(credExID, requestAsBytes)
}

// Extracts requests from the ledger
func (s *SmartContract) extractAccessReuest(ctx contractapi.TransactionContextInterface) ([]*InteropRequest, error) {
	queryString := "{\"selector\":{}}"

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []*InteropRequest
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var record InteropRequest
		err = json.Unmarshal(queryResponse.Value, &record)
		if err != nil {
			return nil, err
		}
		records = append(records, &record)
	}

	return records, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating manageinteroprequest chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting manageinteroprequest chaincode: %s", err.Error())
	}
}
