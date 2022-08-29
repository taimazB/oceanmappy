<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-subheader>Min/Max Current Speed</v-subheader>
        <v-card-text>
          <v-row>
            <v-col class="px-4">
              <v-range-slider
                v-model="range"
                :max="max"
                :min="min"
                hide-details
                class="align-center"
                step=".05"
                thumb-label="always"
              >
              </v-range-slider>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  props: ['field'],

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      range: [0, 1],
      min:0,
      max:3,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    dialog: {
      get() {
        return this.$store.state.map.showSettings
      },
      set() {
        this.$store.commit('map/setShowSettings', false)
      },
    },

    selected() {
      return this.$store.state.layers.selected
    },

    // min() {
    //   // if (this.selected) return this.selected.min
    //   // else return 0
    //   return 0
    // },

    // max() {
    //   // if (this.selected) return this.selected.max
    //   // else return 0
    //   return 3
    // },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    range: {
      handler() {
        this.$store.commit('map/setCurrentsMin', this.range[0])
        this.$store.commit('map/setCurrentsMax', this.range[1])
      },
      deep: true,
    },
  },
}
</script>