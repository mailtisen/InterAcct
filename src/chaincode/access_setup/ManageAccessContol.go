package main

import (
	"embed"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// embed json
var aclFile embed.FS

type Rule struct {
	Role        string `json:"role"`
	RequestType string `json:"requestType"`
	Condition   string `json:"condition"`
	Allowed     bool   `json:"allowed"`
}

type ACL struct {
	Rules []Rule `json:"rules"`
}

type SmartContract struct {
	contractapi.Contract
}

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

func (s *SmartContract) CheckUserRole(ctx contractapi.TransactionContextInterface) (string, error) {
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("role")
	if err != nil || !found {
		return "", fmt.Errorf("user does not have a role assigned")
	}
	return role, nil
}

func (s *SmartContract) CheckRequestRole(ctx contractapi.TransactionContextInterface, requestJson string) (string, error) {
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}
	if request.Role == "" {
		return "", fmt.Errorf("role is missing in request JSON")
	}
	return request.Role, nil
}

func (s *SmartContract) CheckAccess(ctx contractapi.TransactionContextInterface, role, requestType, condition string) (bool, error) {
	fileData, err := aclFile.ReadFile("acl.json")
	if err != nil {
		return false, fmt.Errorf("failed to read ACL file: %w", err)
	}

	var acl ACL
	err = json.Unmarshal(fileData, &acl)
	if err != nil {
		return false, fmt.Errorf("failed to handle ACL file: %w", err)
	}

	for _, rule := range acl.Rules {
		if rule.Role == role && rule.RequestType == requestType && rule.Condition == condition {
			return rule.Allowed, nil
		}
	}

	return false, fmt.Errorf("access rule not found for role: %s, request type: %s, condition: %s", role, requestType, condition)
}

func (s *SmartContract) ValidateAccess(ctx contractapi.TransactionContextInterface, requestJson string) (bool, error) {
	userRole, err := s.CheckUserRole(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to retrieve user role: %s", err.Error())
	}

	requestRole, err := s.CheckRequestRole(ctx, requestJson)
	if err != nil {
		return false, fmt.Errorf("failed to retrieve request role: %s", err.Error())
	}

	var request RequestDetails
	err = json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return false, fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	roleToCheck := userRole
	if requestRole != "" {
		roleToCheck = requestRole
	}

	allowed, err := s.CheckAccess(ctx, roleToCheck, request.RequestType, request.Signed)
	if err != nil {
		return false, err
	}

	return allowed, nil
}

func (s *SmartContract) SaveRequestDetails(ctx contractapi.TransactionContextInterface, requestJson string) (string, error) {
	var request RequestDetails
	err := json.Unmarshal([]byte(requestJson), &request)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal request JSON: %s", err.Error())
	}

	requestID := request.RequestID
	requestDetails, _ := json.Marshal(request)

	err = ctx.GetStub().PutState(requestID, requestDetails)
	if err != nil {
		return "", fmt.Errorf("failed to save request details: %s", err.Error())
	}

	return fmt.Sprintf("Request ID %s has been successfully saved.", requestID), nil
}

func (s *SmartContract) extractAccessRequest(ctx contractapi.TransactionContextInterface, requestID string) ([]*RequestDetails, error) {
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
