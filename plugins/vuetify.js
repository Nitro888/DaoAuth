import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import '@/blockchain/ethereum'

Vue.use(Vuetify, {
  theme: {
    primary: '#ffffff',
    accent: '#ffffff',
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  }
})
