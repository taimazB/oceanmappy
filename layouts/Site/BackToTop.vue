<template>
  <section v-if="scroll && !$store.state.is_hidden" id="backtotop"><a @click="backToTop"></a></section>
</template>

<script>
export default {
  data() {
    return {
      scroll: false,
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  created() {
    if (process.browser) {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    // get scroll
    handleScroll() {
      if (window.scrollY > 100) {
        this.scroll = true
      }
      if (window.scrollY < 100) {
        this.scroll = false
      }
    },
    backToTop() {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  },
}
</script>
