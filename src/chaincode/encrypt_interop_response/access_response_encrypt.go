package main

import (
        "encoding/json"
        "fmt"

        "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type AccessResponseEncryptContract struct {
        contractapi.Contract
}

type Request struct {
        RequestID     string   `json:"requestId"`
        Requesters    []string `json:"requesters"`
        IsJoint       bool     `json:"isJoint"`
        KeyShares     []string `json:"keyShares"`
        EncryptedData string   `json:"encryptedData"`
}

func (c *AccessResponseEncryptContract) SaveRequest(ctx contractapi.TransactionContextInterface, requestID string, requesters []string, isJoint bool, keyShares []string, encryptedData string) error {
        request := Request{
                RequestID:     requestID,
                Requesters:    requesters,
                IsJoint:       isJoint,
                KeyShares:     keyShares,
                EncryptedData: encryptedData,
        }

        requestJSON, err := json.Marshal(request)
        if err != nil {
                return fmt.Errorf("failed to marshal request: %v", err)
        }

        return ctx.GetStub().PutState(requestID, requestJSON)
}

func (c *AccessResponseEncryptContract) GetRequest(ctx contractapi.TransactionContextInterface, requestID string) (*Request, error) {
        requestJSON, err := ctx.GetStub().GetState(requestID)
        if err != nil {
                return nil, fmt.Errorf("failed to read request: %v", err)
        }
        if requestJSON == nil {
                return nil, fmt.Errorf("request %s not found", requestID)
        }

        var request Request
        err = json.Unmarshal(requestJSON, &request)
        if err != nil {
                return nil, fmt.Errorf("failed to unmarshal request: %v", err)
        }
        return &request, nil
}

func main() {
        chaincode, err := contractapi.NewChaincode(new(AccessResponseEncryptContract))
        if err != nil {
                fmt.Printf("Error creating chaincode: %v\n", err)
                return
        }

        if err := chaincode.Start(); err != nil {
                fmt.Printf("Error starting chaincode: %v\n", err)
        }
}
