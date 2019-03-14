<template>
  <v-app dark>
    <v-toolbar app flat>
      <v-toolbar-title class="headline text-uppercase" v-html="title"/>
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
    <v-footer
      app
      height="auto"
    >
      <v-card
        class="flex site-footer"
        flat
      >    
        <v-card-actions class="justify-center" v-html="footer"/>
      </v-card>
    </v-footer>
    
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
      title: 'DaoAuth',
      footer: '&copy;2018<span class="ml-1 mr-1 font-weight-black">·</span><strong>daoauth.com</strong>',
    }
  }
}
</script>
