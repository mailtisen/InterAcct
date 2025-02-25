
# InterAcct
It proposes an access control protocol for blockcahin interoperations

## Environment Setup

- **Processor:** Intel i5-4570 CPU  
- **Memory:** 8 GB RAM  
- **Operating System:** Ubuntu 20.04 LTS (64-bit)

## Prequisites

- **Install Hyperledger Fabric Samples :** Please refer https://hyperledger-fabric.readthedocs.io/en/latest/install.html  
  **Memory:** 8 GB RAM  
- **Operating System:** Ubuntu 20.04 LTS (64-bit)  

   


# Core Contracts and Related Functionalities

| Functions| Description | Folder Path |
|---------------------|-------------|------------|
| **ManageAccessContol**  | The underlyinng chaincode creates and manages acl and verifying access  |`src/chaincode/access_setup/ManageAccessContol.go` |
| **SubmitAccessRequest**   | Handles acess request creation, and saving of request details. | `src/chaincode/access_contol/SubmitAccessRequest.go` |
| **ManageInteropRequest**   | Extracts and Fetches acess request attributes from the interoperation payload| `src/chaincode/manage_interop_request/manage_interop_request_chaincode.go` |
| **CheckAccessResponder**   | Checks access valdation at destination | `src/chaincode/check_access_policy_dest/CheckaccessResponder.go` |
| **SaveRequestPDC**   | Saving requestlist into private PDC store. | `src/chaincode/pdc_chaincode/saveRequestPDC.go` |
| **VerifySignature** | Enables verification of ECDSA signatures for different entities | `app/handle-signature-app/server.js` |
