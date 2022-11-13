<template>
  <footer class='footer footer-dark pt-5 pb-5'>
    <section class=''>
      <section class='footer-columns has-text-centered'>
        <section
          class='columns align-items-center'>
          <!-- Links -->
          <section class='footer-column column is-4'>
            <ul class='link-list d-flex flex-row flex-wrap justify-content-center align-items-center'>
              <li>
                <nuxt-link class='light-text' to='/about'>About</nuxt-link>
              </li>
              <li class='separator'> |</li>
              <li>
                <nuxt-link class='light-text' to='/resources'>Resources</nuxt-link>
              </li>
              <li class='separator'> |</li>
              <li>
                <nuxt-link class='light-text' to='/login'>Login</nuxt-link>
              </li>
              <li class='separator'> |</li>
              <li>
                <nuxt-link class='light-text' to='/signup'>Signup</nuxt-link>
              </li>
            </ul>
          </section>
          <!-- Copyright -->
          <section class='footer-column column is-4'>
            <p class='light-text is-size-6'>
              Copyright © {{ new Date().getFullYear() }}
              <a class='primary-text font-weight-bold' href='https://www.oceangns.com/'>OceanGNS</a>
              All Rights Reserved.
            </p>
          </section>
          <!-- Socials -->
          <nav class='level is-mobile column is-3 justify-content-center'>
            <section class='level-left level-social'>
              <a class='level-item' href='mailto:info@oceangns.com'>
                <span class='icon'><i class='mdi mdi-email fa-lg primary-text'></i></span>
              </a>
              <a class='level-item' href='https://www.linkedin.com/company/oceangns/' target='_blank'>
                <span class='icon'><i class='mdi mdi-linkedin fa-lg primary-text'></i></span>
              </a>
              <a class='level-item' href='https://mobile.twitter.com/oceangns' target='_blank'>
                <span class='icon'><i class='mdi mdi-twitter fa-lg primary-text'></i></span>
              </a>
            </section>
          </nav>
        </section>
      </section>
    </section>
  </footer>
</template>
<style scoped>
.separator {
  color: grey;
  margin: 0 10px
}

@media only screen and (max-width: 1263px) {
  .footer {
    min-height: auto
  }

  .footer-column {
    display: flex
  }

  .footer-column:first-of-type {
    width: 35%
  }

  .footer-column:last-of-type {
    width: 45%
  }

  .is-mobile {
    width: 15%
  }
}

@media only screen and (max-width: 916px) {
  .columns {
    flex-direction: column;
  }

  .footer-column, .is-mobile {
    width: 100% !important;
    justify-content: center
  }
}

@media only screen and (max-width: 468px) {
  footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  footer a, footer p {
    font-size: 14px
  }
}
</style>
