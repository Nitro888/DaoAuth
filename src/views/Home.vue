<template>
  <v-container>
    <div v-for="(item, index) in contents" v-bind:key="index">
      <h1 class="white--text font-weight-medium mb-2 display-1 text-xs-center" v-html="item.title"/>
      <v-container class="subheading mb-5 text-xs-center nanum-gothic" v-html="item.content"/>
    </div>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex md4>
        <div class="headline">Issuer Account</div>
        <div class="subheading mb-3">{{member.issuers}}/{{member.accounts}}</div>
      </v-flex>
      <v-flex md8>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">Create Issuer Account</div>
            </template>
            <v-container>
              <v-form ref="formCreate" v-model="valid" lazy-validation>
                <v-text-field
                  label="Master"
                  v-model="create.master"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="Payment"
                  v-model="create.payment"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="Verify"
                  v-model="create.verify"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="create.uid"
                  class="address-small"
                  :rules="[rules.min]"
                ></v-text-field>
                <v-text-field
                  label="Account"
                  v-model="create.account"
                  class="address-small"
                  :loading="loading"
                  readonly
                ></v-text-field>
                <v-spacer/><v-spacer/><v-spacer/>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="createIssuer">Create</v-btn>        
              </div>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">Add Issuer Proxy Keys</div>
            </template>
            <v-container>
              <v-form ref="formAdd" v-model="valid" lazy-validation>
                <v-text-field
                  label="Account"
                  v-model="add.account"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="add.proxyKey"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="addProxy">Add</v-btn>        
              </div>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">Remove Issuer Proxy Keys</div>
            </template>
            <v-container>
              <v-form ref="formRemove" v-model="valid" lazy-validation>
                <v-text-field
                  label="Account"
                  v-model="remove.account"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="remove.proxyKey"
                  class="address-small"
                  :rules="[rules.isAddress]"
                ></v-text-field>
              </v-form>
              <div class="text-xs-right">
                <v-btn flat @click="removeProxy">Remove</v-btn>        
              </div>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex lg4>
        <div class="headline mb-3">Token Factory</div>
      </v-flex>
      <v-flex lg8>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">ERC20</div>
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
              <div class="title">ERC721</div>
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
    <v-divider class="mb-3 mt-3"/>
  </v-container>
</template>

<script>
  import ERC20 from '@/components/ERC20Factory.vue'
  import ERC721 from '@/components/ERC721Factory.vue'

  export default {
    components: {
      ERC20,
      ERC721
    },
    props: ['contents'],
    data () {
      return {
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
          min: v => v.length >= 4 || 'Min 4 characters',
        }
      }
    },
    mounted: function () {
      if(web3) {
        this.enable = true
        web3.eth.call({
          to: window.wallet.daoAuth.address,
          data: window.wallet.daoAuth.methods.accounts().encodeABI()
        }, (err, result) => {
          if (!err) {
            result = window.wallet.web3.eth.abi.decodeParameters(["uint256", "uint256"], result)
            this.member.issuers = window.wallet.web3.utils.toBN(result[0]).toString()
            this.member.accounts = window.wallet.web3.utils.toBN(result[1]).toString()
          }
        })
      }
    },
    methods: {
      sendTransaction: function (to, data) {
        if (web3.eth.accounts.length>0) {
          web3.eth.sendTransaction({
            from: web3.eth.accounts[0],
            to,
            data
          }, (err, result) => {
            console.log(err,result)
          })
        } else {
          // error
        }
      },
      createIssuer: function () {
        if (this.$refs.formCreate.validate() && this.enable) {
          let uid = window.wallet.web3.utils.keccak256(this.create.uid)
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
  .nanum-gothic {
    font-family: 'Nanum Gothic', sans-serif;
  }
</style>