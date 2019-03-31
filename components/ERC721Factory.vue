<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex md6>
        <v-radio-group v-model="token.select" :mandatory="false" @change="select">
          <v-radio label="ERC721 (default)" value="ERC721"></v-radio>
          <v-radio label="ERC721 (burnable)" value="ERC721Burnable"></v-radio>
          <v-radio label="ERC721 (mintable)" value="ERC721Mintable"></v-radio>
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
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
/*eslint-disable */
import SafeMath from '!raw-loader!@/blockchain/openzeppelin-solidity/math/SafeMath.sol'
import Roles from '!raw-loader!@/blockchain/openzeppelin-solidity/access/Roles.sol'
import MinterRole from '!raw-loader!@/blockchain/openzeppelin-solidity/access/roles/MinterRole.sol'
import Address from '!raw-loader!@/blockchain/openzeppelin-solidity/utils/Address.sol'
import Counters from '!raw-loader!@/blockchain/openzeppelin-solidity/drafts/Counters.sol'
import IERC165 from '!raw-loader!@/blockchain/openzeppelin-solidity/introspection/IERC165.sol'
import ERC165 from '!raw-loader!@/blockchain/openzeppelin-solidity/introspection/ERC165.sol'
import IERC721 from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/IERC721.sol'
import IERC721Receiver from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/IERC721Receiver.sol'
import IERC721Enumerable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/IERC721Enumerable.sol'
import IERC721Metadata from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/IERC721Metadata.sol'
import ERC721 from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/ERC721.sol'
import ERC721Enumerable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/ERC721Enumerable.sol'
import ERC721Metadata from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/ERC721Metadata.sol'
import ERC721Burnable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/ERC721Burnable.sol'
import ERC721Mintable from '!raw-loader!@/blockchain/openzeppelin-solidity/token/ERC721/ERC721Mintable.sol'
/* eslint-enable */
import * as wrapper from 'solc/wrapper'
const solc = wrapper(window.Module)

const sources = {
  ERC721: {
    'IERC721.sol': { content: IERC721 },
    'IERC721Receiver.sol': { content: IERC721Receiver },
    'IERC721Enumerable.sol': { content: IERC721Enumerable },
    'IERC721Metadata.sol': { content: IERC721Metadata },
    'math/SafeMath.sol': { content: SafeMath },
    'utils/Address.sol': { content: Address },
    'drafts/Counters.sol': { content: Counters },
    'introspection/IERC165.sol': { content: IERC165 },
    'introspection/ERC165.sol': { content: ERC165 },
    'ERC721.sol': { content: ERC721 },
    'ERC721Enumerable.sol': { content: ERC721Enumerable },
    'ERC721Metadata.sol': { content: ERC721Metadata },
    'Deploy': { content: '' }
  },
  ERC721Burnable: {
    'IERC721.sol': { content: IERC721 },
    'IERC721Receiver.sol': { content: IERC721Receiver },
    'IERC721Enumerable.sol': { content: IERC721Enumerable },
    'IERC721Metadata.sol': { content: IERC721Metadata },
    'math/SafeMath.sol': { content: SafeMath },
    'utils/Address.sol': { content: Address },
    'drafts/Counters.sol': { content: Counters },
    'introspection/IERC165.sol': { content: IERC165 },
    'introspection/ERC165.sol': { content: ERC165 },
    'ERC721.sol': { content: ERC721 },
    'ERC721Enumerable.sol': { content: ERC721Enumerable },
    'ERC721Metadata.sol': { content: ERC721Metadata },
    'ERC721Burnable.sol': { content: ERC721Burnable },
    'Deploy': { content: '' }
  },
  ERC721Mintable: {
    'IERC721.sol': { content: IERC721 },
    'IERC721Receiver.sol': { content: IERC721Receiver },
    'IERC721Enumerable.sol': { content: IERC721Enumerable },
    'IERC721Metadata.sol': { content: IERC721Metadata },
    'math/SafeMath.sol': { content: SafeMath },
    'utils/Address.sol': { content: Address },
    'drafts/Counters.sol': { content: Counters },
    'introspection/IERC165.sol': { content: IERC165 },
    'introspection/ERC165.sol': { content: ERC165 },
    'ERC721.sol': { content: ERC721 },
    'ERC721Enumerable.sol': { content: ERC721Enumerable },
    'ERC721Metadata.sol': { content: ERC721Metadata },
    'access/Roles.sol': { content: Roles },
    'access/roles/MinterRole.sol': { content: MinterRole },
    'ERC721Mintable.sol': { content: ERC721Mintable },
    'Deploy': { content: '' }
  }
}

export default {
  data: () => ({
    token: {
      select: 'ERC721',
      name: 'My Token',
      symbol: 'XMT',
      byteCode: null,
      output: null
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
      const base = this.token.select // base = [ERC721, ERC721Burnable, ERC721Mintable]
      const temp = sources[base]
      temp.Deploy.content = `
        pragma solidity ^0.5.2;
        import './${base}.sol';
        import "./ERC721Enumerable.sol";
        import "./ERC721Metadata.sol";
        contract My${base} is ${base}, ERC721Enumerable, ERC721Metadata {
            constructor () public ERC721Metadata("${this.token.name}", "${this.token.symbol}") {}
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
