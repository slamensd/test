// Initialize Web3
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    window.ethereum.enable();
  } catch (error) {
    console.error(error);
  }
} else if (window.web3) {
  // Legacy dapp browsers...
  window.web3 = new Web3(web3.currentProvider);
} else {
  // Non-dapp browsers...
  console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Initialize ERC1155 contract
const contractAddress = '0x232765be70a5f0b49e2d72eee9765813894c1fc4';
const contractAbi = [
  // ERC1155 interface functions
  // ...
];
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Connect wallet button click event listener
const connectWalletButton = document.getElementById('connect-wallet-button');
connectWalletButton.addEventListener('click', async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const balance = await contract.methods.balanceOf(account, 6).call();
  document.getElementById('balance').textContent = balance;
  document.getElementById('token-balance').style.display = 'block';
});

// Burn button click event listener
const burnButton = document.getElementById('burn-button');
burnButton.addEventListener('click', async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const balance = await contract.methods.balanceOf(account, 6).call();
  if (balance > 0) {
    const approveResult = await contract.methods.approve('0x000000000000000000000000000000000000dEaD', 1).send({ from: account });
    const burnResult = await contract.methods.burn(6, 1).send({ from: account });
    if (burnResult.status) {
      document.getElementById('secret-message').style.display = 'block';
      burnButton.style.display = 'none';
    }
  } else {
    alert('You do not own any ERC1155 Token #6.');
  }
});
