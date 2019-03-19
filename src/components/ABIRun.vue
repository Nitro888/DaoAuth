<template>
  <v-card>
    <v-card-title class="title" primary-title>{{ title }}</v-card-title>
    <!--
    <v-card-text>{{ fullName }}</v-card-text>
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
          v-if="obj.type=='function'&&obj.constant"
          :label="returns"
          :value="result"
        ></v-textarea>
      </v-form>
    </v-container>
    <v-divider/>
    <v-container>
      <v-layout v-if="obj.type=='function'">
        <v-spacer></v-spacer>
        <v-btn flat @click.stop="$emit('hide')">Close</v-btn>
        <v-btn flat @click.stop="run">Run</v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ['address', 'fullName', 'returns', 'obj'],
  data: () => ({
    valid: null,
    title: '',
    agrs: [],
    notEmpty: [v => !!v || 'Required.'],
    result: ''
  }),
  mounted: function () {
    this.title = this.obj.type + ' ' + this.obj.name
    this.agrs = []
    for (let i = 0; i < this.obj.inputs.length; i++) {
      this.agrs.push({ model: '', label: this.obj.inputs[i].type + ' ' + this.obj.inputs[i].name })
    }
  },
  methods: {
    run: function () {
      if (this.$refs.form.validate()) {
        let encodeABI = window.wallet.abiQR.encodeFunctionCall({ to: this.address, json: this.obj, parms: this.agrs })
        if (this.obj.constant) {
          let that = this
          this.$emit('call',
            {
              callData: { to: encodeABI.to, data: encodeABI.code },
              callback: (e, r) => {
                if (!e) {
                  that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.obj.outputs, r), null, 2)
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
                that.result = JSON.stringify(window.wallet.web3.eth.abi.decodeParameters(that.obj.outputs, r), null, 2)
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
