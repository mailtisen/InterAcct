package main

import (
	"embed"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// embed json
var aclFile embed.FS

// access control struct
type Rule struct {
	Role        string `json:"role"`
	RequestType string `json:"requestType"`
	Condition   string `json:"condition"`
	Allowed     bool   `json:"allowed"`
}

// ACL access control rules
type ACL struct {
	Rules []Rule `json:"rules"`
}

type SmartContract struct {
	contractapi.Contract
}

// CheckAccess checks if the specified role, request type, and condition are allowed according to the ACL
func (s *SmartContract) CheckAccess(ctx contractapi.TransactionContextInterface, role, requestType, condition string) (bool, error) {
	// Read the ACL from the embedded file
	fileData, err := aclFile.ReadFile("acl.json")
	if err != nil {
		return false, fmt.Errorf("failed to read ACL file: %w", err)
	}

	var acl ACL

	// Parse the JSON data into the ACL object
	err = json.Unmarshal(fileData, &acl)
	if err != nil {
		return false, fmt.Errorf("failed to handle ACL file: %w", err)
	}

	// Check access based on rules
	for _, rule := range acl.Rules {
		if rule.Role == role && rule.RequestType == requestType && rule.Condition == condition {
			return rule.Allowed, nil
		}
	}

	return false, fmt.Errorf("access rule not found for role: %s, request type: %s, condition: %s", role, requestType, condition)
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
