import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    tuvaq2Url: process.env.NODE_ENV === "development" ?
    "https://192.168.2.12:4000" : "https://process.oceangns.com",
  },

  head: {
    titleTemplate: '%s - OceanMappy',
    title: 'Ocean Mappy',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      {
        href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css',
        rel: 'stylesheet'
      },
      {
        href:
          'https://cdn.jsdelivr.net/npm/vue-mapbox@latest/dist/vue-mapbox.css',
        rel: 'stylesheet'
      },
      {
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap',
        rel: 'stylesheet'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/css/custom',
    'assets/css/style',
    'assets/css/global',
    'node_modules/vue-multiselect/dist/vue-multiselect.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vee-validate.js', ssr: false },
    // { src: '~/plugins/ga.js', mode: 'client' },
    { src: '~/plugins/underscore', ssr: false },
    { src: '~/plugins/functions', ssr: false },
    // { src: '~/plugins/mapbox', mode: 'client' },
    { src: '@/plugins/aos', ssr: false },
    { src: '~/plugins/vue-editor', ssr: false },
    { src: '~/plugins/vue-multiselect', ssr: false },
    { src: '~/plugins/GoogleAnalytics.js', mode: 'client' },
    { src: '~/plugins/vTooltip.js', mode: 'client' },
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/numericInput.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-fonts'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: {
        family: 'Poppins'
      }
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  googleFonts: {
    families: {
      Estonia: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules']
  }
}
