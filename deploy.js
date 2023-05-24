const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require('./compile');
const mnemonicPhrase = "<12 word mnemonic (Metamask)>";

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: "<infura_endpoint_url>"
});

const web3 = new Web3(provider);
const INITIAL_MESSAGE = 'Hi There!';
const deploy = async () => {
    // get a list of accounts
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy welcome contract from account : ", accounts[0]);
    //deploy the contract to sepolia
    const welcome = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0],  gas: 5000000});
    console.log("Welcome contract deployed to : ", welcome.options.address);
    // Finish the deployment process elegantly(to avoid hanging deployment)
    provider.engine.stop();
};

deploy();

