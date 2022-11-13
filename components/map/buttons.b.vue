<template>
  <v-hover v-slot="{ hover }" open-delay="200">
    <v-card flat color="rgba(255,255,255,0)">
      <v-card-text>
        <!-- ############################################################# -->
        <!-- BATHYMETRY -->
        <!-- ############################################################# -->

        <v-row align="center" class="d-flex flex-row-reverse">
          <!-- BATHYMETRY ICON -->
          <v-tooltip bottom open-delay="500">
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on"> mdi-image-filter-hdr </v-icon>
            </template>
            <span>Bathymetry</span>
          </v-tooltip>

          <section v-show="hover">
            <client-only>
              <v-btn
                v-for="(bathymetry, i) in bathymetries"
                :key="i"
                small
                :dark="
                  selectedBathymetry.source === bathymetry.source ? true : false
                "
                @click="selectBathymetry(bathymetry.source)"
                v-html="bathymetry.source"
              >
              </v-btn>
            </client-only>

            <!-- BATHYMETRY CONTROLS -->
            <v-btn
              icon
              x-small
              :style="{
                background: '#f5f5f5',
              }"
              @click="chngBathymetryOpacity()"
            >
              <span style="font-size: 8px">{{ 100 * bathymetryOpacity }}</span>
            </v-btn>
            <v-btn
              icon
              x-small
              :style="{
                background: showBathymetryContourLines ? '#272727' : '#f5f5f5',
              }"
              @click="toggleBathymetryContourLines('SRTM')"
            >
              <v-icon>mdi-slash-forward</v-icon>
            </v-btn>
          </section>
        </v-row>

        <!-- ############################################################# -->
        <!-- MODELS -->
        <!-- ############################################################# -->

        <client-only>
          <v-row
            v-for="(field, i) in fields"
            :key="i"
            align="center"
            class="d-flex flex-row-reverse"
          >
            <v-tooltip bottom open-delay="500">
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on"> {{ field.icon }} </v-icon>
              </template>
              <span>{{ field.field }}</span>
            </v-tooltip>

            <!-- <v-tooltip
          bottom
          open-delay="500"
          v-for="(model, i) in field.models"
          :key="i"
        > -->
            <!-- <template > -->
            <section v-show="hover">
              <v-btn
                v-for="(model, j) in field.models"
                :id="field.field + '_' + model.modelDir"
                :key="j"
                small
                :dark="
                  field.field === selectedField &&
                  model.modelDir === selectedModel
                    ? true
                    : false
                "
                @click="selectModel(field.field, model.modelDir)"
              >
                {{ model.btnText }}
              </v-btn>
            </section>
            <!-- </template> -->
            <!-- <span>{{ model.longName }}</span> -->
            <!-- </v-tooltip> -->
          </v-row>
        </client-only>
      </v-card-text>
    </v-card>
  </v-hover>
</template>


<script>
export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      activeTools: [],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    showButtons() {
      return this.$store.state.map.showButtons
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
      else return this.$store.state.layers.selected.modelDir
    },

    fields() {
      return this.$store.state.map.fields
    },

    bathymetries() {
      return this.$store.state.map.bathymetries
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

    // styleObj_GEBCO() {
    //   return {
    //     background: `linear-gradient(to right, #272727 0%, #272727 ${
    //       this.$store.state.map.bathymetryOpacity * 100
    //     }%, #f5f5f5 ${
    //       this.$store.state.map.bathymetryOpacity * 100
    //     }%, #f5f5f5 100%)`,
    //   }
    // },

    // styleObj_SRTM() {
    //   return {
    //     background: `linear-gradient(to right, #272727 0%, #272727 ${
    //       this.$store.state.map.bathymetryOpacity * 100
    //     }%, #f5f5f5 ${
    //       this.$store.state.map.bathymetryOpacity * 100
    //     }%, #f5f5f5 100%)`,
    //   }
    // },

    showBathymetryContourLines() {
      return this.$store.state.map.showBathymetryContourLines
    },

    bathymetryOpacity() {
      return this.$store.state.map.bathymetryOpacity
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  // watch: {
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
  // },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  // mounted() {},

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    selectBathymetry(source) {
      this.$store.commit('layers/setSelectedBathymetry', source)
    },

    chngBathymetryOpacity() {
      this.$store.commit(
        'map/setBathymetryOpacity',
        this.bathymetryOpacity - 0.25
      )
    },

    toggleBathymetryContourLines() {
      this.$store.commit(
        'map/setBathymetryContourLines',
        !this.$store.state.map.showBathymetryContourLines
      )
    },

    selectModel(field, model) {
      // --- If the currently selected button is clicked again, deselect it
      if (field === this.selectedField && model === this.selectedModel) {
        this.$store.commit('map/setShowButtons', true)
        this.$store.commit('map/setAllowMouseInfo', false)
        this.$store.commit('map/setSelected', null)
      } else if (field === 'Currents' || field === 'iceberg') {
        this.$store.commit('map/setShowButtons', false)
        this.$store.commit('map/setAllowMouseInfo', false)
        this.$store.commit('map/setSelected', { field, model })
      } else {
        this.$store.commit('map/setAllowMouseInfo', true)
        this.$store.commit('map/setSelected', { field, model })
        // this.$store.commit('layers/setSelectedBathymetry', null)
      }
    },
  },
}
</script>
