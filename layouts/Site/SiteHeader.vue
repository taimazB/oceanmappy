<template>
  <section class='hero product-hero parallax is-cover is-relative is-default is-bold'>
    <section v-show='!$store.state.is_hidden'
             :class="[scroll ? 'translateDown navbar-sticky' : 'navbar-fade' , 'navbar-wrapper navbar-light']">
      <section class='hero-head'>
        <!-- Nav -->
        <section class='container pa-0'>
          <nav class='nav'>
            <section class='container big'>
              <section class='d-flex flex-row justify-content-between w-100'>
                <section class='d-flex'>
                  <nuxt-link class='nav-item' to='/'>
                    <img v-if='!scroll' :src='logo' alt='OceanGNS' class='light-logo'
                         width='150'>
                    <img v-else alt='OceanGNS' class='light-logo' src='~/assets/images/oceangns-b.png' width='150'>
                  </nuxt-link>
                  <nuxt-link class='nav-item is-tab nav-inner is-not-mobile font-weight-bold' to='/about'>
                    About
                  </nuxt-link>
                  <nuxt-link class='nav-item is-tab nav-inner is-not-mobile font-weight-bold' to='/resources'>
                    Resources
                  </nuxt-link>
                  <nuxt-link v-if='!user' class='nav-item is-tab nav-inner is-not-mobile font-weight-bold' to='/signup'>
                    Signup
                  </nuxt-link>
                </section>
                <section class='nav-item'>
                  <nuxt-link v-if="user && user.user.role != ''"
                             :class="[scroll ? 'primary-btn secondary-btn' : 'light-btn' ,'button button-signup btn-align rounded btn-outlined is-bold nav-item is-not-mobile']"
                             to='/map'>

                    Map
                  </nuxt-link>
                  <nuxt-link v-else
                             :class="[scroll ? 'primary-btn secondary-btn' : 'light-btn' ,'button button-signup btn-align rounded btn-outlined is-bold nav-item is-not-mobile']"
                             to='/login'>

                    Login
                  </nuxt-link>
                </section>
              </section>
              <!-- Responsive toggle -->
              <span :class="[toggle ? 'is-active' : '' ,'nav-toggle']" @click='toggle_menu'>
                  <span></span>
                  <span></span>
                  <span></span>
              </span>
              <section :class="[toggle ? 'is-active' : '' ,'nav-right nav-menu']">
                <nuxt-link class='nav-item is-tab nav-inner is-menu-mobile' to='/about' @click='toggle_menu'>
                  About
                </nuxt-link>
                <nuxt-link class='nav-item is-tab nav-inner is-menu-mobile' to='/resources' @click='toggle_menu'>
                  Resources
                </nuxt-link>
                <nuxt-link class='nav-item is-tab nav-inner is-menu-mobile' to='/signup' @click='toggle_menu'>
                  Signup
                </nuxt-link>
                <nuxt-link v-if="user && user.user.role != ''" class='nav-item is-tab nav-inner is-menu-mobile'
                           to='/map' @click='toggle_menu'>
                  Map
                </nuxt-link>
                <nuxt-link v-else class='nav-item is-tab nav-inner is-menu-mobile' to='/login' @click='toggle_menu'>
                  Login
                </nuxt-link>
              </section>
            </section>
          </nav>
        </section>
        <!-- /Nav -->
      </section>
    </section>
  </section>
</template>
<script>
import Cookies from 'js-cookie'

export default {
  props: ['logo'],
  data() {
    return {
      scroll: false,
      toggle: false
    }
  },
  computed: {
    user() {
      return this.$store.state.profile
    }
  },
  watch: {
    $route() {
      this.toggle = false
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  created() {
    let token = ''
    if (process.browser) {
      token = localStorage.getItem('ocean_auth_token')
      window.addEventListener('scroll', this.handleScroll)
    } else {
      token = Cookies.get('ocean_auth_token')
    }
    this.$store.commit('getProfileData', token)
  },
  methods: {
    // get scroll
    handleScroll() {
      if (window.scrollY > 50) {
        this.scroll = true
      }
      if (window.scrollY < 50) {
        this.scroll = false
      }
    },
    toggle_menu() {
      this.toggle = !this.toggle
    }
  }
}
</script>
<style scoped>
nav {
  box-shadow: none !important
}

.nav-item.is-not-mobile {
  font-size: 1.2rem;
}

.navbar-wrapper {
  position: fixed;
}

img {
  max-height: inherit
}

@media only screen and (max-width: 768px) {
  /*nav {*/
  /*  background-color: rgba(38, 47, 57, 1) !important*/
  /*}*/
}
</style>
