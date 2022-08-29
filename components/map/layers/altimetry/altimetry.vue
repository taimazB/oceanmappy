<template>
  <v-container>
    <!-- SELECT SATELLITES -->
    <v-row class="mx-3">
      <v-select
        v-model="selectedSatellites"
        :items="satellites"
        label="Missions"
        multiple
        dense
      ></v-select>
    </v-row>

    <!-- SELECT DATES -->
    <v-row class="mx-3">
      <v-select
        v-model="selectedDates"
        :items="dates"
        label="Dates"
        multiple
        dense
      ></v-select>
    </v-row>

    <v-row style="min-height: 150px">
      <v-col cols="5" class="text-h4" style="position: relative">
        <!-- COLORBAR -->
        <colorBar
          :field="altimetry"
          class="d-flex ml-4"
          style="position: absolute; height: 90%"
        >
        </colorBar>
      </v-col>

      <!-- VARIABLES -->
      <v-col cols="7">
        <section v-for="(variable, i) in variables" :key="i">
          <v-row>
            <!-- VARIABLE -->
            <v-col cols="12" class="pr-2">
              <v-btn
                x-small
                elevation="0"
                width="100%"
                :dark="variable.var === selectedAltimetryVariable"
                :disabled="
                  selectedSatellites.length === 0 || selectedDates.length === 0
                "
                @click="selectVariable(variable.var)"
                >{{ variable.name }}</v-btn
              >
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <section
            v-show="variable.var === selectedAltimetryVariable"
            class="mb-3"
          >
            <v-row>
              <v-col cols="6" style="font-size: x-small">Unit:</v-col>
              <v-col cols="6" class="fontSizeXS" v-html="variable.unit"></v-col>
            </v-row>
            <v-row>
              <v-col cols="6" style="font-size: x-small">last updated:</v-col>
              <v-col
                cols="6"
                :style="{
                  'font-size': 'x-small',
                }"
                >{{ lastProcessed }}</v-col
              >
            </v-row>

            <v-row>
              <v-col cols="12" style="font-size: x-small">
                <span>{{ variable.longName }}</span>
              </v-col>
              <v-col cols="12" style="font-size: x-small">
                <span>{{ variable.description }}</span>
                <a :href="link" target="_blank">more</a>
              </v-col>
            </v-row>
          </section>
        </section>
      </v-col>
    </v-row>

    <v-overlay v-if="loadingAltimetry" absolute>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

import colorBar from '~/components/map/colorBar'

export default {
  components: { colorBar },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      variables: [
        {
          var: 'sla_filtered',
          name: 'SLA Filtered',
          longName:
            'Sea level anomaly filtered not-subsampled with dac, ocean_tide and lwe correction applied',
          description:
            'The sea level anomaly is the sea surface height above mean sea surface height; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]+[dac]+[ocean_tide]+[internal_tide]-[lwe]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'sla_unfiltered',
          name: 'SLA Unfiltered',
          longName:
            'Sea level anomaly not-filtered not-subsampled with dac, ocean_tide and lwe correction applied',
          description:
            'The sea level anomaly is the sea surface height above mean sea surface height; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]+[dac]+[ocean_tide]+[internal_tide]-[lwe]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'dac',
          name: 'DAC',
          longName: 'Dynamic Atmospheric Correction',
          description:
            'The sla in this file is already corrected for the dac; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]+[dac]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'ocean_tide',
          name: 'Ocean Tide',
          longName: 'Ocean tide model',
          description:
            'The sla in this file is already corrected for the ocean_tide; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]+[ocean_tide]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'internal_tide',
          name: 'Internal Tide',
          longName: 'Internal Tide signal: coherent mode M2/K1/O1/S2',
          description:
            'The sla in this file is already corrected for the internal_tide; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]+[internal_tide]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'lwe',
          name: 'LWE',
          longName: 'Long wavelength error',
          description:
            'The sla in this file is already corrected for the lwe; the uncorrected sla can be computed as follows: [uncorrected sla]=[sla from product]-[lwe]',
          scaleFactor: 0.001,
          unit: 'm',
        },
        {
          var: 'mdt',
          name: 'MDT',
          longName: 'Mean dynamic topography',
          description:
            'The mean dynamic topography is the sea surface height above geoid; it is used to compute the absolute dynamic tyopography adt=sla+mdt',
          scaleFactor: 0.001,
          unit: 'm',
        },
      ],
      link: 'https://resources.marine.copernicus.eu/product-detail/SEALEVEL_GLO_PHY_L3_NRT_OBSERVATIONS_008_044/INFORMATION',
      lastProcessed: null,
      selectedSatellites: [],
      selectedDates: [],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    altimetry() {
      return this.$store.state.layers.categories
        .filter((c) => c.name === 'Altimetry')[0]
        .filter((f) => f.name === 'Altimetry')[0]
    },

    altimetryAvailSatDates() {
      return this.$store.state.layers.altimetryAvailSatDates
    },

    satellites() {
      return this.altimetryAvailSatDates.map((satDate) => {
        return { value: satDate.satellite, text: satDate.longName }
      })
    },

    dates() {
      const selectedSatDates = this.altimetryAvailSatDates.filter((satDate) =>
        this.selectedSatellites.includes(satDate.satellite)
      )
      const dates = []
      selectedSatDates.forEach((satDate) => {
        dates.push(...satDate.dates)
      })
      return _.uniq(dates)
    },

    selectedAltimetryVariable: {
      get() {
        return this.$store.state.layers.selectedAltimetryVariable
      },
      set(variable) {
        this.$store.commit('layers/setSelectedAltimetryVariable', variable)
        this.updateColormap()
      },
    },

    colormap() {
      return this.altimetry.colorbar.colormap
    },

    loadingAltimetry() {
      return this.$store.state.layers.loadingAltimetry
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    selectedSatellites: {
      handler() {
        this.$store.commit(
          'layers/setSelectedAltimetrySatellites',
          this.selectedSatellites
        )
      },
      deep: true,
    },

    selectedDates: {
      handler() {
        this.$store.commit(
          'layers/setSelectedAltimetryDates',
          this.selectedDates
        )
      },
      deep: true,
    },

    colormap: {
      handler() {
        this.updateColormap()
      },
      deep: true,
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    const url = `${process.env.tuvaq2Url}/mapTiles/Altimetry/CMEMS/lastProcessed`
    axios({ method: 'get', url }).then((response) => {
      this.lastProcessed = moment
        .utc(response.data.replace(/(\r\n|\n|\r)/gm, ''))
        .fromNow()
    })
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    selectVariable(variable) {
      if (this.selectedAltimetryVariable === variable)
        this.selectedAltimetryVariable = null
      else this.selectedAltimetryVariable = variable
    },

    updateColormap() {
      const array = [
        'interpolate',
        ['linear'],
        ['get', this.selectedAltimetryVariable],
      ]
      this.colormap.forEach((obj) => {
        array.push(obj.value)
        array.push(`rgb(${this.hex2rgb(obj.color)})`)
      })

      this.$store.commit('map/setAltimetryMapboxColormap', array)
    },
  },
}
</script>

<style scoped>
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
