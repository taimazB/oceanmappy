import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    graphUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/graphql'
        : 'https://api.oceangns.com/brd-ocean-methods',
    //  : 'http://localhost:4000/graphql',
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://api.oceangns.com',
    // : 'http://localhost:4000',
    tuvaq2Url:
      process.env.NODE_ENV === 'development'
        ? 'https://glidercruncher1.local:4000'
        : 'https://process.oceangns.com'
  },

  head: {
    titleTemplate: '%s - OceanGNS',
    title: 'OceanGNS',
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
    'vue-slick-carousel/dist/vue-slick-carousel.css',
    'vue-slick-carousel/dist/vue-slick-carousel-theme.css',
    'assets/css/custom',
    'assets/css/style',
    'assets/css/global',
    'assets/css/tooltip',
    'assets/css/bulma.css',
    'assets/css/core_demo.css',
    'assets/css/icons.min.css',
    'assets/css/core_flashy.css',
    'assets/css/custom_bulma.css',
    'node_modules/vue-multiselect/dist/vue-multiselect.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-editor', ssr: false },
    { src: '~/plugins/vue-slick-carousel.js',ssr:false},
    { src: '~/plugins/leaflet.js', ssr: false },
    // { src: '~/plugins/ga.js', mode: 'client' },
    { src: '~/plugins/vee-validate.js', ssr: false },
    { src: '~/plugins/underscore', ssr: false },
    // { src: '~/plugins/mapbox', mode: 'client' },
    { src: '~/plugins/functions', ssr: false },
    { src: '@/plugins/aos', ssr: false },
    { src: '~/plugins/vue-multiselect', ssr: false },
    { src: '~/plugins/vue-carousel', ssr: false },
    { src: '~/plugins/vue-quill-editor', ssr: false },
    { src: '~/plugins/GoogleAnalytics.js', mode: 'client' },
    { src: '~/plugins/sse.js', mode: 'client' },
    { src: '~/plugins/vTooltip.js', mode: 'client' },
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/numericInput.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    'nuxt-leaflet',
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
    // extend(config, { isDev, isClient }) {
    //   config.node = {
    //     fs: 'empty'
    //   }
    // },
    transpile: ['vee-validate/dist/rules']
  }
}
