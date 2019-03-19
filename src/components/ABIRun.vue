<template>
  <v-card>
    <v-card-title class="title grey darken-2" primary-title>{{ title }}</v-card-title>
    <!--
    <v-card-text>{{ dialog.fullName }}</v-card-text>
    -->
    <v-container fluid>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-for="(item, index) in agrs"
          v-bind:key="index"
          v-model="item.model"
          :label="item.label"
          :rules="notEmpty"
          required
        ></v-text-field>
        <v-textarea
          readonly
          outline
          v-if="dialog.obj.type=='function'&&dialog.obj.constant"
          :label="dialog.returns"
          :value="result"
        ></v-textarea>
      </v-form>
    </v-container>
    <v-divider/>
    <v-layout v-if="dialog.obj.type=='function'">
      <v-spacer></v-spacer>
      <v-btn flat @click.stop="$emit('hide')">Close</v-btn>
      <v-btn flat @click.stop="run">Run</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: ['address', 'dialog'],
  data: () => ({
    valid: null,
    title: '',
    agrs: [],
    notEmpty: [v => !!v || 'Required.'],
    result: ''
  }),
  mounted: function () {
    // console.log(this.dialog.obj)
    // this.title = this.dialog.obj.type + ' ' + this.dialog.obj.name
    this.title = this.dialog.name
    this.agrs = []
    for (let i = 0; i < this.dialog.obj.inputs.length; i++) {
      this.agrs.push({ model: '', label: this.dialog.obj.inputs[i].type + ' ' + this.dialog.obj.inputs[i].name })
    }
  },
  methods: {
    run: function () {
      if (this.$refs.form.validate()) {
        let encodeABI = window.wallet.abiQR.encodeFunctionCall({ to: this.address, json: this.dialog.obj, parms: this.agrs })
        if (this.dialog.obj.constant) {
          let that = this
          this.$emit('call',
            {
              callData: { to: encodeABI.to, data: encodeABI.code },
              callback: (e, r) => {
                if (!e) {
                  that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.dialog.obj.outputs, r), null, 2)
                }
              }
            }
          )
        } else {
          let that = this
          this.$emit('send', {
            callData: { to: encodeABI.to, data: encodeABI.code },
            callback: (e, r) => {
              if (!e) {
                that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.dialog.obj.outputs, r), null, 2)
              }
            }
          }
          )
        }
      }
    }
  }
}
</script>
