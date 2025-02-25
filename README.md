
# InterAcct
Interoperable Access Control

It proposes an access control protocol for blockcahin interoperations

# InterAcct - Blockchain Smart Contracts

## 📜 Smart Contracts Overview
This repository contains smart contracts for **InterAcct**, a blockchain-based interoperability solution.

### 🏗 Smart Contract Structure

| Core Functions| Description | Folder Path |
|---------------------|-------------|------------|
| **ManageAccessContol**  | The underlyinng chaincode creates and manages acl and verifying access  |`src/chaincode/access_setup/ManageAccessContol.go` |
| **SubmitAccessRequest**   | Handles acess request creation, and saving of request details. | `src/chaincode/access_contol/SubmitAccessRequest.go` |
| **RedactionContract** | Enables controlled redaction using Chameleon Hashes. | `chaincode/person_asset_chaincode/` |

### 📂 Folder Paths

- **Backend API (Node.js)**: `employee-asset-redact/`
- **Smart Contracts (Chaincode - GoLang)**: `chaincode/person_asset_chaincode/`
- **Hyperledger Fabric Network Setup**: `fabric_network/fabric-samples/`
- **Interoperability Layer (Cacti)**: `src/cacti/`

---

### **Step 3: Save the File and Exit**
If using **nano**, press:
- `CTRL + X` → `Y` → `Enter` to save and exit.

---

### **Step 4: Commit and Push the Changes**
Run:

```bash
git add README.md
git commit -m "Updated README with Smart Contract details"
git push origin main

