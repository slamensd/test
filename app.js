const CONTRACT_ADDRESS = "0xaD278a43022233c5C6FEF5eC92BB35200667de91";
const ABI = [
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
] // Use the ABI you obtained earlier

let web3, accounts, contract;

async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.error("No web3 provider detected");
  }
}

async function getAvailableNFTs() {
  const nftList = document.getElementById("nftList");
  const nftData = [
    { nftContract: "0x9674739124d69D555712a30e0A44dE648F494219", tokenId: "1019", usdcAmount: "20000000000000000000" },
    
  ];

  for (let i = 0; i < nftData.length; i++) {
    const { nftContract, tokenId, usdcAmount } = nftData[i];

    const listItem = document.createElement("li");
    const nftInfo = document.createElement("span");
    nftInfo.innerText = `NFT Contract: ${nftContract}, Token ID: ${tokenId}, USDC: ${web3.utils.fromWei(usdcAmount, "mwei")}`;

    const claimButton = document.createElement("button");
    claimButton.innerText = "Claim";
    claimButton.disabled = true;
    claimButton.classList.add("btn");

    listItem.appendChild(nftInfo);
    listItem.appendChild(claimButton);
    nftList.appendChild(listItem);
  }
}

async function updateClaimButtons() {
  const nftListItems = document.querySelectorAll("#nftList li");
  const userAccount = accounts[0];

  for (const listItem of nftListItems) {
    const nftContract = listItem.children[0].innerText.split(" ")[2];
    const tokenId = listItem.children[0].innerText.split(" ")[5];

    const isOwner = await contract.methods.isNftOwner(userAccount, nftContract, tokenId).call();
    const claimButton = listItem.children[1];

    if (isOwner) {
      claimButton.disabled = false;
      claimButton.classList.add("btn-success");
    } else {
      claimButton.disabled = true;
      claimButton.classList.add("btn-secondary");
    }
  }
}

async function onConnect() {
  if (!web3) {
    await initWeb3();
  }

  updateClaimButtons();
}

document.getElementById("connectBtn").addEventListener("click", onConnect);
getAvailableNFTs();
