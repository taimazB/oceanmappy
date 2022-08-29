<template>
  <v-chip
  v-if="showMouseInfo"
    dark
    :style="{ position: 'absolute', top: top + 'px', left: left + 'px', 'z-index':1 }" v-html="value"
  >
  </v-chip>
</template>


<script>
export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      offset: 50,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    showMouseInfo() {
      if (this.$store.state.map.showMouseInfo && this.$store.state.layers.selected && this.value) return true
      else return false
    },

    top() {
      const y = this.$store.state.map.mouseXY.y
      if (y > global.innerHeight / 2) return y - this.offset
      else return y + this.offset
    },

    left() {
      const x = this.$store.state.map.mouseXY.x
      if (x > global.innerWidth / 2) return x - this.offset
      else return x + this.offset
    },

    value() {
      return this.$store.state.map.mouseInfoValue
    },
  },
}
</script>