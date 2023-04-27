const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "7b0930fef5674e7e9816c40b98751c85", // Replace with your Infura project ID
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,
});

let web3;

const contractAddress = "0xaD278a43022233c5C6FEF5eC92BB35200667de91";
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_usdcAmount",
				"type": "uint256"
			}
		],
		"name": "addNft",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "depositUsdc",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdcAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawUsdc",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "nftData",
		"outputs": [
			{
				"internalType": "address",
				"name": "contractAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "usdcAmount",
				"type": "uint256"
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
		"inputs": [],
		"name": "usdc",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const exampleNfts = [
    { contractAddress: "0x9674739124d69D555712a30e0A44dE648F494219", tokenId: 1019 }
];

const nftList = document.getElementById("nftList");
const status = document.getElementById("status");

document.getElementById("connectBtn").addEventListener("click", init);

async function init() {
  const provider = await web3Modal.connect();
  web3 = new Web3(provider);

  provider.on("chainChanged", () => window.location.reload());
  provider.on("accountsChanged", () => window.location.reload());

  const contract = new web3.eth.Contract(abi, contractAddress);

  exampleNfts.forEach((nft) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Contract: ${nft.contractAddress}, Token ID: ${nft.tokenId}`;

    const claimBtn = document.createElement("button");
    claimBtn.textContent = "Claim";
    claimBtn.addEventListener("click", () => claim(nft, contract));

    listItem.appendChild(claimBtn);
    nftList.appendChild(listItem);
  });
}

async function claim(nft, contract) {
  const accounts = await web3.eth.getAccounts();
  const tokenId = nft.tokenId;

  status.textContent = "Processing...";

  try {
    await contract.methods.claim(tokenId).send({ from: accounts[0] });
    status.textContent = "Claim successful!";
  } catch (error) {
    console.error(error);
    status.textContent = "An error occurred. Please try again.";
  }
}
