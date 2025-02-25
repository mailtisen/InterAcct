package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Request defines the structure of the request details
type Request struct {
	RequestID       string   `json:"requestID"`
	RequesterName   string   `json:"requesterName"`
	PeerNodeName    string   `json:"peerNodeName"`
	EndorserNames   []string `json:"endorserNames"`
	RequestStatus   string   `json:"requestStatus"`
	Signature       string   `json:"signature"`
	OrganizationID  string   `json:"organizationID"`
	SourceNetwork   string   `json:"sourceNetwork"`
	ObjectRequested string   `json:"objectRequested"`
	TransactionID   string   `json:"transactionID"`
}

// SmartContract provides functions for managing the private data collection
type SmartContract struct {
	contractapi.Contract
}

// SaveRequest stores the request details in the private data collection
func (s *SmartContract) SaveRequest(ctx contractapi.TransactionContextInterface, requestID, requesterName, peerNodeName, requestStatus, signature, organizationID, sourceNetwork, objectRequested string, endorserNames []string) error {
	// Get transaction ID from the context
	transactionID := ctx.GetStub().GetTxID()

	// Create the request object
	request := Request{
		RequestID:       requestID,
		RequesterName:   requesterName,
		PeerNodeName:    peerNodeName,
		EndorserNames:   endorserNames,
		RequestStatus:   requestStatus,
		Signature:       signature,
		OrganizationID:  organizationID,
		SourceNetwork:   sourceNetwork,
		ObjectRequested: objectRequested,
		TransactionID:   transactionID,
	}

	// Marshal request to JSON
	requestJSON, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %v", err)
	}

	// Save data to private data collection
	err = ctx.GetStub().PutPrivateData("RequestDetailsCollection", requestID, requestJSON)
	if err != nil {
		return fmt.Errorf("failed to save request in PDC: %v", err)
	}

	return nil
}

// GetRequest retrieves request details from the private data collection
func (s *SmartContract) GetRequest(ctx contractapi.TransactionContextInterface, requestID string) (*Request, error) {
	// Retrieve private data from PDC
	requestJSON, err := ctx.GetStub().GetPrivateData("RequestDetailsCollection", requestID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve request: %v", err)
	}
	if requestJSON == nil {
		return nil, fmt.Errorf("request not found: %s", requestID)
	}

	// Unmarshal JSON into Request object
	var request Request
	err = json.Unmarshal(requestJSON, &request)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal request: %v", err)
	}

	return &request, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error setting chaincode: %v\n", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %v\n", err)
	}
}
