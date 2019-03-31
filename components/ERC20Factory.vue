<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex md6>
        <v-radio-group v-model="token.select" :mandatory="false" @change="select">
          <v-radio label="ERC20 (default)" value="ERC20"></v-radio>
          <v-radio label="ERC20 (burnable)" value="ERC20Burnable"></v-radio>
          <v-radio label="ERC20 (mintable)" value="ERC20Mintable"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex md6>
        <v-text-field
          v-model="token.name"
          label="Token Name"
          readonly
        ></v-text-field>
        <v-text-field
          v-model="token.symbol"
          label="Token Symbol"
        ></v-text-field>
        <v-text-field
          v-model="token.initialSupply"
          label="Token Initial Supply"
          type="number"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
/* eslint-disable */
import SafeMath from '!raw-loader!@/blockchain/openzeppelin-solidity/math/SafeMath.sol'
import Roles from '!raw-loader!@/blockchain/openzeppelin-solidity/access/Roles.sol'
import MinterRole from '!raw-loader!@/blockchain/openzeppelin-solidity/access/roles/MinterRole.sol'
import IERC20 from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC20/IERC20.sol'
import ERC20 from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC20/ERC20.sol'
import ERC20Detailed from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC20/ERC20Detailed.sol'
import ERC20Burnable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC20/ERC20Burnable.sol'
import ERC20Mintable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC20/ERC20Mintable.sol'
/* eslint-enable */
import * as wrapper from 'solc/wrapper'
const solc = wrapper(window.Module)

const sources = {
  ERC20: {
    'math/SafeMath.sol': { content: SafeMath },
    'IERC20.sol': { content: IERC20 },
    'ERC20Detailed.sol': { content: ERC20Detailed },
    'ERC20.sol': { content: ERC20 },
    'Deploy': { content: '' }
  },
  ERC20Burnable: {
    'math/SafeMath.sol': { content: SafeMath },
    'IERC20.sol': { content: IERC20 },
    'ERC20Detailed.sol': { content: ERC20Detailed },
    'ERC20.sol': { content: ERC20 },
    'ERC20Burnable.sol': { content: ERC20Burnable },
    'Deploy': { content: '' }
  },
  ERC20Mintable: {
    'math/SafeMath.sol': { content: SafeMath },
    'IERC20.sol': { content: IERC20 },
    'ERC20Detailed.sol': { content: ERC20Detailed },
    'ERC20.sol': { content: ERC20 },
    'access/Roles.sol': { content: Roles },
    'access/roles/MinterRole.sol': { content: MinterRole },
    'ERC20Mintable.sol': { content: ERC20Mintable },
    'Deploy': { content: '' }
  }
}

export default {
  data: () => ({
    token: {
      select: 'ERC20',
      name: 'My Token',
      symbol: 'XMT',
      byteCode: null,
      initialSupply: 10000000
    }
  }),
  methods: {
    select: async function (type) {
      /*
      this.token.byteCode = null
      await this.compile(type, this.token.name, this.token.symbol)
      this.estimateGas()
      */
    },
    customize: function () {
      const base = this.token.select // base = [ERC20, ERC20Burnable, ERC20Mintable]
      const temp = sources[base]
      temp.Deploy.content = `
        pragma solidity ^0.5.2;
        import "./${base}.sol";
        import "./ERC20Detailed.sol";
        contract My${base} is ${base}, ERC20Detailed {
            uint8 public constant DECIMALS = 18;
            uint256 public constant INITIAL_SUPPLY = ${this.token.initialSupply} * (10 ** uint256(DECIMALS));
            constructor () public ERC20Detailed("${this.token.name}", "${this.token.symbol}", DECIMALS) {
                _mint(msg.sender, INITIAL_SUPPLY);
            }
        }`
      return temp
    },
    compile: function () {
      const myCustomContract = {
        language: 'Solidity',
        sources: this.customize(),
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          outputSelection: {
            '*': {
              '*': [ '*' ]
            }
          }
        }
      }
      const output = JSON.parse(solc.compile(JSON.stringify(myCustomContract)))
      this.token.byteCode = '0x' + output.contracts.Deploy[`My${this.token.select}`].evm.bytecode.object
      return { abi: output.contracts.Deploy[`My${this.token.select}`].abi, option: { data: this.token.byteCode } }
    }
  }
}
</script>
