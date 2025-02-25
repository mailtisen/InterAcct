
# InterAcct
Interoperable Access Control

It proposes an access control protocol for blockcahin interoperations

### 🏗 Core Contracts and Related Functionalities

| Functions| Description | Folder Path |
|---------------------|-------------|------------|
| **ManageAccessContol**  | The underlyinng chaincode creates and manages acl and verifying access  |`src/chaincode/access_setup/ManageAccessContol.go` |
| **SubmitAccessRequest**   | Handles acess request creation, and saving of request details. | `src/chaincode/access_contol/SubmitAccessRequest.go` |
| **ManageInteropRequest**   | Extracts and Fetches acess request attributes from the interoperation payload| `src/chaincode/manage_interop_request/manage_interop_request_chaincode.go` |
| **CheckAccessResponder**   | Checks access valdation at destination | `src/chaincode/check_access_policy_dest/CheckaccessResponder.go` |
| **SaveRequestPDC**   | Saving requestlist into private PDC store. | `src/chaincode/pdc_chaincode/saveRequestPDC.go` |
| **VerifySignature** | Enables verification of ECDSA signatures for different entities | `app/handle-signature-app/server.js` |

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
<<<<<<< HEAD

=======
>>>>>>> Updated project files
