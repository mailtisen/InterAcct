package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing the ledger
type SmartContract struct {
	contractapi.Contract
}

// RequestDetails represents the structure of the data to be saved
type RequestDetails struct {
	RequestID            string `json:"requestID"`
	RequesterName        string `json:"requesterName"`
	OrganizationName     string `json:"organizationName"`
	SourceNetworkID      string `json:"sourceNetworkID"`
	DestinationNetworkID string `json:"destinationNetworkID"`
	Role                 string `json:"role"`
	RequestType          string `json:"requestType"`
	Signed               string `json:"signed"`
	AccessGranted        string `json:"accessGranted"`
}

// SaveRequestDetails saves the request details to the ledger
func (s *SmartContract) SaveRequestDetails(ctx contractapi.TransactionContextInterface, requestJson string) (string, error) {
	// Print statement to indicate the function is invoked
	//fmt.Println("Inside : SaveRequestDetails")

	// Unmarshal the JSON input to a RequestDetails struct
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	// Print the details being saved
	//fmt.Println("Saving request details in chaincode:", request)

	// Use the request ID as the key for simplicity
	requestID := request.RequestID

	// Save the request details to the ledger using the request ID as the key
	requestDetails, _ := json.Marshal(request)

	err = ctx.GetStub().PutState(requestID, requestDetails)
	if err != nil {
		return "", fmt.Errorf("failed to save request details: %s", err.Error())
	}

	// Print confirmation that the data has been saved
	//fmt.Println("Request details successfully saved in the ledger with Request ID:", requestID)

	// Return a success message
	return fmt.Sprintf("Request ID %s has been successfully saved.", requestID), nil
}

func (s *SmartContract) CheckAccess(ctx contractapi.TransactionContextInterface, requestJson string) (bool, error) {
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	if request.Role == "Director" && request.RequestType == "Organization Request" && request.Signed == "yes" {
		return true, nil
	}

	if request.Role == "Directors of Organizations" && request.RequestType == "Joint Organization Request" && request.Signed == "yes" {
		return true, nil
	}

	if request.Role == "Employee" && request.RequestType == "Individual Request" && request.Signed == "yes" {
		return true, nil
	}

	return false, nil
}

func (s *SmartContract) extractAccessReuest(ctx contractapi.TransactionContextInterface, requestID string) ([]*RequestDetails, error) {
	var results []*RequestDetails

	if requestID != "" {
		requestAsBytes, err := ctx.GetStub().GetState(requestID)
		if err != nil {
			return nil, fmt.Errorf("failed to read from world state: %s", err.Error())
		}
		if requestAsBytes == nil {
			return nil, fmt.Errorf("request %s does not exist", requestID)
		}

		var request RequestDetails
		err = json.Unmarshal(requestAsBytes, &request)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal JSON: %s", err.Error())
		}
		results = append(results, &request)
	} else {
		// Get all access requests
		iterator, err := ctx.GetStub().GetStateByRange("", "")
		if err != nil {
			return nil, fmt.Errorf("failed to get state by range: %s", err.Error())
		}
		defer iterator.Close()

		for iterator.HasNext() {
			queryResponse, err := iterator.Next()
			if err != nil {
				return nil, err
			}

			var request RequestDetails
			err = json.Unmarshal(queryResponse.Value, &request)
			if err != nil {
				return nil, err
			}
			results = append(results, &request)
		}
	}

	return results, nil
}
func (s *SmartContract) consortiumACLValidation(ctx contractapi.TransactionContextInterface, requestJson string) (bool, error) {
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	if request.RequestType == "Organization Request" && request.Role == "Director" && request.Signed == "yes" {
		return true, nil
	}

	if request.RequestType == "Joint Organization Request" && request.Role == "Directors of Organizations" && request.Signed == "yes" {
		if len(request.Organizations) > 1 {
			for _, org := range request.Organizations {
				if !request.HasEndorsement(org) {
					return false, nil
				}
			}
			return true, nil
		}
	}

	if request.RequestType == "Individual Request" && request.Role == "Employee" && request.Signed == "yes" {
		return true, nil
	}

	return false, nil
}
func (s *SmartContract) SaveRequest(ctx contractapi.TransactionContextInterface, requestJson string) (string, error) {
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	hash := sha256.Sum256([]byte(request.SgValue))
	hashHex := hex.EncodeToString(hash[:])
	combined := request.Actor + "||" + hashHex
	combinedKey := request.RequestID + "_sgn"

	err = ctx.GetStub().PutState(combinedKey, []byte(combined))
	if err != nil {
		return "", fmt.Errorf("failed to save signature hash: %s", err.Error())
	}

	requestBytes, _ := json.Marshal(request)
	err = ctx.GetStub().PutState(request.RequestID, requestBytes)
	if err != nil {
		return "", fmt.Errorf("failed to save request details: %s", err.Error())
	}

	return fmt.Sprintf("Request ID %s and actor signature been successfully saved.", request.RequestID), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %s", err.Error())
	}
}
