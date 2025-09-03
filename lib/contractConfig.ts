import { ethers } from "ethers";

const contractAddress = "0x3033C34AA1b345EAc587E930c777A05683636B1f"; // pick your deployed address
const abi = [
  // Placeholder for FIRSystem ABI JSON
  // This will need to be replaced with the actual ABI from compilation
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "firId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "complainant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "cid",
        "type": "string"
      }
    ],
    "name": "FIRRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "firId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "FIRStatusUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "addPoliceOfficer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "firId",
        "type": "uint256"
      }
    ],
    "name": "getFIR",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "cid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "status",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "complainant",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "assignedOfficer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct FIRSystem.FIR",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "cid",
        "type": "string"
      }
    ],
    "name": "registerFIR",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "removePoliceOfficer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "firId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newStatus",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "updateFIRStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPoliceOfficers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export function getContract(providerOrSigner: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(contractAddress, abi, providerOrSigner);
}