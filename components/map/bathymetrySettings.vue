<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" style="background:ghostwhite">
      <v-container fluid>
        <v-select
          v-model="selectedLevels"
          :items="levels"
          label="Select Contours"
          multiple
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @click="toggle">
              <v-list-item-action>
                <v-icon
                  :color="selectedLevels.length > 0 ? 'indigo darken-4' : ''"
                >
                  {{ icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Select All
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>

          <template v-slot:selection="{ level, index }">
            <v-chip v-if="index === 0">
              <span>{{ level }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text text-caption">
              (+{{ selectedLevels.length - 1 }} others)
            </span>
          </template>
        </v-select>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      selectedLevels: []
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    dialog: {
      get() {
        return this.$store.state.map.showBathymetrySettings
      },
      set() {
        this.$store.commit('map/setShowBathymetrySettings', false)
      }
    },

    levels() {
      return this.$store.state.layers.selectedBathymetry.availContourLevels
    },

    icon() {
      if (this.selectedLevels.length === this.levels.length)
        return 'mdi-close-box'
      else if (this.selectedLevels.length > 0) return 'mdi-minus-box'
      else return 'mdi-checkbox-blank-outline'
    }
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    selectedLevels: {
      handler() {
        let levels
        if (this.selectedLevels.length > 0) levels = this.selectedLevels
        else levels = ['']
        this.$store.commit('layers/setSelectedBathymetryContourLevels', levels)
      },
      deep: true
    }
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    // --- Initial bathymetry contour levels to show
    this.selectedLevels = [
      -20,
      -50,
      -100,
      -150,
      -200,
      -250,
      -300,
      -350,
      -400,
      -450,
      -500,
      -600,
      -700,
      -800,
      -900,
      -1000,
      -2000,
      -3000,
      -4000,
      -5000,
      -7500,
      -10000
    ]
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectedLevels.length === this.levels.length) {
          this.selectedLevels = []
        } else {
          this.selectedLevels = this.levels
        }
      })
    }
  }
}
</script>

<style scoped>
.v-dialog--active {
  background: ghostwhite;
  overflow: hidden;
}
</style>
