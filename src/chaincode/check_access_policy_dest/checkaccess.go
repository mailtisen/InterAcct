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
        RequestID            string `json:"request_id"`
        RequesterName        string `json:"requester_name"`
        RequestType          string `json:"request_type"`
        SourceNetworkID      string `json:"source_network_id"`
        ObjectRequested      string `json:"object_requested"`
        RequesterApproved    string `json:"requester_approved"`
        Signed               string `json:"signed"`
        DestinationNetworkID string `json:"destination_network_id"`
        State                string `json:"state"`
}

// SaveDetails saves a new request to the ledger
func (s *SmartContract) SaveDetails(ctx contractapi.TransactionContextInterface, requestID string, requesterName string, requestType string, sourceNetworkID string, objectRequested string, requesterApproved string, signed string, destinationNetworkID string, state string) error {
        request := InteropRequest{
                RequestID:            requestID,
                RequesterName:        requesterName,
                RequestType:          requestType,
                SourceNetworkID:      sourceNetworkID,
                ObjectRequested:      objectRequested,
                RequesterApproved:    requesterApproved,
                Signed:               signed,
                DestinationNetworkID: destinationNetworkID,
                State:                state,
        }

        requestAsBytes, err := json.Marshal(request)
        if err != nil {
                return fmt.Errorf("failed to marshal request: %v", err)
        }

        return ctx.GetStub().PutState(requestID, requestAsBytes)
}

// QueryDetails retrieves a record by request ID
func (s *SmartContract) QueryDetails(ctx contractapi.TransactionContextInterface, requestID string) (*InteropRequest, error) {
        requestAsBytes, err := ctx.GetStub().GetState(requestID)
        if err != nil {
                return nil, fmt.Errorf("failed to retrieve request: %v", err)
        }
        if requestAsBytes == nil {
                return nil, fmt.Errorf("request with ID %s not found", requestID)
        }

        var request InteropRequest
        err = json.Unmarshal(requestAsBytes, &request)
        if err != nil {
                return nil, fmt.Errorf("failed to unmarshal request: %v", err)
        }

        return &request, nil
}

// CheckAccess evaluates whether access can be granted
func (s *SmartContract) CheckAccess(ctx contractapi.TransactionContextInterface, requestID string) (string, error) {
        request, err := s.QueryDetails(ctx, requestID)
        if err != nil {
                return "", err
        }

        // Check access conditions
        if request.SourceNetworkID != "N1" {
                return "Access Denied: Requester is not from Source Network N1", nil
        }
        if request.RequesterApproved != "Yes" {
                return "Access Denied: Requester has not approved the request", nil
        }
        if request.Signed == "" {
                return "Access Denied: Request has not received an endorsement", nil
        }

        return "Access Granted", nil
}

func main() {
        chaincode, err := contractapi.NewChaincode(new(SmartContract))
        if err != nil {
                fmt.Printf("Error creating checkaccess chaincode: %s", err.Error())
                return
        }

        if err := chaincode.Start(); err != nil {
                fmt.Printf("Error starting checkaccess chaincode: %s", err.Error())
        }
}
