/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Players, PlayersInterface } from "../../contracts/Players";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "planetType",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PlanetConquer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "stepsTaken",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "StepsAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountFunded",
        type: "uint256",
      },
    ],
    name: "TreasuryFunded",
    type: "event",
  },
  {
    inputs: [],
    name: "NFTPRICE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "indexStartingPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_planetId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_shipId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_worldId",
        type: "uint256",
      },
    ],
    name: "moveShip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "players",
    outputs: [
      {
        internalType: "uint256",
        name: "playerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeJoined",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastQueried",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stepsAvailable",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalStepsTaken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountEarned",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "registerProfile",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setAaveVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "setBackendAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftContractAddress",
        type: "address",
      },
    ],
    name: "setNftAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_worldAddress",
        type: "address",
      },
    ],
    name: "setWorldAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hashedMessageBackend",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_steps",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_lastQueried",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "syncSteps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hashedMessageBackend",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_message",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_lastQueried",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "verifySteps",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002d61002261003260201b60201c565b61003a60201b60201c565b6100fe565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b61244a806200010e6000396000f3fe6080604052600436106100dd5760003560e01c80637912680d1161007f578063ba16971611610059578063ba16971614610263578063e2eb41ff1461028c578063e839665c146102ce578063f2fde38b146102ea576100dd565b80637912680d146101e45780638da5cb5b1461020d578063b93d28ee14610238576100dd565b8063240bcbfa116100bb578063240bcbfa1461015d5780633b72498a146101865780633fc90920146101b1578063715018a6146101cd576100dd565b80630b102d1a146100e25780631815ce7d1461010b5780631822b84714610134575b600080fd5b3480156100ee57600080fd5b5061010960048036038101906101049190611778565b610313565b005b34801561011757600080fd5b50610132600480360381019061012d9190611778565b6103d3565b005b34801561014057600080fd5b5061015b600480360381019061015691906117a1565b610493565b005b34801561016957600080fd5b50610184600480360381019061017f91906117a1565b610658565b005b34801561019257600080fd5b5061019b6107ba565b6040516101a89190611d86565b60405180910390f35b6101cb60048036038101906101c6919061182a565b6107c6565b005b3480156101d957600080fd5b506101e26109f5565b005b3480156101f057600080fd5b5061020b60048036038101906102069190611778565b610a7d565b005b34801561021957600080fd5b50610222610b3d565b60405161022f9190611b9f565b60405180910390f35b34801561024457600080fd5b5061024d610b66565b60405161025a9190611d86565b60405180910390f35b34801561026f57600080fd5b5061028a60048036038101906102859190611778565b610b71565b005b34801561029857600080fd5b506102b360048036038101906102ae9190611778565b610c31565b6040516102c596959493929190611e7d565b60405180910390f35b6102e860048036038101906102e391906118f9565b610c6d565b005b3480156102f657600080fd5b50610311600480360381019061030c9190611778565b610fd7565b005b61031b6110cf565b73ffffffffffffffffffffffffffffffffffffffff16610339610b3d565b73ffffffffffffffffffffffffffffffffffffffff161461038f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038690611d46565b60405180910390fd5b80600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6103db6110cf565b73ffffffffffffffffffffffffffffffffffffffff166103f9610b3d565b73ffffffffffffffffffffffffffffffffffffffff161461044f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044690611d46565b60405180910390fd5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600085856040516020016104a8929190611e1d565b604051602081830303815290604052805190602001209050868114610502576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104f990611ca6565b60405180910390fd5b60006040518060400160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250905060008189604051602001610551929190611b77565b60405160208183030381529060405280519060200120905060006001828888886040516000815260200160405260405161058e9493929190611bea565b6020604051602081039080840390855afa1580156105b0573d6000803e3d6000fd5b505050602060405103519050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461064c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064390611c66565b60405180910390fd5b50505050505050505050565b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816000015414156106e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106da90611d66565b60405180910390fd5b80600201548514610729576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161072090611d26565b60405180910390fd5b610737878787878787610493565b8581600401600082825461074b9190611f66565b92505081905550858160030160008282546107669190611f66565b925050819055504281600201819055507fea53fca5456139f39e787af7250a4c0571c46facc363f3083ec3fa7a0d65888e8633426040516107a993929190611da1565b60405180910390a150505050505050565b60028060000154905081565b6107ce6110d7565b662386f26fc100003414610817576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161080e90611ce6565b60405180910390fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db0346040518263ffffffff1660e01b81526004016000604051808303818588803b15801561088157600080fd5b505af1158015610895573d6000803e3d6000fd5b50505050506000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0def52133846040518363ffffffff1660e01b81526004016108f9929190611bba565b602060405180830381600087803b15801561091357600080fd5b505af1158015610927573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094b9190611894565b90506000806109586111bd565b91509150600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f4881477843385856040518563ffffffff1660e01b81526004016109bd9493929190611dd8565b600060405180830381600087803b1580156109d757600080fd5b505af11580156109eb573d6000803e3d6000fd5b5050505050505050565b6109fd6110cf565b73ffffffffffffffffffffffffffffffffffffffff16610a1b610b3d565b73ffffffffffffffffffffffffffffffffffffffff1614610a71576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a6890611d46565b60405180910390fd5b610a7b6000611210565b565b610a856110cf565b73ffffffffffffffffffffffffffffffffffffffff16610aa3610b3d565b73ffffffffffffffffffffffffffffffffffffffff1614610af9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610af090611d46565b60405180910390fd5b80600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b662386f26fc1000081565b610b796110cf565b73ffffffffffffffffffffffffffffffffffffffff16610b97610b3d565b73ffffffffffffffffffffffffffffffffffffffff1614610bed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610be490611d46565b60405180910390fd5b80600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60046020528060005260406000206000915090508060000154908060010154908060020154908060030154908060040154908060050154905086565b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637f7b1393856040518263ffffffff1660e01b8152600401610ccb9190611d86565b6040805180830381600087803b158015610ce457600080fd5b505af1158015610cf8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1c91906118bd565b915091506000610d2c83896112d4565b90506000610d3a83896112d4565b90506000610d688283610d4d9190611fed565b8485610d599190611fed565b610d639190611f66565b611303565b9050600a81610d779190611fed565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206003015411610dfa576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610df190611cc6565b60405180910390fd5b600a81610e079190611fed565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206003016000828254610e589190612047565b92505081905550600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f488147788338d8d6040518563ffffffff1660e01b8152600401610ec09493929190611dd8565b600060405180830381600087803b158015610eda57600080fd5b505af1158015610eee573d6000803e3d6000fd5b505050506000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166334efcb8e8a6040518263ffffffff1660e01b8152600401610f4f9190611d86565b60c06040518083038186803b158015610f6757600080fd5b505afa158015610f7b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f9f919061186b565b905080604001518b148015610fb7575080606001518a145b15610fca57610fc9816080015161137d565b5b5050505050505050505050565b610fdf6110cf565b73ffffffffffffffffffffffffffffffffffffffff16610ffd610b3d565b73ffffffffffffffffffffffffffffffffffffffff1614611053576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161104a90611d46565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156110c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110ba90611c86565b60405180910390fd5b6110cc81611210565b50565b600033905090565b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816000015414611161576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161115890611d06565b60405180910390fd5b61116b60016115da565b61117560016115f0565b816000018190555042816001018190555061a8c0426111949190612047565b816002018190555060008160030181905550600081600401819055506000816005018190555050565b6000806111ca60026115da565b60006111d660026115f0565b90506000602a826111e79190611fed565b9050600060109050602e8314156112035761120260026115fe565b5b8181945094505050509091565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008183116112ee5782826112e99190612047565b6112fb565b81836112fa9190612047565b5b905092915050565b6000600382111561136a57819050600060016002846113229190611fbc565b61132c9190611f66565b90505b818110156113645780915060028182856113499190611fbc565b6113539190611f66565b61135d9190611fbc565b905061132f565b50611378565b6000821461137757600190505b5b919050565b6001811415611583576000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663285939846040518163ffffffff1660e01b815260040160206040518083038186803b1580156113f057600080fd5b505afa158015611404573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114289190611894565b905060008111801561143e5750642e90edd00081115b1561158157600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166351cff8d9336040518263ffffffff1660e01b815260040161149e9190611b9f565b600060405180830381600087803b1580156114b857600080fd5b505af11580156114cc573d6000803e3d6000fd5b5050505080600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050160008282546115229190611f66565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe43355d49b9fa992e8c84178c0dc4a935d068936a4690cc3262dd36a393fa0de82844260405161157393929190611e46565b60405180910390a2506115d7565b505b3373ffffffffffffffffffffffffffffffffffffffff167fe43355d49b9fa992e8c84178c0dc4a935d068936a4690cc3262dd36a393fa0de600083426040516115ce93929190611c2f565b60405180910390a25b50565b6001816000016000828254019250508190555050565b600081600001549050919050565b6000816000018190555050565b600061161e61161984611f03565b611ede565b90508281526020810184848401111561163657600080fd5b6116418482856120e0565b509392505050565b600081359050611658816123b8565b92915050565b60008135905061166d816123cf565b92915050565b600082601f83011261168457600080fd5b813561169484826020860161160b565b91505092915050565b600060c082840312156116af57600080fd5b6116b960c0611ede565b905060006116c98482850161174e565b60008301525060206116dd8482850161174e565b60208301525060406116f18482850161174e565b60408301525060606117058482850161174e565b60608301525060806117198482850161174e565b60808301525060a061172d8482850161174e565b60a08301525092915050565b600081359050611748816123e6565b92915050565b60008151905061175d816123e6565b92915050565b600081359050611772816123fd565b92915050565b60006020828403121561178a57600080fd5b600061179884828501611649565b91505092915050565b60008060008060008060c087890312156117ba57600080fd5b60006117c889828a0161165e565b96505060206117d989828a01611739565b95505060406117ea89828a01611739565b94505060606117fb89828a01611763565b935050608061180c89828a0161165e565b92505060a061181d89828a0161165e565b9150509295509295509295565b60006020828403121561183c57600080fd5b600082013567ffffffffffffffff81111561185657600080fd5b61186284828501611673565b91505092915050565b600060c0828403121561187d57600080fd5b600061188b8482850161169d565b91505092915050565b6000602082840312156118a657600080fd5b60006118b48482850161174e565b91505092915050565b600080604083850312156118d057600080fd5b60006118de8582860161174e565b92505060206118ef8582860161174e565b9150509250929050565b600080600080600060a0868803121561191157600080fd5b600061191f88828901611739565b955050602061193088828901611739565b945050604061194188828901611739565b935050606061195288828901611739565b925050608061196388828901611739565b9150509295509295909350565b6119798161207b565b82525050565b6119888161208d565b82525050565b61199f61199a8261208d565b612153565b82525050565b60006119b082611f34565b6119ba8185611f4a565b93506119ca8185602086016120ef565b80840191505092915050565b6119df816120ce565b82525050565b60006119f082611f3f565b6119fa8185611f55565b9350611a0a8185602086016120ef565b611a13816121ea565b840191505092915050565b6000611a2b600c83611f55565b9150611a36826121fb565b602082019050919050565b6000611a4e602683611f55565b9150611a5982612224565b604082019050919050565b6000611a71601483611f55565b9150611a7c82612273565b602082019050919050565b6000611a94602883611f55565b9150611a9f8261229c565b604082019050919050565b6000611ab7601f83611f55565b9150611ac2826122eb565b602082019050919050565b6000611ada601583611f55565b9150611ae582612314565b602082019050919050565b6000611afd601b83611f55565b9150611b088261233d565b602082019050919050565b6000611b20602083611f55565b9150611b2b82612366565b602082019050919050565b6000611b43601983611f55565b9150611b4e8261238f565b602082019050919050565b611b62816120b7565b82525050565b611b71816120c1565b82525050565b6000611b8382856119a5565b9150611b8f828461198e565b6020820191508190509392505050565b6000602082019050611bb46000830184611970565b92915050565b6000604082019050611bcf6000830185611970565b8181036020830152611be181846119e5565b90509392505050565b6000608082019050611bff600083018761197f565b611c0c6020830186611b68565b611c19604083018561197f565b611c26606083018461197f565b95945050505050565b6000606082019050611c4460008301866119d6565b611c516020830185611b59565b611c5e6040830184611b59565b949350505050565b60006020820190508181036000830152611c7f81611a1e565b9050919050565b60006020820190508181036000830152611c9f81611a41565b9050919050565b60006020820190508181036000830152611cbf81611a64565b9050919050565b60006020820190508181036000830152611cdf81611a87565b9050919050565b60006020820190508181036000830152611cff81611aaa565b9050919050565b60006020820190508181036000830152611d1f81611acd565b9050919050565b60006020820190508181036000830152611d3f81611af0565b9050919050565b60006020820190508181036000830152611d5f81611b13565b9050919050565b60006020820190508181036000830152611d7f81611b36565b9050919050565b6000602082019050611d9b6000830184611b59565b92915050565b6000606082019050611db66000830186611b59565b611dc36020830185611970565b611dd06040830184611b59565b949350505050565b6000608082019050611ded6000830187611b59565b611dfa6020830186611970565b611e076040830185611b59565b611e146060830184611b59565b95945050505050565b6000604082019050611e326000830185611b59565b611e3f6020830184611b59565b9392505050565b6000606082019050611e5b6000830186611b59565b611e686020830185611b59565b611e756040830184611b59565b949350505050565b600060c082019050611e926000830189611b59565b611e9f6020830188611b59565b611eac6040830187611b59565b611eb96060830186611b59565b611ec66080830185611b59565b611ed360a0830184611b59565b979650505050505050565b6000611ee8611ef9565b9050611ef48282612122565b919050565b6000604051905090565b600067ffffffffffffffff821115611f1e57611f1d6121bb565b5b611f27826121ea565b9050602081019050919050565b600081519050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b6000611f71826120b7565b9150611f7c836120b7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611fb157611fb061215d565b5b828201905092915050565b6000611fc7826120b7565b9150611fd2836120b7565b925082611fe257611fe161218c565b5b828204905092915050565b6000611ff8826120b7565b9150612003836120b7565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561203c5761203b61215d565b5b828202905092915050565b6000612052826120b7565b915061205d836120b7565b9250828210156120705761206f61215d565b5b828203905092915050565b600061208682612097565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60006120d9826120b7565b9050919050565b82818337600083830152505050565b60005b8381101561210d5780820151818401526020810190506120f2565b8381111561211c576000848401525b50505050565b61212b826121ea565b810181811067ffffffffffffffff8211171561214a576121496121bb565b5b80604052505050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f77726f6e67207369676e65720000000000000000000000000000000000000000600082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f7061796c6f616420776173206d6f646966696564000000000000000000000000600082015250565b7f4e6f7420656e6f75676820737465707320617661696c61626c6520746f206d6f60008201527f7665207468657265000000000000000000000000000000000000000000000000602082015250565b7f4e6f7420656e6f756768742f746f6f206d7563682065746865722073656e7400600082015250565b7f796f7520616c7265616479207369676e65642075700000000000000000000000600082015250565b7f6c617374207175657269656420646f6573206e6f74206d617463680000000000600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f796f75206e65656420746f206265207265676973746572656400000000000000600082015250565b6123c18161207b565b81146123cc57600080fd5b50565b6123d88161208d565b81146123e357600080fd5b50565b6123ef816120b7565b81146123fa57600080fd5b50565b612406816120c1565b811461241157600080fd5b5056fea26469706673582212206dc563a9c97aa1e33522df8f7a7a763746aeab013232aa9e8fbcab56ea19a84064736f6c63430008040033";

type PlayersConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PlayersConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Players__factory extends ContractFactory {
  constructor(...args: PlayersConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Players> {
    return super.deploy(overrides || {}) as Promise<Players>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Players {
    return super.attach(address) as Players;
  }
  override connect(signer: Signer): Players__factory {
    return super.connect(signer) as Players__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PlayersInterface {
    return new utils.Interface(_abi) as PlayersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Players {
    return new Contract(address, _abi, signerOrProvider) as Players;
  }
}
