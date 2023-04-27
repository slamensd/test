const CONTRACT_ADDRESS = "0xfD9B9b6F42B3bC85F8078Be7636554E862A82316";
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const ABI = [{"constant":false,"inputs":[{"name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newImplementation","type":"address"},{"name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"implementation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_implementation","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"previousAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"implementation","type":"address"}],"name":"Upgraded","type":"event"}];

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);


const connectWalletButton = document.getElementById("connect-wallet");
const claimForm = document.querySelector(".claim-form");
const claimUsdcButton = document.getElementById("claim-usdc");
const nftContractInput = document.getElementById("nft-contract");
const tokenIdInput = document.getElementById("token-id");
const statusElement = document.getElementById("status");

let accounts = [];

connectWalletButton.onclick = async () => {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length) {
        claimForm.style.display = "block";
        connectWalletButton.style.display = "none";
    }
};

claimUsdcButton.onclick = async () => {
    const nftContract = nftContractInput.value;
    const tokenId = tokenIdInput.value;

    if (!nftContract || !tokenId) {
        statusElement.textContent = "Please provide valid input.";
        return;
    }

    try {
        await contract.methods.claimUsdc(nftContract, tokenId).send({ from: accounts[0] });
        statusElement.textContent = "USDC claimed successfully!";
    } catch (error) {
        console.error(error);
        statusElement.textContent = "Error claiming USDC. Make sure you own the NFT and have a valid claim.";
    }
};