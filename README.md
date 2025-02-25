
# InterAcct
Interoperable Access Control

It proposes an access control protocol for blockcahin interoperations

# InterAcct - Blockchain Smart Contracts

## 📜 Smart Contracts Overview
This repository contains smart contracts for **InterAcct**, a blockchain-based interoperability solution.

### 🏗 Smart Contract Structure

| Smart Contract Name | Description | Folder Path |
|---------------------|-------------|------------|
| **ManageAccessContol**  | This chaincode creates and manages acl and verifying access  |
`src/chaincode/access_setup/ManageAccessContol.go` |
| **AssetContract**   | Handles asset creation, transfer, and ownership history tracking. | `chaincode/person_asset_chaincode/` |
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

