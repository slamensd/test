// Wait for the document to load before running the code
document.addEventListener("DOMContentLoaded", () => {
    // Initialize the provider
    let provider;
  
    // Initialize the ERC1155 contract address and ABI
    const contractAddress = "0x232765be70a5f0b49e2d72eee9765813894c1fc4";
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "_ids",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "_values",
            "type": "uint256[]"
          }
        ],
        "name": "safeBatchTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  
    // Initialize the Web3 object
    const web3 = new Web3(window.ethereum);
  
    // Get the connect button
    const connectButton = document.getElementById("connect-button");
  
    // Get the token count paragraph
    const tokenCountParagraph = document.getElementById("token-count");
  
    // Get the burn button
    const burnButton = document.getElementById("burn-button");
  
    // Get the hidden message paragraph
    const hiddenMessageParagraph = document.getElementById("hidden-message");
  
    // Add a click event listener to the connect button
    connectButton.addEventListener("click", async () => {
      try {
        // Detect the MetaMask provider
        provider = await detectEthereumProvider();
  
        // If the provider is not detected, show an error message
        if (!provider) {
          throw new Error("Please install MetaMask to use this dApp");
        }
  
        // Request access to the user's MetaMask wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });
  
        // Set the Web3 provider to MetaMask
        web3.setProvider(window.ethereum);
  
        // Get the user's Ethereum address
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
  
        // Get the user's token count
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const tokenCount = await contract.methods.balanceOf(account, 6).call();
              // Display the user's token count
      tokenCountParagraph.innerText = `You have ${tokenCount} tokens of ID 6`;

      // Show the burn button
      burnButton.style.display = "block";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  // Add a click event listener to the burn button
  burnButton.addEventListener("click", async () => {
    try {
      // Get the user's Ethereum address
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Burn the token
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.safeTransferFrom(account, "0x0000000000000000000000000000000000000000", 6, 1, "0x00").send({ from: account });

      // Display the hidden message
      hiddenMessageParagraph.style.display = "block";
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
});
  