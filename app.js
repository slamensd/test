// Specify the contract address and ABI
const contractAddress = '0xaD278a43022233c5C6FEF5eC92BB35200667de91';
const contractABI = [
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

// Initialize Web3
let web3;
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert("Please install MetaMask to use this dApp");
}

// Contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to check if the user owns an NFT
async function checkOwnership(nftId) {
    const accounts = await web3.eth.requestAccounts();
    const userAddress = accounts[0];

    const owner = await contract.methods.ownerOf(nftId).call();
    return owner.toLowerCase() === userAddress.toLowerCase();
}

// Function to claim an NFT
async function claimNFT(nftId) {
    const accounts = await web3.eth.requestAccounts();
    const userAddress = accounts[0];

    await contract.methods.claim(nftId).send({ from: userAddress });
    alert('NFT claimed successfully!');
    location.reload(); // Refresh the page after claiming
}

// Function to render the NFT list
async function renderNFTList() {
    const nftListElement = document.getElementById('nftList');
    nftListElement.innerHTML = '';

    const nftIds = [1019]; // Replace with the actual NFT IDs you want to display

    for (const nftId of nftIds) {
        const nftData = await contract.methods.nftData(nftId).call();

        const nftItemElement = document.createElement('div');
        nftItemElement.classList.add('nftItem');

        const nftInfoElement = document.createElement('p');
        nftInfoElement.innerHTML = `NFT ID: ${nftId}<br>Contract Address: ${nftData.contractAddress}<br>USDC Amount: ${nftData.usdcAmount}`;

        const claimButtonElement = document.createElement('button');
        claimButtonElement.innerText = 'Claim';
        claimButtonElement.addEventListener('click', async () => {
            await claimNFT(nftId);
        });

        // Check ownership and set button style
        const isOwner = await checkOwnership(nftId);
        if (isOwner) {
            claimButtonElement.classList.add('greenButton');
        } else {
            claimButtonElement.classList.add('greyButton');
            claimButtonElement.disabled = true;
        }

        nftItemElement.appendChild(nftInfoElement);
        nftItemElement.appendChild(claimButtonElement);
        nftListElement.appendChild(nftItemElement);
    }
}

// Check if MetaMask is connected
if (web3) {
    window.ethereum.enable().then(() => {
        renderNFTList();
    }).catch((error) => {
        console.log(error);
    });
} else {
    alert("Please install MetaMask to use this dApp");
}
