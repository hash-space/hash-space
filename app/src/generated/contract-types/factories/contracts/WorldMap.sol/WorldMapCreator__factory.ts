/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  WorldMapCreator,
  WorldMapCreatorInterface,
} from "../../../contracts/WorldMap.sol/WorldMapCreator";

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
    inputs: [
      {
        internalType: "uint256",
        name: "_worldIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_length",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_breadth",
        type: "uint256",
      },
    ],
    name: "defineWorldMap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_selectedWorldIndex",
        type: "uint256",
      },
    ],
    name: "deleteWorld",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "existingWorlds",
    outputs: [
      {
        internalType: "uint256",
        name: "worldIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "Length",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "Breadth",
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
        name: "_worldId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_planetId",
        type: "uint256",
      },
    ],
    name: "getLocation",
    outputs: [
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
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_worldId",
        type: "uint256",
      },
    ],
    name: "getPlanets",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "planetID",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "worldMapIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "xCoord",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "yCoord",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "planetType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct SharedStructs.Planet[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_selectedWorldIndex",
        type: "uint256",
      },
    ],
    name: "getWorldMap",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "worldIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Length",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Breadth",
            type: "uint256",
          },
        ],
        internalType: "struct WorldMapCreator.WorldMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_worldMapIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_xCoord",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_yCoord",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_planetType",
        type: "uint256",
      },
    ],
    name: "manualCreatePlanet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "planetIndex",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "planetsInWorld",
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
    name: "renounceOwnership",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002d6100226100a360201b60201c565b6100ab60201b60201c565b60006003819055506040516100419061016f565b604051809103906000f08015801561005d573d6000803e3d6000fd5b50600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061017d565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b610ab980620016bb83390190565b61152e806200018d6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80638a36781e116100715780638a36781e1461017a5780638da5cb5b146101aa578063a2b870db146101c8578063a3f38e9b146101fa578063e2c7eb051461022a578063f2fde38b1461025a576100b4565b80633684aa66146100b957806342c3159c146100ea578063450509a21461010657806348d62059146101225780636886c12614610152578063715018a614610170575b600080fd5b6100d360048036038101906100ce9190610d70565b610276565b6040516100e192919061113d565b60405180910390f35b61010460048036038101906100ff9190610d47565b61033e565b005b610120600480360381019061011b9190610dac565b6103eb565b005b61013c60048036038101906101379190610d47565b610520565b6040516101499190611107565b60405180910390f35b61015a61056b565b6040516101679190611122565b60405180910390f35b610178610571565b005b610194600480360381019061018f9190610d70565b6105f9565b6040516101a19190611122565b60405180910390f35b6101b261062a565b6040516101bf919061104a565b60405180910390f35b6101e260048036038101906101dd9190610d47565b610653565b6040516101f193929190611166565b60405180910390f35b610214600480360381019061020f9190610d47565b61067d565b6040516102219190611065565b60405180910390f35b610244600480360381019061023f9190610dfb565b61082e565b6040516102519190611122565b60405180910390f35b610274600480360381019061026f9190610cf5565b6109ff565b005b6000806000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166334efcb8e856040518263ffffffff1660e01b81526004016102d69190611122565b60c06040518083038186803b1580156102ee57600080fd5b505afa158015610302573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103269190610d1e565b90508060400151816060015192509250509250929050565b610346610af7565b73ffffffffffffffffffffffffffffffffffffffff1661036461062a565b73ffffffffffffffffffffffffffffffffffffffff16146103ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103b1906110c7565b60405180910390fd5b6001600082815260200190815260200160002060008082016000905560018201600090556002820160009055505050565b6103f3610af7565b73ffffffffffffffffffffffffffffffffffffffff1661041161062a565b73ffffffffffffffffffffffffffffffffffffffff1614610467576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045e906110c7565b60405180910390fd5b60006001600085815260200190815260200160002060010154146104c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b7906110e7565b60405180910390fd5b6104c8610bc3565b6040518060600160405280858152602001848152602001838152509050806001600086815260200190815260200160002060008201518160000155602082015181600101556040820151816002015590505050505050565b610528610bc3565b6001600083815260200190815260200160002060405180606001604052908160008201548152602001600182015481526020016002820154815250509050919050565b60035481565b610579610af7565b73ffffffffffffffffffffffffffffffffffffffff1661059761062a565b73ffffffffffffffffffffffffffffffffffffffff16146105ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e4906110c7565b60405180910390fd5b6105f76000610aff565b565b6002602052816000526040600020818154811061061557600080fd5b90600052602060002001600091509150505481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60016020528060005260406000206000915090508060000154908060010154908060020154905083565b606060006001600354610690919061125f565b905060008167ffffffffffffffff8111156106d4577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60405190808252806020026020018201604052801561070d57816020015b6106fa610be4565b8152602001906001900390816106f25790505b50905060005b82811015610823576000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166334efcb8e836040518263ffffffff1660e01b81526004016107789190611122565b60c06040518083038186803b15801561079057600080fd5b505afa1580156107a4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107c89190610d1e565b905080838381518110610804577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001018190525050808061081b90611322565b915050610713565b508092505050919050565b6000610838610af7565b73ffffffffffffffffffffffffffffffffffffffff1661085661062a565b73ffffffffffffffffffffffffffffffffffffffff16146108ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108a3906110c7565b60405180910390fd5b6000600160008781526020019081526020016000206001015411610905576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108fc90611087565b60405180910390fd5b600160036000828254610918919061125f565b92505081905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663040af1ba600354878787876040518663ffffffff1660e01b815260040161098495949392919061119d565b600060405180830381600087803b15801561099e57600080fd5b505af11580156109b2573d6000803e3d6000fd5b505050506002600086815260200190815260200160002060035490806001815401808255809150506001900390600052602060002001600090919091909150556003549050949350505050565b610a07610af7565b73ffffffffffffffffffffffffffffffffffffffff16610a2561062a565b73ffffffffffffffffffffffffffffffffffffffff1614610a7b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a72906110c7565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610aeb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae2906110a7565b60405180910390fd5b610af481610aff565b50565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60405180606001604052806000815260200160008152602001600081525090565b6040518060c001604052806000815260200160008152602001600081526020016000815260200160008152602001600081525090565b600081359050610c29816114ca565b92915050565b600060c08284031215610c4157600080fd5b610c4b60c06111f0565b90506000610c5b84828501610ce0565b6000830152506020610c6f84828501610ce0565b6020830152506040610c8384828501610ce0565b6040830152506060610c9784828501610ce0565b6060830152506080610cab84828501610ce0565b60808301525060a0610cbf84828501610ce0565b60a08301525092915050565b600081359050610cda816114e1565b92915050565b600081519050610cef816114e1565b92915050565b600060208284031215610d0757600080fd5b6000610d1584828501610c1a565b91505092915050565b600060c08284031215610d3057600080fd5b6000610d3e84828501610c2f565b91505092915050565b600060208284031215610d5957600080fd5b6000610d6784828501610ccb565b91505092915050565b60008060408385031215610d8357600080fd5b6000610d9185828601610ccb565b9250506020610da285828601610ccb565b9150509250929050565b600080600060608486031215610dc157600080fd5b6000610dcf86828701610ccb565b9350506020610de086828701610ccb565b9250506040610df186828701610ccb565b9150509250925092565b60008060008060808587031215610e1157600080fd5b6000610e1f87828801610ccb565b9450506020610e3087828801610ccb565b9350506040610e4187828801610ccb565b9250506060610e5287828801610ccb565b91505092959194509250565b6000610e6a8383610f6f565b60c08301905092915050565b610e7f816112b5565b82525050565b6000610e9082611225565b610e9a818561123d565b9350610ea583611215565b8060005b83811015610ed6578151610ebd8882610e5e565b9750610ec883611230565b925050600181019050610ea9565b5085935050505092915050565b6000610ef060148361124e565b9150610efb826113da565b602082019050919050565b6000610f1360268361124e565b9150610f1e82611403565b604082019050919050565b6000610f3660208361124e565b9150610f4182611452565b602082019050919050565b6000610f5960258361124e565b9150610f648261147b565b604082019050919050565b60c082016000820151610f85600085018261102c565b506020820151610f98602085018261102c565b506040820151610fab604085018261102c565b506060820151610fbe606085018261102c565b506080820151610fd1608085018261102c565b5060a0820151610fe460a085018261102c565b50505050565b606082016000820151611000600085018261102c565b506020820151611013602085018261102c565b506040820151611026604085018261102c565b50505050565b611035816112e7565b82525050565b611044816112e7565b82525050565b600060208201905061105f6000830184610e76565b92915050565b6000602082019050818103600083015261107f8184610e85565b905092915050565b600060208201905081810360008301526110a081610ee3565b9050919050565b600060208201905081810360008301526110c081610f06565b9050919050565b600060208201905081810360008301526110e081610f29565b9050919050565b6000602082019050818103600083015261110081610f4c565b9050919050565b600060608201905061111c6000830184610fea565b92915050565b6000602082019050611137600083018461103b565b92915050565b6000604082019050611152600083018561103b565b61115f602083018461103b565b9392505050565b600060608201905061117b600083018661103b565b611188602083018561103b565b611195604083018461103b565b949350505050565b600060a0820190506111b2600083018861103b565b6111bf602083018761103b565b6111cc604083018661103b565b6111d9606083018561103b565b6111e6608083018461103b565b9695505050505050565b60006111fa61120b565b905061120682826112f1565b919050565b6000604051905090565b6000819050602082019050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600061126a826112e7565b9150611275836112e7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156112aa576112a961136b565b5b828201905092915050565b60006112c0826112c7565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6112fa826113c9565b810181811067ffffffffffffffff821117156113195761131861139a565b5b80604052505050565b600061132d826112e7565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156113605761135f61136b565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f776f726c6420646f6573206e6f74206578697374000000000000000000000000600082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f576f726c6420616c72656164792063726561746564207769746820746861742060008201527f696e646578000000000000000000000000000000000000000000000000000000602082015250565b6114d3816112b5565b81146114de57600080fd5b50565b6114ea816112e7565b81146114f557600080fd5b5056fea26469706673582212204e4621f643b57e04672bd35917a432b402b4579b38c6ce213f43a12d16374a9264736f6c63430008040033608060405234801561001057600080fd5b50610019610119565b6040518060600160405280600281526020016040518060400160405280600581526020017f796561726e00000000000000000000000000000000000000000000000000000081525081526020016040518060400160405280601a81526020017f68747470733a2f2f544f444f2d6164642d495046532d6c696e6b000000000000815250815250905060008190806001815401808255809150506001900390600052602060002090600302016000909190919091506000820151816000015560208201518160010190805190602001906100f392919061013a565b50604082015181600201908051906020019061011092919061013a565b5050505061023e565b60405180606001604052806000815260200160608152602001606081525090565b828054610146906101dd565b90600052602060002090601f01602090048101928261016857600085556101af565b82601f1061018157805160ff19168380011785556101af565b828001600101855582156101af579182015b828111156101ae578251825591602001919060010190610193565b5b5090506101bc91906101c0565b5090565b5b808211156101d95760008160009055506001016101c1565b5090565b600060028204905060018216806101f557607f821691505b602082108114156102095761020861020f565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b61086c8061024d6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063040af1ba1461006757806309f29d1b1461008357806310ccd5301461009f57806334efcb8e146100bd578063cf4530b9146100ed578063e08c264e14610122575b600080fd5b610081600480360381019061007c9190610480565b610154565b005b61009d60048036038101906100989190610457565b6101e7565b005b6100a76101ea565b6040516100b49190610655565b60405180910390f35b6100d760048036038101906100d29190610457565b61021d565b6040516100e4919061063a565b60405180910390f35b61010760048036038101906101029190610457565b610286565b604051610119969594939291906106b5565b60405180910390f35b61013c60048036038101906101379190610457565b6102c2565b60405161014b93929190610670565b60405180910390f35b61015c61040c565b6040518060c00160405280878152602001868152602001858152602001848152602001838152602001600081525090508060016000888152602001908152602001600020600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a08201518160050155905050505050505050565b50565b600044426040516020016101ff929190610603565b6040516020818303038152906040528051906020012060001c905090565b61022561040c565b600160008381526020019081526020016000206040518060c001604052908160008201548152602001600182015481526020016002820154815260200160038201548152602001600482015481526020016005820154815250509050919050565b60016020528060005260406000206000915090508060000154908060010154908060020154908060030154908060040154908060050154905086565b600081815481106102d257600080fd5b90600052602060002090600302016000915090508060000154908060010180546102fb9061077a565b80601f01602080910402602001604051908101604052809291908181526020018280546103279061077a565b80156103745780601f1061034957610100808354040283529160200191610374565b820191906000526020600020905b81548152906001019060200180831161035757829003601f168201915b5050505050908060020180546103899061077a565b80601f01602080910402602001604051908101604052809291908181526020018280546103b59061077a565b80156104025780601f106103d757610100808354040283529160200191610402565b820191906000526020600020905b8154815290600101906020018083116103e557829003601f168201915b5050505050905083565b6040518060c001604052806000815260200160008152602001600081526020016000815260200160008152602001600081525090565b6000813590506104518161081f565b92915050565b60006020828403121561046957600080fd5b600061047784828501610442565b91505092915050565b600080600080600060a0868803121561049857600080fd5b60006104a688828901610442565b95505060206104b788828901610442565b94505060406104c888828901610442565b93505060606104d988828901610442565b92505060806104ea88828901610442565b9150509295509295909350565b600061050282610716565b61050c8185610721565b935061051c818560208601610747565b610525816107e5565b840191505092915050565b600061053d600983610732565b9150610548826107f6565b600982019050919050565b60c08201600082015161056960008501826105ce565b50602082015161057c60208501826105ce565b50604082015161058f60408501826105ce565b5060608201516105a260608501826105ce565b5060808201516105b560808501826105ce565b5060a08201516105c860a08501826105ce565b50505050565b6105d78161073d565b82525050565b6105e68161073d565b82525050565b6105fd6105f88261073d565b6107ac565b82525050565b600061060f82856105ec565b60208201915061061f82846105ec565b60208201915061062e82610530565b91508190509392505050565b600060c08201905061064f6000830184610553565b92915050565b600060208201905061066a60008301846105dd565b92915050565b600060608201905061068560008301866105dd565b818103602083015261069781856104f7565b905081810360408301526106ab81846104f7565b9050949350505050565b600060c0820190506106ca60008301896105dd565b6106d760208301886105dd565b6106e460408301876105dd565b6106f160608301866105dd565b6106fe60808301856105dd565b61070b60a08301846105dd565b979650505050505050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b60005b8381101561076557808201518184015260208101905061074a565b83811115610774576000848401525b50505050565b6000600282049050600182168061079257607f821691505b602082108114156107a6576107a56107b6565b5b50919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f54656c6c6f72524e470000000000000000000000000000000000000000000000600082015250565b6108288161073d565b811461083357600080fd5b5056fea26469706673582212200216bc344f31a7dafd7bb0dbba75c05de2aaf0c77639fe800109d303ecd5147364736f6c63430008040033";

type WorldMapCreatorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WorldMapCreatorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WorldMapCreator__factory extends ContractFactory {
  constructor(...args: WorldMapCreatorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<WorldMapCreator> {
    return super.deploy(overrides || {}) as Promise<WorldMapCreator>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): WorldMapCreator {
    return super.attach(address) as WorldMapCreator;
  }
  override connect(signer: Signer): WorldMapCreator__factory {
    return super.connect(signer) as WorldMapCreator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WorldMapCreatorInterface {
    return new utils.Interface(_abi) as WorldMapCreatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WorldMapCreator {
    return new Contract(address, _abi, signerOrProvider) as WorldMapCreator;
  }
}
