
# InterAcct
It proposes an access control protocol for blockcahin interoperations

## Our Environment Setup

- **Processor:** Intel i5 CPU  
- **Memory:** 8 GB RAM  
- **Operating System:** Ubuntu 20.04 LTS (64-bit)
- **VM:** Oracle Virtual Box

## Main Software Pre-requisites
- **Install Docker (24.0.7) :** Please refer https://docs.docker.com/engine/install/
- **Install Hyperledger Fabric Samples (2.4.9) :** Please refer https://hyperledger-fabric.readthedocs.io/en/latest/install.html
- **Install Hyperledger Cacti :** Please refer https://hyperledger-cacti.github.io/cacti/weaver/getting-started/guide/  
- **Install Go Language (1.19.6):** Please refer https://go.dev/dl/ 
- **Install Node JS (16.20.0):** Please refer https://nodejs.org/en
- **Install Protobuf-compiler (3.15.6):** Please refer https://github.com/protocolbuffers/protobuf/releases/

   


# Core Contracts and Related Functionalities

| Functions| Description | Folder Path |
|---------------------|-------------|------------|
| **ManageAccessContol**  | The underlyinng chaincode creates and manages acl and verifying access  |`src/chaincode/access_setup/ManageAccessContol.go` |
| **SubmitAccessRequest**   | Handles acess request creation, and saving of request details. | `src/chaincode/access_contol/SubmitAccessRequest.go` |
| **ManageInteropRequest**   | Extracts and Fetches acess request attributes from the interoperation payload| `src/chaincode/manage_interop_request/manage_interop_request_chaincode.go` |
| **CheckAccessResponder**   | Checks access valdation at destination | `src/chaincode/check_access_policy_dest/CheckaccessResponder.go` |
| **SaveRequestPDC**   | Saving requestlist into private PDC store. | `src/chaincode/pdc_chaincode/saveRequestPDC.go` |
| **VerifySignature** | Enables verification of ECDSA signatures for different entities | `app/handle-signature-app/server.js` |
