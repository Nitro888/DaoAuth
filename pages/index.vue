<template>
  <v-container>
    <div v-for="(item, index) in contents" v-bind:key="index">
      <div class="headline mb-1 white--text font-weight-light text-xs-center" v-html="item.title"/>
      <div class="body-2 mb-5 text-xs-center font-weight-thin noto" v-html="item.content"/>
    </div>
    <h1 class="white--text font-weight-light display-1 mt-5 text-xs-center">DaoAuth</h1>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex md4>
        <div class="headline font-weight-light">Issuer Account</div>
        <div class="body-2 mb-3 font-weight-thin">{{member.issuers}}/{{member.accounts}}</div>
      </v-flex>
      <v-flex md8>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Create Issuer Account</div>
            </template>
            <v-container>
              <v-form ref="formCreate" v-model="valid" lazy-validation>
                <v-text-field
                  label="Master"
                  v-model="create.master"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="Payment"
                  v-model="create.payment"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="Verify"
                  v-model="create.verify"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="create.uid"
                  class="address-small"
                  :rules="[rules.min]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="Account"
                  v-model="create.account"
                  class="address-small"
                  :loading="loading"
                  :disabled="!enable"
                  readonly
                ></v-text-field>
                <v-spacer/><v-spacer/><v-spacer/>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="createIssuer" :disabled="!enable">Create</v-btn>
              </div>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Add Issuer Proxy Keys</div>
            </template>
            <v-container>
              <v-form ref="formAdd" v-model="valid" lazy-validation>
                <v-text-field
                  label="Account"
                  v-model="add.account"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="add.proxyKey"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="addProxy" :disabled="!enable">Add</v-btn>
              </div>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Remove Issuer Proxy Keys</div>
            </template>
            <v-container>
              <v-form ref="formRemove" v-model="valid" lazy-validation>
                <v-text-field
                  label="Account"
                  v-model="remove.account"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="remove.proxyKey"
                  class="address-small"
                  :rules="[rules.isAddress]"
                  :disabled="!enable"
                ></v-text-field>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="removeProxy" :disabled="!enable">Remove</v-btn>
              </div>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-divider class="mb-5 mt-3"/>
    <h1 class="white--text font-weight-light display-1 text-xs-center">FACTORY</h1>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex md4>
        <div class="headline mb-3 font-weight-light">Token Factory</div>
      </v-flex>
      <v-flex md8>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">ERC 20</div>
            </template>
            <v-container>
              <ERC20 ref="erc20"/>
              <div class="text-xs-right">
                <v-btn flat @click="createErc20">Create</v-btn>
              </div>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">ERC 721</div>
            </template>
            <v-container>
              <ERC721 ref="erc721"/>
              <div class="text-xs-right">
                <v-btn flat @click="createErc721">Create</v-btn>
              </div>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-divider class="mb-5 mt-3"/>
    <h1 class="white--text font-weight-light display-1 text-xs-center">CODE</h1>
    <v-divider class="mb-3 mt-3"/>
    <ABI ref="abi" @call="call" @send="send" @estimateGas="estimateGas"/>
  </v-container>
</template>

<script>
import ERC20 from '@/components/ERC20Factory.vue'
import ERC721 from '@/components/ERC721Factory.vue'
import ABI from '@/components/ABI.vue'

export default {
  components: {
    ERC20,
    ERC721,
    ABI
  },
  props: ['contents'],
  data: () => ({
    valid: null,
    loading: false,
    enable: false,
    member: {
      issuers: 0,
      accounts: 0
    },
    create: {
      master: '',
      payment: '',
      verify: '',
      uid: '',
      account: ''
    },
    add: {
      proxyKey: '',
      account: ''
    },
    remove: {
      proxyKey: '',
      account: ''
    },
    rules: {
      isAddress: value => window.wallet.isAddress(value) || 'Is not address.',
      min: v => v.length >= 4 || 'Min 4 characters'
    }
  }),
  mounted: function () {
    if (web3 && web3.currentProvider.networkVersion.toString() === '3') { // eslint-disable-line
      this.enable = true
      web3.eth.call({ // eslint-disable-line
        to: window.wallet.daoAuth.address,
        data: window.wallet.daoAuth.methods.accounts().encodeABI()
      }, (err, result) => {
        if (!err) {
          result = window.wallet.web3.eth.abi.decodeParameters(['uint256', 'uint256'], result)
          this.member.issuers = window.wallet.web3.utils.toBN(result[0]).toString()
          this.member.accounts = window.wallet.web3.utils.toBN(result[1]).toString()
        }
      })
    }
  },
  methods: {
    sendTransaction: function (to, data, callback = null) {
      if (web3.currentProvider.selectedAddress) { // eslint-disable-line
        web3.eth.sendTransaction({  // eslint-disable-line
          from: web3.currentProvider.selectedAddress,  // eslint-disable-line
          to,
          data
        }, (err, result) => {
          /* eslint-disable no-console */
          console.log(err, result)
          if (!err && callback) {
            callback(result)
          }
        })
      } else {
        // error
      }
    },
    createIssuer: function () {
      if (this.$refs.formCreate.validate() && this.enable) {
        const uid = window.wallet.web3.utils.keccak256(this.create.uid)
        this.sendTransaction(
          window.wallet.daoAuth.address,
          window.wallet.daoAuth.methods.create([this.create.master, this.create.payment, this.create.verify], uid).encodeABI()
        )
      }
    },
    addProxy: function () {
      if (this.$refs.formAdd.validate() && this.enable) {
        this.sendTransaction(
          window.wallet.daoAuth.address,
          window.wallet.daoAuth.methods.proxyAdd(this.add.account, this.add.proxyKey).encodeABI()
        )
      }
    },
    removeProxy: function () {
      if (this.$refs.formRemove.validate() && this.enable) {
        this.sendTransaction(
          window.wallet.daoAuth.address,
          window.wallet.daoAuth.methods.proxyRemove(this.remove.account, this.remove.proxyKey).encodeABI()
        )
      }
    },
    deploy: function (result) {
      this.sendTransaction(
        null,
        (new window.wallet.web3.eth.Contract(result.abi)).deploy(result.option).encodeABI()
      )
    },
    createErc20: function () {
      this.deploy(this.$refs.erc20.compile())
    },
    createErc721: function () {
      this.deploy(this.$refs.erc721.compile())
    },
    estimateGas: function (data) {
      web3.eth.estimateGas(data.callData, data.callback) // eslint-disable-line
    },
    call: function (data) {
      web3.eth.call(data.callData, data.callback) // eslint-disable-line
    },
    send: function (data) {
      this.sendTransaction(data.callData.to, data.callData.data, data.callback)
    }
  }
}
</script>

<style scoped>
  .address {
    font-family: 'Roboto Mono', monospace;
  }
  .address-small {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9em;
  }
  .noto {
    font-family: 'Noto Sans KR', sans-serif;
  }
</style>
