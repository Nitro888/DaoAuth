<template>
  <v-container>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex md4>
        <div class="headline">Issuer Account</div>
        <div class="subheading">{{member.issuers}}/{{member.accounts}}</div>
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
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="Payment"
                  v-model="create.payment"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="Verify"
                  v-model="create.verify"
                  :rules="[rules.isAddress]"
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="create.uid"
                  :rules="[rules.min]"
                ></v-text-field>
                <v-text-field
                  label="Account"
                  v-model="create.account"
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
                  :rules="[rules.isAddress]"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="add.proxyKey"
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
                  :rules="[rules.isAddress]"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="UID"
                  v-model="remove.proxyKey"
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
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        valid: null,
        loading: false,
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
      window.wallet.daoAuth.methods.accounts()
        .call()
        .then((result) => {
          this.member.issuers = result[0]
          this.member.accounts = result[1]
        })
    },
    methods: {
      createIssuer: function () {
        if (this.$refs.formCreate.validate()) {
          let uid = window.wallet.web3.utils.keccak256(this.keys.uid)
          window.wallet.daoAuth.methods.create([this.keys.master, this.keys.payment, this.keys.verify], uid)
            .send({from: web3.eth.accounts[0]})
        }
      },
      addProxy: function () {
        window.wallet.daoAuth.methods.proxyAdd(this.add.account, this.add.proxyKey)
          .send({from: web3.eth.accounts[0]})
      },
      removeProxy: function () {
        window.wallet.daoAuth.methods.proxyRemove(this.add.account, this.add.proxyKey)
          .send({from: web3.eth.accounts[0]})
      }
    }
  }
</script>
