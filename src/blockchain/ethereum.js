const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546')
const jsonInterface = require('./daoAuth.js')

window.wallet = {
  web3: web3,
  daoAuth: new web3.eth.Contract(jsonInterface.abi, jsonInterface.address),
  isAddress: function (address) {
    return web3.utils.isAddress(address)
  }
}

export default window.wallet
