<template>
  <!--  <v-app>-->
  <!--    <app-header />-->
  <!--    <v-main class="d-flex flex-row align-center">-->
  <!--      <nuxt />-->
  <!--    </v-main>-->
  <!--    <app-footer v-if="$nuxt.$route.name != 'coming-soon'" />-->
  <!--  </v-app>-->
  <section>
    <app-header v-if='!is_visible' :logo='top_logo' />
    <Nuxt />
    <app-footer v-if='!is_visible' />
    <back-to-top v-if='!is_visible' />
  </section>
</template>

<script>
import Cookies from 'js-cookie'
import AppHeader from './Site/SiteHeader'
import AppFooter from './Site/SiteFooter'
import BackToTop from '@/layouts/Site/BackToTop'

export default {
  components: {
    AppHeader,
    AppFooter,
    BackToTop
  },
  data() {
    return {
      pages: ['signup', 'login', 'forgot-password', 'verify-email']
    }
  },
  computed: {
    is_visible() {
      const pageRoute = this.$nuxt.$route.name
      const loggedInUser = Cookies.get('loggedInUser')
      if (pageRoute !== 'map' && loggedInUser === 'try') {
        Cookies.remove('ocean_auth_token')
        Cookies.remove('loggedInUser')
      }
      return this.pages.includes(pageRoute)
    },
    top_logo() {
      // const logo = this.$nuxt.$route.name
      const mainLogo = require('~/assets/images/oceangns.png')
      // const darkLogo = require('~/assets/images/oceangnsDark.png')
      // return logo === 'index' ? mainLogo : darkLogo
      return mainLogo
    }
  }
}
</script>
