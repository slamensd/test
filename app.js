let web3;
let accounts;
let contract;

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
];

const CONTRACT_ADDRESS = '0xaD278a43022233c5C6FEF5eC92BB35200667de91';

async function initWeb3() {
  try {
    // Modern dapp browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    // Legacy dapp browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers
    else {
      throw new Error('Please use a dapp browser like MetaMask to interact with this application!');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to connect to the wallet. Please make sure you have a compatible wallet installed and try again.');
  }
}

async function onConnect() {
  if (!web3) {
    await initWeb3();
  }

  if (!accounts || accounts.length === 0) {
    accounts = await web3.eth.getAccounts();
  }

  if (!contract) {
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  }

  const connectBtn = document.getElementById('connectBtn');

  if (accounts.length > 0) {
    connectBtn.innerText = 'Disconnect';
    connectBtn.classList.remove('btn-primary');
    connectBtn.classList.add('btn-secondary');
  } else {
    connectBtn.innerText = 'Connect Wallet';
    connectBtn.classList.remove('btn-secondary');
    connectBtn.classList.add('btn-primary');
  }
}

async function getAvailableNFTs() {
  const nftList = document.getElementById('nftList');
  nftList.innerHTML = '';

  const nftData = [
    { nftContract: "0x9674739124d69D555712a30e0A44dE648F494219", tokenId: "1019" }
  ];

  for (const data of nftData) {
    const listItem = document.createElement('li');
    const nftInfo = document.createElement('span');
    const claimButton = document.createElement('button');

    nftInfo.innerText = `NFT Contract: ${data.contractAddress}, Token ID: ${data.tokenId}, USDC: ${data.usdcAmount}`;
    claimButton.innerText = 'Claim';
    claimButton.classList.add('btn', 'btn-success');
    claimButton.disabled = true;

    const isOwner = await contract.methods.isNftOwner(accounts[0], data.contractAddress, data.tokenId).call();

    if (isOwner) {
      claimButton.disabled = false;
    }

    claimButton.addEventListener('click', claimNFT);

    listItem.appendChild(nftInfo);
    listItem.appendChild(claimButton);
    nftList.appendChild(listItem);
  }
}

async function claimNFT(event) {
  const button = event.target;
  const listItem = button.parentNode;
  const nftInfo = listItem.firstChild;
  const contractAddress = nftInfo.innerText.split(' ')[2];
  const tokenId = parseInt(nftInfo.innerText.split(' ')[5]);

  try {
    await contract.methods.claim(tokenId).send({ from: accounts[0] });
    alert('NFT claimed successfully!');
    button.disabled = true;
  } catch (error) {
    console.error(error);
    alert('Failed to claim NFT. Please try again.');
  }
}

// Call on
