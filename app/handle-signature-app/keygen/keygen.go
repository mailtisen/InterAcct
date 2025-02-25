package main

import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
    "encoding/hex"
    "fmt"
)

func main() {
    priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
    if err != nil {
        fmt.Println(err)
        return
    }

    pubKey := append(priv.PublicKey.X.Bytes(), priv.PublicKey.Y.Bytes()...)
    privKey := priv.D.Bytes()

    fmt.Printf("Public Key: %s\n", hex.EncodeToString(pubKey))
    fmt.Printf("Private Key: %s\n", hex.EncodeToString(privKey))
}
