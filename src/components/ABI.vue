<template>
  <div>
    <v-layout row wrap>
      <v-flex xs4>
        <div class="headline font-weight-light">Contract</div>
      </v-flex>
      <v-flex xs8>
        <v-form ref="formContract" v-model="valid" lazy-validation>
          <v-text-field
            v-model="address"
            label="Contract Address"
            class="mono"
            :rules="[rules.isAddress]"
          ></v-text-field>
          <v-layout justify-end>
            <v-btn flat @click.stop="load()">Load</v-btn>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex xs4>
        <div class="headline font-weight-light">Source</div>
      </v-flex>
      <v-flex xs8>
        <v-form>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                readonly
                v-model="contract.name"
                label="Contract Name"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                readonly
                v-model="contract.optimization"
                label="Optimization Enabled"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                readonly
                v-model="contract.compiler"
                label="Compiler Version"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                readonly
                v-model="contract.runs"
                label="Runs (Optimizer)"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Source</div>
            </template>
            <v-container>
              <v-text-field
                readonly
                v-model="contract.swarm"
                class="mono"
                label="Swarm Source"
              ></v-text-field>
              <v-textarea
                readonly
                outline
                rows='25'
                label="Contract Source Code"
                class="mono-small"
                :value="contract.code"
              ></v-textarea>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-divider class="mb-3 mt-3"/>
    <v-layout row wrap>
      <v-flex xs4>
        <div class="headline font-weight-light">ABI</div>
      </v-flex>
      <v-flex xs8>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Json</div>
            </template>
            <v-container>
              <v-textarea
                readonly
                outline
                rows='10'
                label="Contract ABI"
                class="mono-small"
                :value="contract.abi"
              ></v-textarea>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Function</div>
            </template>
            <v-container>
              <v-list two-line subheader>
                <v-list-tile
                  v-for="(item, index) in ncf"
                  v-bind:key="index"
                  @click="runNCF(item.obj)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="mono">{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-chip v-if="item.payable" label disabled color="red" text-color="white">Payable</v-chip>
                      <span class="mono">{{ item.returns }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Constant Function</div>
            </template>
            <v-container>
              <v-list two-line subheader>
                <v-list-tile
                  v-for="(item, index) in cf"
                  v-bind:key="index"
                  @click="runCF(item.obj)"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="mono">{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-chip v-if="item.payable" label disabled color="red" text-color="white">Payable</v-chip>
                      <span class="mono">{{ item.returns }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-container>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title font-weight-light">Event</div>
            </template>
            <v-container>
              <v-list two-line subheader>
                <!--
                <v-list-tile
                  v-for="(item, index) in e"
                  v-bind:key="index"
                  @click="runEvent(item.obj)"
                >
                -->
                <v-list-tile
                  v-for="(item, index) in e"
                  v-bind:key="index"
                  :href="getUrl(item.obj)"
                  target="_blank"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="mono">{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title class="mono">{{ item.returns }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-divider class="mb-3 mt-3"/>
    <v-dialog v-model="dialog.show" persistent max-width="640">
      <component
      v-bind:is="dialog.body"
      v-bind:address="address"
      v-bind:dialog="dialog"
      @hide="dialog.show=false;dialog.body=null;dialog.obj=null"
      @call="(e)=>$emit('call',e)"
      @send="(e)=>$emit('send',e)"
      @estimateGas="(e)=>$emit('estimateGas',e)"
    ></component>
    </v-dialog>
  </div>
</template>

<script>
import ABIRun from '@/components/ABIRun'

export default {
  data: () => ({
    valid: null,
    address: '',
    cf: [],
    ncf: [],
    e: [],
    abi: [],
    source: {},
    contract: {
      show: false,
      name: '',
      compiler: '',
      optimization: '',
      runs: '',
      code: '',
      swarm: '',
      abi: ''
    },
    dialog: {
      run: false,
      fullName: '',
      body: null,
      obj: null
    },
    rules: {
      isAddress: value => window.wallet.isAddress(value) || 'Is not address.'
    }
  }),
  methods: {
    load: function () {
      if (this.$refs.formContract.validate()) {
        this.contract.name = ''
        this.contract.compiler = ''
        this.contract.optimization = ''
        this.contract.runs = ''
        this.contract.code = ''
        this.contract.swarm = ''
        this.contract.abi = ''
        window.wallet.logs.loadSource(web3.currentProvider.networkVersion, this.address) // eslint-disable-line
          .catch(console.log)
          .then((r) => {
            if (r.length > 0) {
              this.source = r[0]
              // console.log(this.source)
              this.contract.name = this.source.ContractName
              this.contract.compiler = this.source.CompilerVersion
              this.contract.optimization = this.source.OptimizationUsed === '1' ? 'true' : 'false'
              this.contract.runs = this.source.Runs
              this.contract.code = this.source.SourceCode
              this.contract.swarm = this.source.SwarmSource
              this.createInterface()
            } else {
              window.wallet.logs.loadABI(web3.currentProvider.networkVersion, this.address) // eslint-disable-line
                .catch(console.log)
                .then((r) => {
                  this.source.ABI = r
                  this.createInterface()
                })
            }
          })
      }
    },
    createInterface: function () {
      this.abi = JSON.parse(this.source.ABI)
      this.contract.abi = JSON.stringify(this.abi, null, 2)
      this.ui = []
      for (let i = 0; i < this.abi.length; i++) {
        this.create(this.abi[i])
      }
    },
    arguments: function (args) {
      let result = ''
      if (typeof args !== 'undefined') {
        for (let i = 0; i < args.length; i++) {
          result += (i > 0 ? ', ' : '') + args[i].type +
            (typeof args[i].indexed !== 'undefined' && args[i].indexed ? ' indexed' : '') +
            (args[i].name !== '' ? ' ' + args[i].name : '')
        }
      }
      return '(' + result + ')'
    },
    getName: function (obj) {
      return obj.name + this.arguments(obj.inputs)
    },
    create: function (obj) {
      let title = obj.type + ' ' + this.getName(obj)
      switch (obj.type) {
        case 'function':
          let returns = this.arguments(obj.outputs)
          returns = returns === '()' ? '' : ((obj.payable ? ' returns ' : 'returns ') + returns)
          if (obj.constant) {
            this.cf.push({ title, returns, payable: obj.payable, obj })
          } else {
            this.ncf.push({ title, returns, payable: obj.payable, obj })
          }
          break
        case 'event':
          this.e.push({ title, obj })
          break
        default:
          console.log(obj)
          break
      }
    },
    runNCF: function (obj) {
      this.dialog.name = this.getName(obj)
      this.dialog.fullName = obj.type + ' ' + this.dialog.name
      this.dialog.obj = obj
      this.dialog.body = ABIRun
      this.dialog.returns = 'Estimate gas'
      this.dialog.show = !this.dialog.show
    },
    runCF: function (obj) {
      this.dialog.name = this.getName(obj)
      this.dialog.fullName = obj.type + ' ' + this.dialog.name
      this.dialog.obj = obj
      this.dialog.body = ABIRun
      this.dialog.returns = 'returns ' + this.arguments(obj.outputs)
      this.dialog.show = !this.dialog.show
    },
    runEvent: function (obj) {
      let topics = 'topic0=' + window.wallet.abiQR.encodeEventSignature(obj)
      window.wallet.logs.getLogs(web3.currentProvider.networkVersion, this.address, topics) // eslint-disable-line
        .catch(console.log)
        .then(console.log)
    },
    getUrl: function (obj) {
      let topics = 'topic0=' + window.wallet.abiQR.encodeEventSignature(obj)
      return window.wallet.logs.getUrl(web3.currentProvider.networkVersion, this.address, topics) // eslint-disable-line
    }
  }
}
</script>

<style scoped>
  .mono {
    font-family: 'Roboto Mono', monospace;
  }
  .mono-small {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9em;
  }
</style>
