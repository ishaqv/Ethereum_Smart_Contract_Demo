const assert = require('assert');
const ganache = require("ganache");
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let welcome;
const INITIAL_MESSAGE = 'Hi There!';

beforeEach(async () => {
    // get a list of accounts
    accounts = await web3.eth.getAccounts();

    //deploy the contract to ganache
    welcome = await new web3.eth.Contract(abi)
                .deploy({ data: '0x' + evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
                .send({ from: accounts[0],  gas: 5000000});

});
describe('Welcome', () => {

    it('should deploy the contract', () => {
        assert.ok(welcome.options.address);
    });

    it('should create an instance with a initial message', async () => {
        const message = await welcome.methods.message().call();
        assert.strictEqual(message, INITIAL_MESSAGE);
    });

    it('should change the initial message to a new message', async () => {
        await welcome.methods.setMessage('Bye There!').send({from: accounts[0]})
        const message = await welcome.methods.getMessage().call();
        assert.strictEqual(message, 'Bye There!');
    });
});