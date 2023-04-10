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
const contractAbi = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"internalType":"address","name":"diamondCutFacet","type":"address"},{"internalType":"address","name":"diamondLoupeFacet","type":"address"},{"internalType":"address","name":"erc165Facet","type":"address"},{"internalType":"address","name":"erc173Facet","type":"address"}],"internalType":"struct Diamond.CoreFacets","name":"_coreFacets","type":"tuple"},{"components":[{"internalType":"address","name":"facetAddress","type":"address"},{"internalType":"enum IDiamondCut.FacetCutAction","name":"action","type":"uint8"},{"internalType":"bytes4[]","name":"functionSelectors","type":"bytes4[]"}],"internalType":"struct IDiamondCut.FacetCut[]","name":"_facets","type":"tuple[]"},{"components":[{"internalType":"address","name":"initContract","type":"address"},{"internalType":"bytes","name":"initData","type":"bytes"}],"internalType":"struct Diamond.Initialization[]","name":"_initializations","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"facet","type":"address"},{"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"ErrDiamondFacetAlreadyExists","type":"error"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
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
