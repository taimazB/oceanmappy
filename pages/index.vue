<template>
  <v-app>
    <v-container ref="main" class="h-100 w-100" fluid>
      <appMenu :style="appMenuStyle" />
      <OceanMappyInfo />

      <v-row :style="mainContainerStyle" class="ma-0 pa-0">
        <!-- MIDDLE PANEL -->
        <section :style="mapStyle" class="ma-0 pa-0">
          <mapbox />
        </section>

        <!-- RIGHT BARS -->
        <section
          v-if="rightBarContent"
          :style="{
            width: `${rightBarWidth}px`,
            height: '100%',
            position: 'relative',
          }"
          class="ma-0 pa-0"
        >
          <layersControl v-if="rightBarContent === 'layers'" />
        </section>
      </v-row>

      <!-- BOTTOM BAR -->
      <v-bottom-sheet
        ref="bottomBar"
        v-model="showBottomBar"
        hide-overlay
        no-click-animation
        persistent
      >
        <profile
          v-if="drawMode === 'profile'"
          :height="profileHeight"
          :width="mainWidth"
        />
        <dateTimePicker v-if="showDateTimePicker" />
        <bottomBar />
      </v-bottom-sheet>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import '@/plugins/functions'

import layersControl from '~/components/map/layersControl/layersControl.vue'
import Mapbox from '~/components/map/layers/mapbox.vue'
import appMenu from '~/components/map/appMenu/appMenu.vue'
import bottomBar from '~/components/map/appMenu/bottomBar.vue'
import dateTimePicker from '~/components/map/dateTimePicker.vue'
import OceanMappyInfo from '~/components/map/appMenu/OceanMappyInfo.vue'
import profile from '~/components/map/profile/profile.vue'

export default {
  components: {
    layersControl,
    Mapbox,
    appMenu,
    bottomBar,
    dateTimePicker,
    OceanMappyInfo,
    profile,
  },

  middleware: 'notAuthenticated',

  // ##############################################################
  // ######################## --- DATA --- ########################

  data() {
    return {
      showBottomBar: true,
      // mainWidth:0,
      // mainHeight:0
    }
  },

  // ##############################################################
  // ######################## --- HEAD --- ########################

  head() {
    return {
      title: 'Map',
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint
    },

    mainWidth() {
      return this.$refs.main.clientWidth
    },
    mainHeight() {
      return this.$refs.main.clientHeight
    },

    headerHeight() {
      return 0
    },
    appMenuHeight() {
      return 30
    },
    bottomBarHeight() {
      return 20
    },
    dateTimePickerHeight() {
      return this.showDateTimePicker ? 50 : 0
    },
    profileHeight() {
      return this.drawMode === 'profile' ? 150 : 0
    },

    rightBarWidth() {
      if (this.rightBarContent) return 250
      else return 0
    },

    appMenuStyle() {
      return 'position:relative'
    },

    mainContainerStyle() {
      this.$store.dispatch('map/forceMapResize')
      return `width: 100vw; height: calc(100vh - ${
        this.headerHeight +
        this.appMenuHeight +
        this.bottomBarHeight +
        this.profileHeight +
        this.dateTimePickerHeight
      }px); margin: 0; position: relative; top:${this.headerHeight}px`
    },

    mapStyle() {
      this.$store.dispatch('map/forceMapResize')
      return `width:calc(100% - ${this.rightBarWidth}px); height:100%; position:relative`
    },

    selected() {
      return this.$store.state.layers.selected
    },

    showDateTimeSlider() {
      if (this.selected) return this.selected.hasDateTime
      else return false
    },

    showDepth() {
      if (this.selected) return this.selected.depthProperties.hasDepth
      else return false
    },

    showDateTimePicker() {
      if (this.selected) return true
      else return false
    },

    chkColorbar() {
      return true
    },

    chkDepth() {
      if (this.selected === null || !this.selected.depthProperties.hasDepth)
        return false
      else return true
    },

    chkDate() {
      if (this.selected === null || this.selected.selectedDate === null)
        return false
      else return true
    },

    chkTime() {
      if (
        this.$store.state.layers.selected === null ||
        this.$store.state.layers.selected.selectedTime === null
      )
        return false
      else return true
    },

    rightBarContent() {
      return this.$store.state.map.rightBarContent
    },

    drawMode() {
      return this.$store.state.map.drawMode
    },

    dateDepthScale() {
      return this.$vuetify.breakpoint.smAndDown ? 0.75 : 1
    },

    preventCloseOn() {
      return this.$store.state.map.preventCloseOn
    },

    demo() {
      return this.$store.state.map.demo
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    preventCloseOn() {
      if (this.preventCloseOn)
        window.addEventListener('beforeunload', this.preventClose)
      else window.removeEventListener('beforeunload', this.preventClose)
    },

    rightBarContent() {
      if (this.breakpoint.smAndDown && this.rightBarContent)
        this.leftBarContent = null
    },
  },

  // #################################################################
  // ######################## --- CREATED --- ########################
  created() {
    this.$store.commit('layers/setSelectedBathymetry', 'SRTM')

    this.$store.commit(
      'map/setSessionID',
      `${moment.utc().format('YYYYMMDDTHHmmss-SSS')}_oceanmappy_${parseInt(
        10000 * Math.random()
      )}`
    )
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    // --- Get available date and times for all models
    this.$store.state.layers.categories.forEach((category) => {
      category.fields.forEach((field) => {
        field.models.forEach((model) => {
          if (model.hasDateTime)
            this.getAvailDateTimes({
              category: category.name,
              field: field.name,
              model: model.modelDir,
            })
        })
      })
    })

    // --- Get available satellites and dates Altimetry
    this.getAltimetryAvailSatDates()
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    getAvailDateTimes(data) {
      axios({
        method: 'post',
        url: `${process.env.tuvaq2Url}/getAvailDateTimes2`,
        data, // --- instead of data: data
      })
        .then((results) => {
          console.log(results.data);
          const availDateTimes = results.data.dateTimes.map((d) => {
            const arr = d.split('_')
            return { date: arr[0], time: arr[1] }
          })
          const hrDiff = Math.round(
            moment
              .utc()
              .diff(
                moment.utc(
                  results.data.lastProcessed.replace(/(\r\n|\n|\r)/gm, '')
                )
              ) /
              3600 /
              1000
          )

          this.$store.commit('layers/setAvailDateTimes', {
            data,
            availDateTimes: this.demo
              ? availDateTimes.slice(0, 20)
              : availDateTimes,
            lastProcessed: hrDiff,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getAltimetryAvailSatDates() {
      axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/getAltimetryAvailSatDates`,
      })
        .then((respond) => {
          const rawSatDates = respond.data.satDates.map((satDate) => {
            const arr = satDate.split('_')
            const date = arr.slice(-1)[0]
            const satellite = arr.slice(0, -1).join('_')
            return { satellite, date }
          })

          const satellites = _.uniq(
            rawSatDates.map((satDate) => satDate.satellite)
          )

          const satDates = []
          satellites.forEach((satellite) => {
            const dates = rawSatDates
              .filter((satDate) => satDate.satellite === satellite)
              .map((satDate) => satDate.date)
            const longName = this.satLongName(satellite)
            satDates.push({ satellite, longName, dates })
          })

          this.$store.commit('layers/setAltimetryAvailSatDates', satDates)
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

    compareDate(a, b) {
      return parseInt(moment(a['deployment start date'], 'YYYY-MM-DD').unix()) <
        parseInt(moment(b['deployment start date'], 'YYYY-MM-DD').unix())
        ? 1
        : -1
    },

    preventClose(e) {
      e.preventDefault()
      e.returnValue = ''
    },
  },
}
</script>

<style>
@import 'assets/css/map.css';

html {
  overflow-y: hidden;
}

#header .logo img {
  max-height: 50px;
}
</style>

<style scoped>
.datetimeSlider {
  background: aliceblue;
  border-radius: 50px;
  opacity: 0.5;
  transition: 0.3s;
  text-align: center;
  text-align: -webkit-center;
}

.datetimeSlider:hover {
  opacity: 1;
}

.cols {
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
