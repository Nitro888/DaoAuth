<template>
  <v-card>
    <v-card-title primary-title>
      <span class="mono font-weight-medium">
        {{ title }}
      </span>
    </v-card-title>
    <!--
    <v-card-text>{{ dialog.fullName }}</v-card-text>
    -->
    <v-container fluid>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-for="(item, index) in agrs"
          :key="index"
          v-model="item.model"
          class="mono"
          :label="item.label"
          :rules="notEmpty"
          required
          @input="estimateGas"
        />
        <v-textarea
          readonly
          outline
          class="mono mt-2"
          :label="dialog.returns"
          :value="result"
        />
      </v-form>
    </v-container>
    <v-layout v-if="dialog.obj.type=='function'">
      <v-spacer />
      <v-btn flat @click.stop="$emit('hide')">
        Close
      </v-btn>
      <v-btn flat @click.stop="run">
        {{ btn }}
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      required: true
    },
    dialog: {
      type: Object,
      required: true
    }
  }, // ['address', 'dialog'],
  data: () => ({
    valid: null,
    title: '',
    agrs: [],
    notEmpty: [v => !!v || 'Required.'],
    result: '',
    btn: 'RUN'
  }),
  mounted: function () {
    // console.log(this.dialog.obj)
    // this.title = this.dialog.obj.type + ' ' + this.dialog.obj.name
    this.title = this.dialog.name
    this.agrs = []
    for (let i = 0; i < this.dialog.obj.inputs.length; i++) {
      this.agrs.push({ model: '', label: this.dialog.obj.inputs[i].type + ' ' + this.dialog.obj.inputs[i].name })
    }
    this.btn = this.dialog.obj.constant ? 'Call' : 'Send'
  },
  methods: {
    estimateGas: function () {
      if (this.$refs.form.validate()) {
        this.result = ''
        try {
          const encodeABI = window.wallet.abiQR.encodeFunctionCall({ to: this.address, json: this.dialog.obj, parms: this.agrs })
          const that = this
          this.$emit('estimateGas', {
            callData: { to: encodeABI.to, data: encodeABI.code },
            callback: (e, r) => {
              if (!e) {
                that.result = JSON.stringify(
                  {
                    byteCode: encodeABI.code,
                    estimateGas: r
                  },
                  null,
                  2)
              } else {
                that.result = JSON.stringify(e, null, 2)
              }
            }
          })
        } catch (error) {
          this.result = JSON.stringify(error, null, 2)
        }
      }
    },
    run: function () {
      if (this.$refs.form.validate()) {
        const encodeABI = window.wallet.abiQR.encodeFunctionCall({ to: this.address, json: this.dialog.obj, parms: this.agrs })
        if (this.dialog.obj.constant) {
          const that = this
          this.$emit('call', {
            callData: { to: encodeABI.to, data: encodeABI.code },
            callback: (e, r) => {
              if (!e) {
                that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.dialog.obj.outputs, r), null, 2)
              }
            }
          })
        } else {
          const that = this
          this.$emit('send', {
            callData: { to: encodeABI.to, data: encodeABI.code },
            callback: (e, r) => {
              if (!e) {
                that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.dialog.obj.outputs, r), null, 2)
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .mono {
    font-family: 'Roboto Mono', monospace;
  }
</style>
