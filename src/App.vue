<template>
  <v-app dark>
    <v-toolbar app flat>
      <v-toolbar-title class="headline text-uppercase">
        DaoAuth
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        icon
        href="https://github.com/Nitro888/DaoAuth"
        target="_blank"
      >
        <v-icon>fab fa-github</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <Home/>
    </v-content>
  </v-app>
</template>

<script>
import Home from './views/Home'

export default {
  name: 'App',
  components: {
    Home
  },
  data () {
    return {
      //
    }
  }
}
</script>
