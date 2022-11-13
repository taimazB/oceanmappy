<template>
  <section
    style="
      position: absolute;
      top: 0;
      background: rgba(255, 255, 255, 1);
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    "
  >
    <v-expansion-panels v-model="expandedField" accordion>
      <!-- BATHYMETRY -->
      <v-expansion-panel>
        <v-expansion-panel-header
          hide-actions
          :color="colorHeader"
          class="pl-3"
        >
          <span style="font-weight: bold">Bathymetry</span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="py-3">
          <v-row style="min-height: 150px">
            <v-col cols="5" class="text-h4" style="position: relative">
              <!-- COLORBAR -->
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
                        bathymetry.modelDir === selectedBathymetry.modelDir
                      "
                      @click="selectBathymetry(bathymetry.modelDir)"
                      >{{ bathymetry.source }}</v-btn
                    >
                  </v-col>
                  <!-- <v-col cols="2" style="font-weight: bold">{{
                    bathymetry.region
                  }}</v-col> -->
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
          <v-row class="ma-0 pa-0 px-2">
            <v-col
              cols="4"
              class="ma-0 pa-0 pl-1 fontSizeXS"
              style="place-self: center"
            >
              Boundaries
            </v-col>
            <v-col cols="8" class="ma-0 pa-0">
              <v-switch
                v-model="showBathymetryBoundaries"
                inset
                dense
                :hide-details="true"
                class="ma-0 pa-0"
                style="float: right"
              >
              </v-switch>
            </v-col>
          </v-row>

          <!-- BATHYMETRY CONTOURS -->
          <v-row class="ma-0 pa-0 px-2">
            <v-col
              cols="4"
              class="ma-0 pa-0 pl-1 fontSizeXS"
              style="place-self: center"
            >
              Contours
            </v-col>
            <v-col cols="8" class="ma-0 pa-0">
              <v-switch
                v-model="showBathymetryContours"
                inset
                dense
                :hide-details="true"
                class="ma-0 pa-0"
                style="float: right"
              >
              </v-switch>
            </v-col>
          </v-row>

          <v-row v-if="showBathymetryContours" class="ma-0 pa-0 px-2">
            <v-col
              cols="4"
              class="ma-0 pa-0 pl-1 fontSizeXS"
              style="place-self: center"
            >
              Levels
            </v-col>
            <v-col cols="8" class="ma-0 pa-0">
              <v-select v-model="selectedLevels" :items="levels" multiple dense>
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="toggleBathymetry">
                    <v-list-item-action>
                      <v-icon
                        :color="
                          selectedLevels.length > 0 ? 'indigo darken-4' : ''
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

                <template v-slot:selection="{ level, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ level }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ selectedLevels.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>

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

      <!-- MODELS -->
      <v-expansion-panel v-for="(field, i) in fields" :key="i">
        <v-expansion-panel-header
          hide-actions
          :color="colorHeader"
          class="pl-3"
        >
          <span style="font-weight: bold">{{ field.field }}</span>
          <span style="font-style: italic">
            {{
              i === expandedField - 1 && field.longName ? field.longName : ''
            }}
          </span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="py-3">
          <v-row style="min-height: 150px">
            <v-col cols="5" class="text-h4" style="position: relative">
              <!-- COLORBAR -->
              <colorBar
                :field="field"
                class="d-flex ml-4"
                style="position: absolute; height: 90%"
              >
              </colorBar>
              <!-- <colorBar
                v-if="field.field !== 'Currents'"
                :colors="colors(field)"
                :unit="field.unit"
                class="d-none d-sm-flex ml-4"
                style="position:absolute; height: 90%;"
              >
              </colorBar> -->
            </v-col>

            <!-- MODELS -->
            <v-col cols="7">
              <section v-for="(model, j) in field.models" :key="j">
                <v-row>
                  <!-- MODEL -->
                  <v-col cols="12" class="pr-2">
                    <v-btn
                      x-small
                      elevation="0"
                      width="100%"
                      :dark="
                        field.field === selectedField &&
                        model.modelDir === selectedModel.modelDir
                      "
                      @click="selectModel(field.field, model.modelDir)"
                      >{{ model.btnText }}</v-btn
                    >
                  </v-col>
                  <!-- <v-col cols="2" style="font-weight: bold">{{
                    model.region
                  }}</v-col> -->
                </v-row>

                <!-- DESCRIPTION -->
                <section
                  v-show="
                    field.field === selectedField &&
                    model.modelDir === selectedModel.modelDir
                  "
                  class="mb-3"
                >
                  <v-row>
                    <v-col cols="6" style="font-size: x-small">Unit:</v-col>
                    <v-col
                      cols="6"
                      class="fontSizeXS"
                      v-html="field.unit"
                    ></v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" style="font-size: x-small"
                      >last updated:</v-col
                    >
                    <v-col
                      cols="6"
                      :style="{
                        'font-size': 'x-small',
                        color: `${lastProcessedColor(model.lastProcessed)}`,
                      }"
                      >{{ model.lastProcessed }} hr ago</v-col
                    >
                  </v-row>

                  <v-row>
                    <v-col cols="12" style="font-size: x-small">
                      <span>{{ model.longName }}</span>
                      <a :href="model.link" target="_blank">more</a>
                    </v-col>
                  </v-row>
                </section>
              </section>
            </v-col>
          </v-row>

          <!-- CURRENTS CONFIG -->
          <section v-if="field.field === selectedField">
            <section
              v-if="field.field === 'Currents' || field.field === 'Wind'"
              class="ma-0 pa-0 px-2 pt-4"
            >
              <v-row>
                <v-spacer></v-spacer>
                <v-btn
                  fab
                                    width="20px"
                  height="20px"
                  elevation="0"
                  :color="currentsDirectionOn ? 'primary' : ''"
                  @click="currentsDirectionOn = !currentsDirectionOn"
                >
                  <v-icon x-small>mdi-arrow-top-right</v-icon>
                </v-btn>
                <v-btn
                  v-if="currentsDirectionOn"
                  fab
                  width="20px"
                  height="20px"
                  elevation="0"
                  :color="currentsAnimationOn ? 'primary' : ''"
                  @click="currentsAnimationOn = !currentsAnimationOn"
                >
                  <v-icon x-small>mdi-transition</v-icon>
                </v-btn>
                <v-btn
                  v-if="currentsDirectionOn"
                  fab
                  width="20px"
                  height="20px"
                  elevation="0"
                  :color="currentsLocked ? 'primary' : ''"
                  @click="currentsLocked = !currentsLocked"
                >
                  <v-icon x-small>{{
                    currentsLocked ? 'mdi-lock' : 'mdi-lock-open-variant'
                  }}</v-icon>
                  <!-- <v-icon>mdi-lock</v-icon> -->
                </v-btn>
              </v-row>
              <!-- <v-row>
                <v-col
                  cols="4"
                  class="ma-0 pa-0 pl-1 fontSizeXS"
                  style="place-self: center"
                >
                  Direction
                </v-col>
                <v-col cols="8" class="ma-0 pa-0">
                  <v-switch
                    v-model="currentsDirectionOn"
                    inset
                    dense
                    hide-details
                    class="ma-0 pa-0"
                    style="float: right"
                  >
                  </v-switch>
                </v-col>
              </v-row>

              <v-row v-if="currentsDirectionOn">
                <v-col
                  cols="4"
                  class="ma-0 pa-0 pl-1 fontSizeXS"
                  style="place-self: center"
                >
                  Animation
                </v-col>
                <v-col cols="8" class="ma-0 pa-0">
                  <v-switch
                    v-model="currentsAnimationOn"
                    inset
                    dense
                    hide-details
                    class="ma-0 pa-0"
                    style="float: right"
                  >
                  </v-switch>
                </v-col>
              </v-row> -->

              <v-row v-if="currentsDirectionOn && !currentsAnimationOn">
                <v-col
                  cols="6"
                  class="ma-0 pa-0 pl-1 fontSizeXS"
                  style="place-self: center"
                >
                  Arrow's Range</v-col
                >
                <v-col cols="6" class="px-4">
                  <v-range-slider
                    v-model="currentsRange"
                    :max="currentsMax"
                    :min="currentsMin"
                    hide-details
                    class="align-center"
                    step=".05"
                    :thumb-label="true"
                  >
                  </v-range-slider>
                </v-col>
              </v-row>
            </section>

            <!-- LAYER OPACITY -->
            <v-row class="ma-0 pa-0 px-2">
              <v-col
                cols="4"
                class="ma-0 pa-0 pl-1 fontSizeXS"
                style="place-self: center"
                >Opacity</v-col
              >
              <v-col cols="8">
                <v-slider
                  v-model="activeLayerOpacity"
                  max="1"
                  min="0"
                  hide-details
                  class="align-center"
                  step="0.01"
                >
                </v-slider>
              </v-col>
            </v-row>
          </section>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- ALTIMETRY -->
      <v-expansion-panel>
        <v-expansion-panel-header
          hide-actions
          :color="colorHeader"
          class="pl-3"
        >
          <span style="font-weight: bold">Altimetry</span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="py-3">
          <altimetry />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- AIS -->
      <v-expansion-panel>
        <v-expansion-panel-header
          hide-actions
          :color="colorHeader"
          class="pl-3"
        >
          <span style="font-weight: bold">AIS</span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="py-3">
          <AIS />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>
</template>

<script>
// import settings from './settings.vue'
// import bathymetrySettings from './bathymetrySettings.vue'
import colorBar from '~/components/map/colorBar'
import altimetry from '~/components/map/layers/altimetry/altimetry.vue'
import AIS from '~/components/map/layers/AIS/AIS.vue'

export default {
  components: { colorBar, altimetry, AIS },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      activeTools: [],
      cssProps: {},
      layerHover: false,
      selectedNOAAbathymetry: null,
      expandedField: null,
      selectedLevels: [],
      colorHeader: '#eee',
      currentsMin: 0,
      currentsMax: 3,
      currentsRange: [0, 1],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    bathymetries() {
      return this.$store.state.layers.bathymetries
    },

    selectedBathymetry() {
      return this.$store.state.layers.selectedBathymetry
    },

    selectedField() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected.field
    },

    selectedModel() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected
    },

    fields() {
      return this.$store.state.layers.fields.filter((field) => field.show)
    },

    availTimes() {
      if (this.$store.state.map.availDateTimes.length > 0) {
        return this.$store.state.map.availDateTimes
          .filter((d) => d.date === this.$store.state.map.selectedDate)
          .map((d) => d.time)
      } else {
        return []
      }
    },

    // styleBathymetry() {
    //   return {
    //     background: `linear-gradient(to right, #272727 0%, #272727 ${this.$store
    //       .state.map.bathymetryOpacity * 100}%, #f5f5f5 ${this.$store.state.map
    //       .bathymetryOpacity * 100}%, #f5f5f5 100%)`,
    //     'align-self': 'center'
    //   }
    // },

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

    activeLayerOpacity: {
      get() {
        return this.$store.state.map.activeLayerOpacity
      },
      set(value) {
        this.$store.commit('map/setActiveLayerOpacity', value)
      },
    },

    // sectionWidth() {
    //   return Object.keys(this.$refs).length > 0
    //     ? this.$refs.layersControlSection.clientWidth
    //     : '10px'
    // },

    // NOAAbathymetries(){
    //   return this.$store.state.layers.NOAAbathymetries
    // }

    icon() {
      if (this.selectedLevels.length === this.levels.length)
        return 'mdi-close-box'
      else if (this.selectedLevels.length > 0) return 'mdi-minus-box'
      else return 'mdi-checkbox-blank-outline'
    },

    // BATHYMETRY
    levels() {
      return this.$store.state.layers.selectedBathymetry.availContourLevels
    },

    currentsDirectionOn: {
      get() {
        return this.$store.state.map.currentsDirectionOn
      },
      set(status) {
        this.$store.commit('map/setCurrentsDirectionOn', status)
      },
    },

    currentsAnimationOn: {
      get() {
        return this.$store.state.map.currentsAnimationOn
      },
      set(status) {
        this.$store.commit('map/setCurrentsAnimationOn', status)
      },
    },

    currentsLocked: {
      get() {
        return this.$store.state.map.currentsLocked
      },
      set(status) {
        this.$store.commit('map/setCurrentsLocked', status)
      },
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  watch: {
    // BATHYMETRY
    selectedLevels: {
      handler() {
        let levels
        if (this.selectedLevels.length > 0) levels = this.selectedLevels
        else levels = ['']
        this.$store.commit('map/setSelectedBathymetryContours', levels)
      },
      deep: true,
    },

    currentsRange: {
      handler() {
        this.$store.commit('map/setCurrentsMin', this.currentsRange[0])
        this.$store.commit('map/setCurrentsMax', this.currentsRange[1])
      },
      deep: true,
    },

    // activeTools() {
    //   // --- Check if "high resolution" is on
    //   this.$store.commit(
    //     'map/setHighResolutionStatus',
    //     this.activeTools.includes(0)
    //   )
    //   // --- Check if "info" is on -> mouseData
    //   this.$store.commit(
    //     'map/setMouseValueStatus',
    //     this.activeTools.includes(1)
    //   )
    //   // --- Check if "ruler" is on
    //   this.$store.commit('map/setRulerStatus', this.activeTools.includes(2))
    // },
    // sectionWidth() {
    //   this.cssProps = { '--fontSize': this.sectionWidth }
    // },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    this.selectedLevels = [
      -20, -50, -100, -150, -200, -250, -300, -350, -400, -450, -500, -600,
      -700, -800, -900, -1000, -2000, -3000, -4000, -5000, -7500, -10000,
    ]

    this.currentsAnimationOn = this.$store.state.map.currentsAnimationOn
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    selectBathymetry(source) {
      this.$store.commit('layers/setSelected', null)
      this.$store.commit('layers/setSelectedBathymetry', source)
    },

    // BATHYMETRY
    toggleBathymetry() {
      this.$nextTick(() => {
        if (this.selectedLevels.length === this.levels.length) {
          this.selectedLevels = []
        } else {
          this.selectedLevels = this.levels
        }
      })
    },

    toggleCurrentAnimation() {
      this.$store.commit('map/setCurrentsAnimationOn', this.currentsAnimationOn)
    },

    selectModel(category,field, model) {
      // --- If the currently selected button is clicked again, deselect it
      if (field === this.selectedField && model === this.selectedModel.modelDir)
        this.$store.commit('layers/setSelected', null)
      else this.$store.commit('layers/setSelected', { category,field, model })
    },

    // colors(field) {
    //   return field.colorbar.colormap
    // },

    // bathymetryColors() {
    //   return this.selectedBathymetry.colorbar.colormap
    // },
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
