export const CORE_FACET_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "GroupCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "GroupModified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "groupId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "engageScore",
        "type": "uint256"
      }
    ],
    "name": "QuestComplete",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "groupId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "engagePoints",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct LibCoreFacet.QuestData",
        "name": "questData",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "QuestCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "groupId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "engagePoints",
            "type": "uint256"
          }
        ],
        "internalType": "struct LibCoreFacet.QuestData",
        "name": "_questData",
        "type": "tuple"
      }
    ],
    "name": "addQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_questId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      }
    ],
    "name": "completeQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "name",
        "type": "bytes32"
      }
    ],
    "name": "createGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_groupId",
        "type": "uint256"
      }
    ],
    "name": "getGroup",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "internalType": "struct LibCoreFacet.GroupData",
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
        "internalType": "uint256",
        "name": "_questId",
        "type": "uint256"
      }
    ],
    "name": "getQuest",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "name",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "groupId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "engagePoints",
            "type": "uint256"
          }
        ],
        "internalType": "struct LibCoreFacet.QuestData",
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
        "internalType": "uint256",
        "name": "_groupId",
        "type": "uint256"
      }
    ],
    "name": "getUserEngagePoint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_groupId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_newName",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "modifyGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
  export const BADGE_FACET_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_validatorAddr",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256[3]",
              "name": "requiredQuests",
              "type": "uint256[3]"
            },
            {
              "internalType": "uint256",
              "name": "engagePointsThreshold",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "badgePrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "NFT",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "groupId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "schemaHash",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct LibBadgeFacet.BadgeData",
          "name": "badgeData",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "BadgeClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256[3]",
              "name": "requiredQuests",
              "type": "uint256[3]"
            },
            {
              "internalType": "uint256",
              "name": "engagePointsThreshold",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "badgePrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "NFT",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "groupId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "schemaHash",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct LibBadgeFacet.BadgeData",
          "name": "badgeData",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "nftSymbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "nftInitBaseURI",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "BadgeCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256[3]",
              "name": "requiredQuests",
              "type": "uint256[3]"
            },
            {
              "internalType": "uint256",
              "name": "engagePointsThreshold",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "badgePrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "NFT",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "groupId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "schemaHash",
              "type": "uint256"
            }
          ],
          "internalType": "struct LibBadgeFacet.BadgeData",
          "name": "_badgeData",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "_nftSymbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_nftInitBaseURI",
          "type": "string"
        }
      ],
      "name": "addBadge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressToId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_badgeId",
          "type": "uint256"
        }
      ],
      "name": "getBadge",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256[3]",
              "name": "requiredQuests",
              "type": "uint256[3]"
            },
            {
              "internalType": "uint256",
              "name": "engagePointsThreshold",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "badgePrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "NFT",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "groupId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "schemaHash",
              "type": "uint256"
            }
          ],
          "internalType": "struct LibBadgeFacet.BadgeData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSupportedRequests",
      "outputs": [
        {
          "internalType": "uint64[]",
          "name": "arr",
          "type": "uint64[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "requestId",
          "type": "uint64"
        }
      ],
      "name": "getZKPRequest",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "schema",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "slotIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "operator",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "value",
              "type": "uint256[]"
            },
            {
              "internalType": "string",
              "name": "circuitId",
              "type": "string"
            }
          ],
          "internalType": "struct ICircuitValidator.CircuitQuery",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "idToAddress",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_groupId",
          "type": "uint256"
        }
      ],
      "name": "isMemberOfGroup",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
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
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "proofs",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "requestQueries",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "schema",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slotIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "operator",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "circuitId",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "requestValidators",
      "outputs": [
        {
          "internalType": "contract ICircuitValidator",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_validator",
          "type": "address"
        }
      ],
      "name": "setValidator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "requestId",
          "type": "uint64"
        },
        {
          "internalType": "uint256[]",
          "name": "inputs",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[2]",
          "name": "a",
          "type": "uint256[2]"
        },
        {
          "internalType": "uint256[2][2]",
          "name": "b",
          "type": "uint256[2][2]"
        },
        {
          "internalType": "uint256[2]",
          "name": "c",
          "type": "uint256[2]"
        }
      ],
      "name": "submitZKPResponse",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "supportedRequests",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]