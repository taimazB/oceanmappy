<template>
  <v-container>
    <!-- SELECT SATELLITES -->
    <v-card>
      <v-card-subtitle class="pb-0">Satellites</v-card-subtitle>
      <v-list dense>
        <v-list-item-group v-model="selectedSatellites" multiple color="indigo">
          <v-list-item v-for="(sat, i) in satellites" :key="i">
            <v-list-item-content>
              <v-list-item-title v-text="satLongName(sat)"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <!-- SELECT DATES -->
    <v-card v-if="selectedSatellites.length > 0">
      <v-card-subtitle class="pb-0">Available Dates</v-card-subtitle>
      <v-list dense>
        <v-list-item-group v-model="selectedDates" multiple color="indigo">
          <v-list-item v-for="(date, i) in availDates" :key="i">
            <v-list-item-content>
              <v-list-item-title v-text="date"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-card v-if="selectedSatellites.length > 0 && selectedDates.length > 0">
      <v-row>
        <v-col cols="5" class="text-h4" style="position: relative">
          <!-- COLORBAR -->
          <colorBar
            :field="altimetryField"
            class="d-flex ml-4"
            style="position: absolute; height: 90%"
          >
          </colorBar>
        </v-col>

        <!-- VARIABLES -->
        <v-col cols="7">
          <!-- <section > -->
          <v-row v-for="(variable, i) in variables" :key="i">
            <!-- VARIABLE -->
            <v-col cols="10" class="ma-0 pa-0">
              <v-btn
                x-small
                elevation="0"
                width="100%"
                :dark="variable.var === selectedVariable"
                @click="selectVariable(variable.var)"
                >{{ variable.name }}</v-btn
              >
            </v-col>
            <v-col cols="2" class="ma-0 pa-0">
              <v-icon x-small @click="setShowVariableInfo(variable)"
                >mdi-information-variant</v-icon
              >
            </v-col>
          </v-row>

          <!-- DESCRIPTION -->
          <!-- <section
            v-show="variable.var === selectedVariable"
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
          </section> -->
          <!-- </section> -->
        </v-col>
      </v-row>
    </v-card>

    <!-- TIME RANGE -->
    <!-- <v-row class="ma-0 pa-0 px-2">
      <v-col
        cols="12"
        class="ma-0 pa-0 pl-1 fontSizeXS"
        style="place-self: center"
        >Show last {{ timeRange }} hours</v-col
      >
      <v-col cols="12">
        <v-slider
          v-model="timeRange"
          max="48"
          min="0"
          hide-details
          class="align-center"
          step="1"
        >
        </v-slider>
      </v-col>
    </v-row> -->

    <v-btn
      elevation="0"
      width="100%"
      color="primary"
      :loading="loading"
      :disabled="
        selectedSatellites.length === 0 ||
        selectedDates.length === 0 ||
        !selectedVariable
      "
      class="mt-5"
      @click="update"
      >Update</v-btn
    >
    <v-btn
      elevation="0"
      width="100%"
      color="red darken-4"
      dark
      class="mt-1"
      @click="reset"
      >Reset</v-btn
    >
    <!-- <v-overlay v-if="loadingAltimetry" absolute>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay> -->

    <!-- INFO -->
    <v-dialog v-model="variableInfo.show" width="500px">
      <v-card style="padding: 5px">
        <v-card-title>{{ variableInfo.var }}</v-card-title>
        <v-card-subtitle>{{ variableInfo.longName }}</v-card-subtitle>
        <v-card-text>{{ variableInfo.description }} </v-card-text>
        <v-card-text>
          Scale Factor: {{ variableInfo.scaleFactor }}
        </v-card-text>
        <v-card-text> Unit: {{ variableInfo.unit }} </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import lodash from 'lodash'
import colorBar from '~/components/map/colorBar'

export default {
  components: { colorBar },

  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      satellites: ['c2n', 'h2b', 's3a', 's3b', 's6a'],
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
      availData: [],
      lastProcessed: null,
      selectedSatellites: [],
      selectedDates: [],
      selectedVariable: null,
      variableInfo: {},
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    // altimetry() {
    //   return this.$store.state.layers.categories
    //     .filter((c) => c.name === 'Altimetry')[0]
    //     .fields.filter((f) => f.name === 'Altimetry')[0]
    // },

    // altimetryAvailSatDates() {
    //   return this.$store.state.layers.altimetryAvailSatDates
    // },

    // satellites() {
    //   return this.availSatDates.map((satDate) => {
    //     return { value: satDate.satellite, text: satDate.longName }
    //   })
    // },

    availDates() {
      const selectedSatDates = this.availData.filter((data) =>
        this.selectedSatellites
          .map((i) => this.satellites[i])
          .includes(data.satellite)
      )
      const dates = []
      selectedSatDates.forEach((satDate) => {
        dates.push(...satDate.dates)
      })
      return lodash.uniq(dates)
    },

    // selectedVariable: {
    //   get() {
    //     return this.$store.state.layers.selectedVariable
    //   },
    //   set(variable) {
    //     this.$store.commit('layers/setselectedVariable', variable)
    //     this.updateColormap()
    //   },
    // },

    loading() {
      return this.$store.state.altimetry.loadingAltimetry
    },

    // --- For colorbar
    altimetryField() {
      return this.$store.state.altimetry.field
    },

    colormap() {
      return this.altimetryField.colorbar.colormap
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    // selectedSatellites: {
    //   handler() {
    //     this.$store.commit(
    //       'layers/setSelectedAltimetrySatellites',
    //       this.selectedSatellites
    //     )
    //   },
    //   deep: true,
    // },

    // selectedDates: {
    //   handler() {
    //     this.$store.commit(
    //       'layers/setSelectedAltimetryDates',
    //       this.selectedDates
    //     )
    //   },
    //   deep: true,
    // },

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
    const url = `${process.env.tuvaq2Url}/models/Altimetry/lastProcessed`
    axios({ method: 'get', url }).then((response) => {
      this.lastProcessed = moment
        .utc(response.data.replace(/(\r\n|\n|\r)/gm, ''))
        .fromNow()
    })

    this.getAltimetryAvailSatDates()

    // --- INITIATE SELECTION
    // this.selectedSatellites.push(this.satellites[0])
    // this.selectedDates.push(this.dates[this.dates.length - 1])
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    getAltimetryAvailSatDates() {
      // cancelTokenSource.cancel()

      // cancelTokenSource = axios.CancelToken.source()
      axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/getAltimetryAvailSatDates`,
        // cancelToken: cancelTokenSource.token
      })
        .then((response) => {
          const rawSatDates = response.data.satDates.map((satDate) => {
            const arr = satDate.split('_')
            const date = arr.slice(-1)[0]
            const satellite = arr.slice(0, -1).join('_')
            return { satellite, date }
          })

          const satellites = _.uniq(
            rawSatDates.map((satDate) => satDate.satellite)
          )

          this.availData = []
          satellites.forEach((satellite) => {
            const dates = rawSatDates
              .filter((satDate) => satDate.satellite === satellite)
              .map((satDate) => satDate.date)
            const longName = this.satLongName(satellite)
            this.availData.push({ satellite, longName, dates })
          })
          // this.$store.commit('layers/setAltimetryAvailSatDates', satDates)
          // const availDateTimes = results.data.dateTimes.map((d) => {
          //   const arr = d.split('_')
          //   return { date: arr[0], time: arr[1] }
          // })
          // const hrDiff = Math.round(
          //   moment
          //     .utc()
          //     .diff(
          //       moment.utc(
          //         results.data.lastProcessed.replace(/(\r\n|\n|\r)/gm, '')
          //       )
          //     ) /
          //     3600 /
          //     1000
          // )
          // this.$store.commit('layers/setAvailDateTimes', {
          //   data,
          //   availDateTimes,
          //   lastProcessed: hrDiff,
          // })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    satLongName(satellite) {
      switch (satellite) {
        case 'c2n':
          return 'Cryosat (c2n)'
        case 'h2b':
          return 'HaiYang-2B (h2b)'
        case 's3a':
          return 'Sentinel-3a (s3a)'
        case 's3b':
          return 'Sentinel-3b (s3b)'
        case 's6a_hr':
          return 'Sentinel-6a (s6a_hr)'
        default:
          return satellite
      }
    },

    selectVariable(variable) {
      if (this.selectedVariable === variable) this.selectedVariable = null
      else this.selectedVariable = variable
    },

    update() {
      this.updateColormap()

      this.$store.commit('altimetry/setSelectedAltimetryPackage', {
        satellites: this.selectedSatellites.map((i) => this.satellites[i]),
        dates: this.selectedDates.map((i) => this.availDates[i]),
        variable: this.selectedVariable,
      })
    },

    reset() {
      this.selectedSatellites = []
      this.selectedDates = []
      this.selectedVariable = null

      this.$store.commit('altimetry/setSelectedAltimetryPackage', {
        satellites: this.selectedSatellites,
        dates: this.selectedDates,
        variable: this.selectedVariable,
      })
    },

    updateColormap() {
      const array = ['interpolate', ['linear'], ['get', this.selectedVariable]]
      this.colormap.forEach((obj) => {
        array.push(obj.value)
        array.push(`rgb(${this.hex2rgb(obj.color)})`)
      })

      this.$store.commit('altimetry/setAltimetryMapboxColormap', array)
    },

    setShowVariableInfo(variable) {
      this.variableInfo = {
        show: true,
        var: variable.var,
        longName: variable.longName,
        description: variable.description,
        scaleFactor: variable.scaleFactor,
        unit: variable.unit,
      }
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
