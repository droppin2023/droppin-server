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
          "internalType": "uint256",
          "name": "_badgeId",
          "type": "uint256"
        }
      ],
      "name": "claimBadge",
      "outputs": [],
      "stateMutability": "payable",
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
    }
  ]