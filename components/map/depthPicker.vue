<template>
  <v-row
    align="center"
    justify="center"
    class="levelSlider"
    data-app
    style="width:100%"
  >
    <v-select
      v-model="selectedLevel"
      label="Level"
      :items="levelLabels"
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
      noOfLevels: 0
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    selectedLevel: {
      get() {
        return this.levelLabels[
          this.$store.state.layers.selected.levels.iLevel
        ]
      },
      set(levelLabel) {
        this.$store.commit('layers/setLevel', this.levelLabels.indexOf(levelLabel))
        this.$store.commit('map/setRedrawTrue')
      }
    },

    levelLabels() {
      // if (this.$store.state.layers.selected !== null) {
      return this.$store.state.layers.selected.levels.values
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
    this.noOfLevels =
      this.$store.state.layers.selected.levels.values.length - 1
    this.iLevel = this.noOfLevels
  }
}
</script>

<style scoped>
.v-input {
  font-size: xx-small;
}
</style>
