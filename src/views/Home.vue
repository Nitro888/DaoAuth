<template>
  <v-container>
      <h1 class="white--text font-weight-medium mb-2 display-1 text-xs-left">DaoAuth</h1>
      <div class="subheading mb-5 text-xs-left nanum-gothic">
        <blockquote class="blockquote subheading">
          DaoAuth는 블록체인을 이용한 탈중앙 인증 수단입니다.
        </blockquote>
      </div>
      <h1 class="white--text font-weight-medium mb-2 display-1 text-xs-left">Account</h1>
      <div class="subheading mb-5 text-xs-left nanum-gothic">
        <blockquote class="blockquote subheading">
          프라이빗키와 공개주소를 이용한 기존 지갑은<br/>
          <blockquote class="blockquote subheading">
            1. 프라이빗키 유출에 따른 대응이 불가능하며,<br/>
            2. 타인에게 양도할 경우, 상호 신뢰의 문제가 있으며,<br/>
            3. 사용자가 키를 변경하였을 경우 기존 키와 공개주소를 이용해 쌓은 자산들을 가져오기 불가능하다는 단점등이 있습니다.<br/>
          </blockquote>
          그러나 DaoAuth에 의해 만들어진 어카운트는<br/>
          <blockquote class="blockquote subheading">
            1. 사용자 암호를 바꾸듯이 사용자가 언제든지 키를 바꿀 수 있으며,<br/>
            2. 따라서 양도 문제에 있어서도 신뢰의 문제가 사라지게 됩니다.<br/>
            3. 그리고 키를 변경하더라도 어카운트의 주소는 변경이 되지 않기 때문에, 많은 자산들을 이전에 대해 고민할 필요가 없습니다.<br/>
          </blockquote>
        </blockquote>
      </div>
      <h1 class="white--text font-weight-medium mb-2 display-1 text-xs-left">Issuer</h1>
      <div class="subheading mb-5 text-xs-left nanum-gothic">
        <blockquote class="blockquote subheading">
          자신의 어카운트를 직접 DaoAuth에서 생성한 사용자를 인증자라고 부릅니다.<br/>
          인증자들은 사용자들의 요청을 받아 어카운트를 생성해주게 되며,<br/>
          이때 인증자는 경우에 따라 사용자들에게 생성해주는 댓가로 e-mail, 전화번호, 그외 기타 KYC&AML에 필요한 정보를 요청할 수 있습니다.<br/>
          따라서 높은 수준 정보를 요구하는 인증자들이 생성한 어카운트일 수록 계좌거래에 있어서 상대방에게 높은 신뢰를 얻을 수 있습니다.
        </blockquote>
      </div>
      <h1 class="white--text font-weight-medium mb-2 display-1 text-xs-left">User</h1>
      <div class="subheading mb-5 text-xs-left nanum-gothic">
        <blockquote class="blockquote subheading">
          인증자를 통해 어카운트를 생성한 이용자들을 사용자들이라고 부릅니다.<br/>
          그리고 이 어카운트를 이용해 DaoAuth를 지원하는 각종 서비스에 바로 가입하여 이용할 수 있게 됩니다.
        </blockquote>
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