<template>
  <v-app dark>
    <v-toolbar app flat>
      <v-toolbar-title class="headline text-uppercase">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        flat
        icon
        href="https://github.com/Nitro888/DaoAuth"
        target="_blank"
      >
        <v-icon>fab fa-github</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            flat
            icon
            v-on="on"
          >
            {{ select }}
          </v-btn>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, key) in items"
            :key="key"
            @click="change(key)"
          >
            <v-list-tile-title>{{ key }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-footer
      app
      height="auto"
    >
      <v-card
        class="flex site-footer"
        flat
      >
        <v-card-actions class="justify-center">
          &copy;2018<span class="ml-1 mr-1 font-weight-black">·</span><strong>daoauth.com</strong>
        </v-card-actions>
      </v-card>
    </v-footer>

    <v-content>
      <v-container>
        <div v-for="(item, index) in contents" :key="index">
          <div class="headline mb-1 white--text font-weight-light text-xs-center">
            {{ item.title }}
          </div>
          <div class="body-2 mb-5 text-xs-center font-weight-thin noto" v-html="item.content" />
        </div>
      </v-container>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import KO from '@/document/ko.js'
import EN from '@/document/en.js'

export default {
  name: 'App',
  data: () => ({
    title: 'DaoAuth',
    items: { KO, EN },
    contents: EN,
    select: 'EN'
  }),
  methods: {
    change: function (select) {
      this.contents = this.items[select]
      this.select = select
    }
  }
}
</script>

<style scoped>
  .site-footer {
    font-family: 'Titillium Web', sans-serif;
  }
</style>
