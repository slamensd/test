const contractAddress = "0x9674739124d69d555712a30e0a44de648f494219";
const abiUrl = "https://api.etherscan.io/api?module=contract&action=getabi&address=0xa878c0aeaaa76ec7a370b76ac5bcac4364ed60e1";

let web3;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];
            document.getElementById('wallet-address').textContent = walletAddress;
            document.getElementById('wallet-connect').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            await getContractABI();
            await displayERC721Balance(walletAddress);
            await displayNFTs(walletAddress);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    } else {
        alert("Please install MetaMask or another compatible wallet provider!");
    }
}

async function getContractABI() {
    try {
        const response = await fetch(abiUrl);
        const data = await response.json();
        const abi = JSON.parse(data.result);
        contract = new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
        console.error("Error fetching ABI:", error);
    }
}

async function displayERC721Balance(address) {
    try {
        const balance = await contract.methods.balanceOf(address).call();
        document.getElementById('nippy-balance').textContent = balance;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

async function displayNFTs(address) {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    try {
        const nftGrid = document.querySelector('.nft-grid');
        const totalSupply = await contract.methods.totalSupply().call();
        const ipfsGateway = 'https://ipfs.io/ipfs/';

        for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
            const owner = await contract.methods.ownerOf(tokenId).call();

            if (owner.toLowerCase() === address.toLowerCase()) {
                const tokenURI = await contract.methods.tokenURI(tokenId).call();
                const ipfsUrl = tokenURI.replace('ipfs://', ipfsGateway);
                const response = await fetch(ipfsUrl);
                const metadata = await response.json();

                const nft = document.createElement('div');
                nft.classList.add('nft');
                nft.innerHTML = `
                    <img src="${metadata.image}" alt="${metadata.name}">
                    <h3>${metadata.name}</h3>
                    <p>Last for-sale price: ${metadata.Books} ETH</p>
                `;
                nftGrid.appendChild(nft);
            }
        }
    } catch (error) {
        console.error("Error fetching NFTs:", error);
    }finally {
        loader.classList.add('hidden');
    }
}


