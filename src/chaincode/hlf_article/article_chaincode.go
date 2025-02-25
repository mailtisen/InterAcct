package main

import (
    "encoding/json"
    "fmt"
    "log"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ArticleContract struct {
    contractapi.Contract
}

type Article struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    URL   string `json:"url"`
    Type  string `json:"type"`
}

func (c *ArticleContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    return nil
}

func (c *ArticleContract) CreateArticle(ctx contractapi.TransactionContextInterface, id string, name string, url string, articleType string) error {
    article := Article{
        ID:    id,
        Name:  name,
        URL:   url,
        Type:  articleType,
    }

    articleJSON, err := json.Marshal(article)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, articleJSON)
}

func (c *ArticleContract) ReadArticle(ctx contractapi.TransactionContextInterface, id string) (*Article, error) {
    articleJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, err
    }
    if articleJSON == nil {
        return nil, fmt.Errorf("Article %s does not exist", id)
    }

    var article Article
    err = json.Unmarshal(articleJSON, &article)
    if err != nil {
        return nil, err
    }

    return &article, nil
}

func (c *ArticleContract) QueryAllArticles(ctx contractapi.TransactionContextInterface) ([]*Article, error) {
    startKey := ""
    endKey := ""

    iterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)
    if err != nil {
        return nil, err
    }
    defer iterator.Close()

    var articles []*Article
    for iterator.HasNext() {
        queryResponse, err := iterator.Next()
        if err != nil {
            return nil, err
        }

        var article Article
        err = json.Unmarshal(queryResponse.Value, &article)
        if err != nil {
            return nil, err
        }
        articles = append(articles, &article)
    }

    return articles, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(new(ArticleContract))
    if err != nil {
        log.Panicf("Error creating article chaincode: %v", err)
    }

    if err := chaincode.Start(); err != nil {
        log.Panicf("Error starting article chaincode: %v", err)
    }
}

