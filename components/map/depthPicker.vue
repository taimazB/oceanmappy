<template>
  <v-row
    align="center"
    justify="center"
    class="depthSlider"
    data-app
    style="width:100%"
  >
    <v-select
      v-model="selectedDepth"
      label="Depth"
      :items="depthLabels"
      menu-props="auto"
      hide-details
      single-line
      dense
    ></v-select>
  </v-row>
</template>

<script>
export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      noOfDepthLayers: 0
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    selectedDepth: {
      get() {
        return this.depthLabels[
          this.$store.state.layers.selected.depthProperties.iDepth
        ]
      },
      set(depthLabel) {
        this.$store.commit('layers/setDepth', this.depthLabels.indexOf(depthLabel))
        this.$store.dispatch('map/setRedrawTrue')
      }
    },

    depthLabels() {
      // if (this.$store.state.layers.selected !== null) {
      return this.$store.state.layers.selected.depthProperties.depthLabels
      // } else {
      //   return ['0050']
      // }
    }
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {},

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.noOfDepthLayers =
      this.$store.state.layers.selected.depthProperties.depthValues.length - 1
    this.iDepth = this.noOfDepthLayers
  }
}
</script>

<style scoped>
.v-input {
  font-size: xx-small;
}

/* @import 'assets/css/map.css'; */

/* .depthSlider {
  align-content: center;
}

.depthSlider .v-slider--vertical .v-slider__ticks-container {
  left: 20%;
}

.depthSlider .v-slider__tick-label,
.depthSlider .v-slider__tick,
.depthSlider .v-slider__ticks-container {
  width: 100% !important;
}

.depthSlider .v-slider__tick-label {
  text-align: right;
}

.depthSlider .v-slider__tick {
  background: none;
} */
</style>
