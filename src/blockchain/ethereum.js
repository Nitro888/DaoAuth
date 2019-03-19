const msgpack = require('msgpack-lite')
const base64js = require('base64-js')
const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546')
const jsonInterface = require('./daoAuth.js')
const api = 'https://api-ropsten.etherscan.io'

window.wallet = {
  web3: web3,
  daoAuth: new web3.eth.Contract(jsonInterface.abi, jsonInterface.address),
  isAddress: function (address) {
    return web3.utils.isAddress(address)
  },
  // window.wallet.abiQR
  abiQR: {
    /*
    {
      url: '',
      to: '',
      json: {},
      parms: []
    }
    */
    eocode: function (url, to, json, parms) {
      return window.wallet.storage.base64.encode({ url, to, json, parms })
    },
    decode: function (abiBase64) {
      return window.wallet.storage.base64.decode(abiBase64)
    },
    encodeFunctionCall: function (abi) {
      let code = null
      if (abi.json.name !== '') {
        let parameters = []
        for (let i = 0; i < abi.parms.length; i++) {
          parameters.push(abi.parms[i].model)
        }
        code = window.wallet.web3.eth.abi.encodeFunctionCall(abi.json, parameters)
      }
      return { to: abi.to, code }
    }
  },
  // window.wallet.logs
  logs: {
    loadABI: function (address) {
      return new Promise(function (resolve, reject) {
        let url = api + '/api?module=contract&action=getabi&address=' + address
        window.wallet.utils.loadJson(url).then(data => { resolve(data.result) }).catch(reject)
      })
    },
    loadSource: function (address) {
      return new Promise(function (resolve, reject) {
        let url = api + '/api?module=contract&action=getsourcecode&address=' + address
        window.wallet.utils.loadJson(url).then(data => { resolve(data.result) }).catch(reject)
      })
    }
  },
  utils: {
    loadJson: function (url) {
      return new Promise(function (resolve, reject) {
        let xhr = new window.XMLHttpRequest()
        xhr.onreadystatechange = function () {
          if (xhr.readyState === window.XMLHttpRequest.DONE) {
            if (xhr.status === 200) resolve(JSON.parse(xhr.responseText))
            else reject(new Error(xhr))
          }
        }
        xhr.open('GET', url, true)
        xhr.send()
      })
    }
  },
  storage: {
    base64: {
      encode: function (json) {
        return base64js.fromByteArray(msgpack.encode(json))
      },
      decode: function (encodedData) {
        return msgpack.decode(base64js.toByteArray(encodedData))
      }
    },
    msgpack: {
      encode: function (json) {
        return web3.utils.bytesToHex(msgpack.encode(json))
      },
      decode: function (hex) {
        try {
          return msgpack.decode(web3.utils.hexToBytes(hex))
        } catch (error) {
          console.log('msgpack error')
        }
        return null
      }
    }
  }
}

export default window.wallet
