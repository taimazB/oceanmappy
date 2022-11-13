<template>
  <v-expansion-panels v-model="expandedCategory" accordion>
    <v-expansion-panel>
      <v-expansion-panel-header
        hide-actions
        :color="colorHeader"
        class="pl-3"
        style="min-height: 36px"
      >
        <span>Bathymetry</span>
      </v-expansion-panel-header>

      <v-expansion-panel-content class="py-3">
        <v-row style="min-height: 150px">
          <v-col cols="5" class="text-h4" style="position: relative">
            <colorBar
              :field="bathymetries"
              class="d-flex ml-4"
              style="position: absolute; height: 90%"
            >
            </colorBar>
          </v-col>

          <!-- SOURCES -->
          <v-col cols="7">
            <section v-for="(bathymetry, i) in bathymetries.models" :key="i">
              <v-row>
                <!-- MODEL -->
                <v-col cols="12" class="pr-2">
                  <v-btn
                    x-small
                    elevation="0"
                    width="100%"
                    :dark="
                      bathymetry.directory === selectedBathymetry.directory
                    "
                    @click="selectBathymetry(bathymetry.directory)"
                    >{{ bathymetry.source }}</v-btn
                  >
                </v-col>
              </v-row>

              <!-- DESCRIPTION -->
              <section
                v-show="bathymetry.source === selectedBathymetry"
                class="mb-3"
              >
                <v-row>
                  <v-col cols="12" style="font-size: x-small">
                    <span>{{ bathymetry.longName }}</span>
                    <a :href="bathymetry.link" target="_blank">more</a>
                  </v-col>
                </v-row>
              </section>
            </section>
          </v-col>
        </v-row>

        <!-- CONFIGS -->
        <!-- BATHYMETRY BOUNDARIES -->
        <v-row>
          <v-spacer />
          <v-img
          v-tooltip.auto="'Contours'"
            height="15px"
            max-width="15px"
            contain
            :src="
              showBathymetryContours
                ? require(`~/assets/images/contourOn.jpg`)
                : require(`~/assets/images/contourOff.jpg`)
            "
            @click="showBathymetryContours = !showBathymetryContours"
          >
          </v-img>
          <v-icon
            v-tooltip.auto="'Country Boundaries'"
            small
            :color="showBathymetryBoundaries ? 'success' : ''"
            @click="showBathymetryBoundaries = !showBathymetryBoundaries"
            >mdi-dots-square</v-icon
          >
        </v-row>

        <!-- <v-row v-if="showBathymetryContours" class="ma-0 pa-0 px-2">
          <v-col
            cols="4"
            class="ma-0 pa-0 pl-1 fontSizeXS"
            style="place-self: center"
          >
            Contours
          </v-col>
          <v-col cols="8" class="ma-0 pa-0">
            <v-select
              v-model="selectedContours"
              :items="availContours"
              multiple
              dense
            >
              <template v-slot:prepend-item>
                <v-list-item ripple @click="toggleBathymetry">
                  <v-list-item-action>
                    <v-icon
                      :color="
                        selectedContours.length > 0 ? 'indigo darken-4' : ''
                      "
                    >
                      {{ icon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title> Select All </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ contour, index }">
                <v-chip v-if="index === 0">
                  <span>{{ contour }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ selectedContours.length - 1 }} others)
                </span>
              </template>
            </v-select>
          </v-col>
        </v-row> -->

        <!-- BATHYMETRY OPACITY -->
        <v-row class="ma-0 pa-0 px-2">
          <v-col
            cols="4"
            class="ma-0 pa-0 pl-1 fontSizeXS"
            style="place-self: center"
          >
            Opacity
          </v-col>
          <v-col cols="8">
            <v-slider
              v-model="bathymetryOpacity"
              max="1"
              min="0"
              hide-details
              class="align-center"
              step="0.01"
            >
            </v-slider>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import colorBar from '~/components/map/colorBar'

export default {
  components: { colorBar },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      colorHeader: '#eee',
      selectedContours: [],
      expandedCategory: null,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    availContours() {
      return this.$store.state.layers.selectedBathymetry.availContours
    },

    bathymetries() {
      return this.$store.state.layers.bathymetries
    },

    selectedBathymetry() {
      return this.$store.state.layers.selectedBathymetry
    },

    showBathymetryBoundaries: {
      get() {
        return this.$store.state.map.showBathymetryBoundaries
      },
      set(status) {
        this.$store.commit('map/setShowBathymetryBoundaries', status)
      },
    },

    showBathymetryContours: {
      get() {
        return this.$store.state.map.showBathymetryContours
      },
      set(status) {
        this.$store.commit('map/setShowBathymetryContours', status)
      },
    },

    bathymetryOpacity: {
      get() {
        return this.$store.state.map.bathymetryOpacity
      },
      set(value) {
        this.$store.commit('map/setBathymetryOpacity', value)
      },
    },

    icon() {
      if (this.selectedContours.length === this.availContours.length)
        return 'mdi-close-box'
      else if (this.selectedContours.length > 0) return 'mdi-minus-box'
      else return 'mdi-checkbox-blank-outline'
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    selectedContours: {
      handler() {
        let contours
        if (this.selectedContours.length > 0) contours = this.selectedContours
        else contours = ['']
        this.$store.commit('map/setSelectedBathymetryContours', contours)
      },
      deep: true,
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.selectedContours = [
      -20, -50, -100, -150, -200, -250, -300, -350, -400, -450, -500, -600,
      -700, -800, -900, -1000, -2000, -3000, -4000, -5000, -7500, -10000,
    ]
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    selectBathymetry(source) {
      this.$store.commit('layers/setSelected', null)
      this.$store.commit('layers/setSelectedBathymetry', source)
    },

    toggleBathymetry() {
      this.$nextTick(() => {
        if (this.selectedContours.length === this.availContours.length) {
          this.selectedContours = []
        } else {
          this.selectedContours = this.availContours
        }
      })
    },
  },
}
</script>

<style scoped>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
/* 
  .v-expansion-panel-header {
    font-size: var(--fontSize) !important;
  } */

.mobileFontSize {
  font-size: 0.5rem;
}

.row {
  padding: 0;
  margin: 0;
}

.col {
  padding: 0;
  margin: 0;
}

.fontSizeXS {
  font-size: x-small !important;
}
</style>
