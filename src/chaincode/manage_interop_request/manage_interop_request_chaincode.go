package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type InteropRequest struct {
	RequesterName        string `json:"requester_name"`
	RequestType          string `json:"request_type"`
	SourceNetworkID      string `json:"source_network_id"`
	ObjectRequested      string `json:"object_requested"`
	RequesterApproved    string `json:"requester_approved"`
	Signed               string `json:"signed"`
	DestinationNetworkID string `json:"destination_network_id"`
	RequestID            string `json:"request_id"`
}

type AccessRequest struct {
	RequestID           string            `json:"request_id"`
	SourceConsortium    string            `json:"source_consortium"`
	SourceOrganizations []string          `json:"source_organizations"`
	Endorsements        map[string]string `json:"endorsements"`
	RequestPayload      string            `json:"request_payload"`
	Status              string            `json:"status"`
}

// save request details
func (s *SmartContract) SaveDetails(ctx contractapi.TransactionContextInterface, requesterName string, requestType string, sourceNetworkID string, objectRequested string, requesterApproved string, signed string, destinationNetworkID string, requestID string) error {
	request := InteropRequest{
		RequesterName:        requesterName,
		RequestType:          requestType,
		SourceNetworkID:      sourceNetworkID,
		ObjectRequested:      objectRequested,
		RequesterApproved:    requesterApproved,
		Signed:               signed,
		DestinationNetworkID: destinationNetworkID,
		RequestID:            requestID,
	}

	requestAsBytes, _ := json.Marshal(request)
	return ctx.GetStub().PutState(requestID, requestAsBytes)
}

func (s *SmartContract) extractAccessRequest(ctx contractapi.TransactionContextInterface) ([]*InteropRequest, error) {
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

func (s *SmartContract) SubmitAccessRequest(ctx contractapi.TransactionContextInterface, requestID string, sourceConsortium string, orgs []string, endorsements map[string]string, requestPayload string) error {
	request := AccessRequest{
		RequestID:           requestID,
		SourceConsortium:    sourceConsortium,
		SourceOrganizations: orgs,
		Endorsements:        endorsements,
		RequestPayload:      requestPayload,
		Status:              "PENDING",
	}

	if !s.ValidateConsensusProof(ctx, sourceConsortium, endorsements) {
		return fmt.Errorf("consensus proof verification failed for request: %s", requestID)
	}

	requestBytes, _ := json.Marshal(request)
	err := ctx.GetStub().PutState(requestID, requestBytes)
	if err != nil {
		return fmt.Errorf("Failed to store access request: %v", err)
	}

	return nil
}

func (s *SmartContract) ValidateConsensusProof(ctx contractapi.TransactionContextInterface, sourceConsortium string, endorsements map[string]string) bool {
	policyKey := "EndorsementPolicy_" + sourceConsortium
	policyBytes, err := ctx.GetStub().GetState(policyKey)
	if err != nil || policyBytes == nil {
		return false
	}

	var policy map[string]int
	json.Unmarshal(policyBytes, &policy)

	requiredEndorsements, exists := policy["requiredEndorsements"]
	if !exists || len(endorsements) < requiredEndorsements {
		return false
	}

	return true
}

func (s *SmartContract) EvaluateAccessRequest(ctx contractapi.TransactionContextInterface, requestID string) (string, error) {
	requestBytes, err := ctx.GetStub().GetState(requestID)
	if err != nil || requestBytes == nil {
		return "", fmt.Errorf("Request not found: %s", requestID)
	}

	var request AccessRequest
	json.Unmarshal(requestBytes, &request)

	aclKey := "CrossConsortiumACL"
	aclBytes, err := ctx.GetStub().GetState(aclKey)
	if err != nil || aclBytes == nil {
		return "", fmt.Errorf("No cross-consortium ACL policy found")
	}

	var aclPolicy map[string]string
	json.Unmarshal(aclBytes, &aclPolicy)

	approvalRule, exists := aclPolicy[request.SourceConsortium]
	if !exists {
		return "", fmt.Errorf("No ACL rule found for source consortium: %s", request.SourceConsortium)
	}

	if !evaluateBooleanExpression(approvalRule, request.Endorsements) {
		return "REJECTED", nil
	}

	request.Status = "APPROVED"
	updatedBytes, _ := json.Marshal(request)
	ctx.GetStub().PutState(requestID, updatedBytes)

	return "APPROVED", nil
}

func evaluateBooleanExpression(expression string, endorsements map[string]string) bool {
	boolResults := []bool{}
	tokens := strings.Split(expression, " ")

	for _, token := range tokens {
		switch token {
		case "AND":
			if len(boolResults) < 2 {
				return false
			}
			a, b := boolResults[len(boolResults)-2], boolResults[len(boolResults)-1]
			boolResults = boolResults[:len(boolResults)-2]
			boolResults = append(boolResults, a && b)
		case "OR":
			if len(boolResults) < 2 {
				return false
			}
			a, b := boolResults[len(boolResults)-2], boolResults[len(boolResults)-1]
			boolResults = boolResults[:len(boolResults)-2]
			boolResults = append(boolResults, a || b)
		default:
			_, endorsed := endorsements[token]
			boolResults = append(boolResults, endorsed)
		}
	}

	return len(boolResults) == 1 && boolResults[0]
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
