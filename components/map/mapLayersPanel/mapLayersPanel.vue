<template>
  <section
    style="
      right: 0;
      background: rgba(255, 255, 255, 1);
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    "
  >
    <v-row style="height: 100%">
      <v-col cols="11">
        <!-- Layers -->
        <section v-if="selectedTab === 0">
          <v-row>
            <v-col cols="11">
              <section v-if="selectedLayerGroup === 0" style="height: 100%">
                <topoBathymetry />
              </section>
              <section v-if="selectedLayerGroup === 1" style="height: 100%">
                <oceanAtmosphere group="ocean" />
                <span
                  class="text-caption pa-2"
                  style="bottom: 0; position: absolute; font-style: italic"
                  >* Coming back soon</span
                >
              </section>
              <section v-if="selectedLayerGroup === 2" style="height: 100%">
                <oceanAtmosphere group="atmosphere" />
              </section>
            </v-col>
            <v-col cols="1">
              <section style="display: block; transform: rotate(90deg)">
                <v-btn-toggle
                  v-model="selectedLayerGroup"
                  mandatory
                  color="success"
                >
                  <v-btn height="100%">Topography</v-btn>
                  <v-btn height="100%">Ocean</v-btn>
                  <v-btn height="100%">Atmosphere</v-btn>
                </v-btn-toggle>
              </section>
            </v-col>
          </v-row>
        </section>

        <!-- ALTIMETRY -->
        <section v-if="selectedTab === 1" style="height: 100%">
          <altimetry />
        </section>

        <!-- ARGO -->
        <section v-if="selectedTab === 2" style="height: 100%">
          <argo />
        </section>

        <!-- SENTINEL -->
        <section v-if="selectedTab === 3" style="height: 100%">
          <sentinel />
        </section>
      </v-col>

      <v-col cols="1">
        <section style="display: block; transform: rotate(90deg)">
          <v-btn-toggle v-model="selectedTab" mandatory color="primary">
            <v-btn height="100%">Layers</v-btn>
            <v-btn height="100%">Altimetry</v-btn>
            <v-btn disabled height="100%">ARGO</v-btn>
            <v-btn height="100%">Sentinel</v-btn>
          </v-btn-toggle>
        </section>
      </v-col>
    </v-row>
  </section>
</template>

<script>
// import settings from './settings.vue'
// import bathymetrySettings from './bathymetrySettings.vue'

// import colorBar from '~/components/map/colorBar'
import altimetry from '~/components/map/layers/altimetry/altimetry.vue'
// import AIS from '~/components/map/layers/AIS/AIS.vue'
import argo from '~/components/map/layers/argo/argo.vue'
import sentinel from '~/components/map/layers/sentinel/sentinel.vue'
import oceanAtmosphere from '~/components/map/mapLayersPanel/oceanAtmosphere.vue'
import topoBathymetry from '~/components/map/mapLayersPanel/topoBathymetry.vue'

export default {
  components: { oceanAtmosphere, topoBathymetry, argo, sentinel, altimetry },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      selectedTab: 0,
      selectedLayerGroup: 1,
      activeTools: [],
      cssProps: {},
      layerHover: false,
      selectedNOAAbathymetry: null,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    // selectedField() {
    //   if (this.$store.state.layers.selected === null) return null
    //   else return this.$store.state.layers.selected.field
    // },

    // selectedModel() {
    //   if (this.$store.state.layers.selected === null) return null
    //   else return this.$store.state.layers.selected
    // },

    // availTimes() {
    //   if (this.$store.state.map.availDateTimes.length > 0) {
    //     return this.$store.state.map.availDateTimes
    //       .filter((d) => d.date === this.$store.state.map.selectedDate)
    //       .map((d) => d.time)
    //   } else {
    //     return []
    //   }
    // },

    // styleBathymetry() {
    //   return {
    //     background: `linear-gradient(to right, #272727 0%, #272727 ${this.$store
    //       .state.map.bathymetryOpacity * 100}%, #f5f5f5 ${this.$store.state.map
    //       .bathymetryOpacity * 100}%, #f5f5f5 100%)`,
    //     'align-self': 'center'
    //   }
    // },

    // sectionWidth() {
    //   return Object.keys(this.$refs).length > 0
    //     ? this.$refs.layersControlSection.clientWidth
    //     : '10px'
    // },

    // NOAAbathymetries(){
    //   return this.$store.state.layers.NOAAbathymetries
    // }

    // BATHYMETRY

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
    this.currentsAnimationOn = this.$store.state.map.currentsAnimationOn
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    // BATHYMETRY

    toggleCurrentAnimation() {
      this.$store.commit('map/setCurrentsAnimationOn', this.currentsAnimationOn)
    },

    // selectModel(category,field, model) {
    //   // --- If the currently selected button is clicked again, deselect it
    //   if (field === this.selectedField && model === this.selectedModel.directory)
    //     this.$store.commit('layers/setSelected', null)
    //   else this.$store.commit('layers/setSelected', { category,field, model })
    // },

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

.v-expansion-panel-header {
  min-height: 36px;
}

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
