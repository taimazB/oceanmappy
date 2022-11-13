<template>
  <v-app>
    <v-container ref="main" class="h-100 w-100" fluid>
      <!-- <app-header v-if="GNS" style="height: 60px; background: #1e4356" /> -->

      <appMenu :disabled="missionPlots.show" :style="appMenuStyle" />
      <OceanMappyInfo />

      <v-row :style="mainContainerStyle" class="ma-0 pa-0">
        <!-- LEFT BARS -->
        <section
          v-if="leftBarContent"
          :style="{
            width: `${leftBarWidth}`,
            height: '100%',
            position: 'relative',
          }"
          class="ma-0 pa-0"
        >
          <PathPlanning v-if="leftBarContent === 'PP'" />
          <Opass v-if="leftBarContent === 'OPASS'" />
          <Missions v-if="leftBarContent === 'missions'" />
          <missionNotes v-if="leftBarContent === 'missions' && selectedMissionNoteID" />
          <WPgen v-if="leftBarContent === 'WPgen'" />
          <missionPlots v-if="leftBarContent === 'missionPlots'" />
        </section>

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
          <mapLayersPanel v-if="rightBarContent === 'layers'" />
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
      <!-- </v-row> -->
    </v-container>

    <v-dialog v-model="alert.show" width="auto">
      <v-alert :type="alert.type">
        {{ alert.text }}
      </v-alert>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'
import _ from 'lodash'
import '@/plugins/functions'
import mapLayersPanel from '~/components/map/mapLayersPanel/mapLayersPanel.vue'
import missionNotes from '~/components/map/missions/notes.vue'
import Mapbox from '~/components/map/layers/mapbox.vue'
import PathPlanning from '~/components/map/PP/pathPlanning.vue'
import Opass from '~/components/map/OPASS/opass.vue'
import OpassPlots from '~/components/map/OPASS/opassPlots.vue'
import WPgen from '~/components/map/WPgen/WPgen.vue'
import Missions from '~/components/map/missions/missions.vue'
import AppHeader from '~/layouts/Site/SiteHeader'
import appMenu from '~/components/map/appMenu/appMenu.vue'
import bottomBar from '~/components/map/appMenu/bottomBar.vue'
import dateTimePicker from '~/components/map/dateTimePicker.vue'
import OceanMappyInfo from '~/components/map/appMenu/OceanMappyInfo.vue'
import missionPlots from '~/components/map/missions/missionPlots.vue'
import profile from '~/components/map/profile/profile.vue'

import {
  // getLayersAvailDatetimes,
  getFields,
  getModels,
} from '~/components/map/mapLayersPanel/loadLayers'

let cancelTokenSource = axios.CancelToken.source()

export default {
  components: {
    mapLayersPanel,
    missionNotes,
    Mapbox,
    PathPlanning,
    Opass,
    OpassPlots,
    WPgen,
    Missions,
    AppHeader,
    appMenu,
    bottomBar,
    dateTimePicker,
    OceanMappyInfo,
    missionPlots,
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
    GNS() {
      return this.$store.state.domain.includes('oceangns')
    },

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
      // return this.GNS ? 60 : 0
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

    leftBarWidth() {
      switch (this.leftBarContent) {
        case null:
          return '0px'
        case 'missions':
          if (this.selectedMissionNoteID) return '350px'
          else return '200px'
        case 'missionPlots':
          return '50%'
        default:
          return '200px'
      }
    },

    rightBarWidth() {
      if (this.rightBarContent) return 250
      else return 0
    },

    appMenuStyle() {
      if (this.GNS) {
        // if (this.breakpoint.mdAndDown) return 'position:relative;'
        // else
        return `position:relative; top:${this.headerHeight}px`
      } else return 'position:relative'
    },

    mainContainerStyle() {
      this.$store.commit('map/forceMapResize', true)
      return `width: 100vw; height: calc(100vh - ${
        this.headerHeight +
        this.appMenuHeight +
        this.bottomBarHeight +
        this.profileHeight +
        this.dateTimePickerHeight
      }px); margin: 0; position: relative; top:${this.headerHeight}px`
    },

    mapStyle() {
      this.$store.commit('map/forceMapResize', true)
      return `width:calc(100% - ${this.leftBarWidth} - ${this.rightBarWidth}px); height:100%; position:relative`
    },

    // username() {
    //   if (this.$store.state.profile && this.$store.state.profile.user) {
    //     return this.$store.state.profile.user.username
    //   } else return ''
    // },

    selected() {
      return this.$store.state.layers.selected
    },

    showDateTimeSlider() {
      if (this.selected) return this.selected.hasDateTime
      else return false
    },

    showLevel() {
      if (this.selected) return this.selected.hasLevels
      else return false
    },

    showDateTimePicker() {
      if (this.selected) return true
      else return false
    },

    chkColorbar() {
      return true
    },

    chkLevel() {
      if (this.selected === null || !this.selected.hasLevels)
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

    leftBarContent() {
      return this.$store.state.map.leftBarContent
    },

    rightBarContent() {
      return this.$store.state.map.rightBarContent
    },

    showLeftBar() {
      if (this.leftBarContent) return true
      else return false
    },

    showOPASSplots() {
      return this.$store.state.map.OPASS.showPlots
    },

    OPPASplots() {
      return this.$store.state.map.OPASS.plots
    },

    reloadMissions() {
      return this.$store.state.missions.reloadMissions
    },

    // showToolbox() {
    //   return this.$store.state.map.showToolbox
    // },

    // showLayers() {
    //   return this.$store.state.map.showLayers
    // },

    drawMode() {
      return this.$store.state.map.drawMode
    },

    dateLevelScale() {
      return this.$vuetify.breakpoint.smAndDown ? 0.75 : 1
    },

    // colMap() {
    //   let cols
    //   if (this.missionPlots.show) cols = 3
    //   else cols = 12 - this.colLeft - this.colLayers - this.colLogs
    //   this.$store.commit('map/setRedrawTrue')
    //   return cols
    // },

    //     widths(){
    // // let otherWidths = 0
    // // if(this.showLeftBar) otherWidths += 250
    // // if(this.showLayers) otherWidths += 250
    // // if(this.drawMode==='log') otherWidths += 150
    // return this.widthLeft+this.widthLayers+this.widthLogs
    //     },

    // colLeft() {
    //   // const col = this.breakpoint.smAndDown ? 8 : 2
    //   // return this.GNS && this.showLeftBar ? col : 0
    //   // const col = this.breakpoint.smAndDown ? 8 : 2
    //   return this.GNS && this.showLeftBar ? '250px' : 0
    // },

    //     widthLeft(){
    // return this.showLeftBar?250:0
    // },

    // colLayers() {
    //   const col = this.breakpoint.smAndDown ? 8 : 2
    //   return this.showLayers ? col : 0
    // },

    //   widthLayers(){
    // return this.showLayers?250:0
    // },

    // colLogs() {
    //   const col = this.breakpoint.smAndDown ? 6 : 1
    //   return this.drawMode === 'log' ? col : 0
    // },

    // widthLogs(){
    // return this.drawMode==='log'?120:0
    // },

    missionPlots() {
      // console.log(this.$store.state.missions.missionPlots);
      return this.$store.state.missions.missionPlots
    },

    // widthMissionPlots(){
    // return this.missionPlots.show?'50%':0
    // },

    htmlGNS() {
      return this.GNS ? '' : 'hidden'
    },

    alert() {
      return this.$store.state.map.alert
    },

    preventCloseOn() {
      return this.$store.state.map.preventCloseOn
    },

    demo() {
      return this.$store.state.map.demo
    },

    selectedMissionNoteID(){
      return this.$store.state.missions.selectedMissionNoteID
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    // username() {
    //   if (this.username) {
    //     this.renewSessionID()

    //     // --- Load data for all missions
    //     this.getMissions(true)
    //     // this.getNotes()
    //     // setInterval(() => {
    //     //   this.getMissions(false)
    //     // }, 60 * 1000)

    //     if (this.username === 'try') this.$store.commit('map/setDemo', true)
    //   }
    // },

    // reloadMissions() {
    //   if (this.reloadMissions) {
    //     this.getMissions(false)
    //   }
    // },

    // missionPlots: {
    //   handler() {
    //     if (this.missionPlots.show) {
    //       // this.$store.commit('map/setShowLayers', false)
    //       if (this.drawMode === 'log')
    //         this.$store.commit('map/setDrawMode', null)
    //       this.$store.commit('map/setLeftBarContent', null)
    //       this.$store.commit('map/setRightBarContent', null)
    //     }
    //   },
    //   deep: true,
    // },

    preventCloseOn() {
      if (this.preventCloseOn)
        window.addEventListener('beforeunload', this.preventClose)
      else window.removeEventListener('beforeunload', this.preventClose)
    },

    leftBarContent() {
      if (this.breakpoint.smAndDown && this.leftBarContent)
        this.rightBarContent = null
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

    // send vuex to get profile data only for oceangns
    if (this.GNS) {
      let token = ''
      if (process.browser) {
        token = localStorage.getItem('ocean_auth_token')
      } else {
        token = Cookies.get('ocean_auth_token')
      }
      this.$store.commit('getProfileData', token)
    } else {
      this.renewSessionID()
    }
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    // --- To remove tile directory when closing
    // window.addEventListener('beforeunload', (e) => {
    //   e.preventDefault();
    //   e.returnValue = "";

    //   const sessionID = this.$store.state.map.sessionID
    //   this.$axios({
    //     method: 'get',
    //     url: `${process.env.tuvaq2Url}/cleanTiles?id=${sessionID}`
    //   })
    // })

    // --- Get available date and times for all models
    // this.getLayersAvailDatetimes()
    this.getFields()
    this.getModels()

    // --- Get available date and times for all PP models
    if (this.GNS) {
      this.$store.state.PP.PPmodels.map((model) => {
        this.getPPavailDateTimes({
          model: model.name,
        })
      })
    }

    // --- Get available satellites and dates Altimetry
    // this.getAltimetryAvailSatDates()

    // --- Get missions
    // this.getMissions(true)
    // setInterval(() => {
    //   this.getMissions(false)
    // }, 60 * 1000)
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    // getLayersAvailDatetimes,
    getFields,
    getModels,

    getPPavailDateTimes(data) {
      cancelTokenSource.cancel()

      cancelTokenSource = axios.CancelToken.source()
      // axios({
      //   method: 'post',
      //   url: `${process.env.tuvaq2Url}/getPPavailDateTimes`,
      //   data,
      //   // cancelToken: cancelTokenSource.token
      // })
      //   .then((results) => {
      //     this.$store.commit('PP/setPPavailDateTimes', {
      //       data,
      //       availDateTimes: results.data,
      //     })
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    },

    // togglePP() {
    //   this.$store.commit('map/setPPon', !this.$store.state.map.PP.on)
    // },

    

    // getNotes() {
    //   this.$axios({
    //     method: 'post',
    //     url: `${process.env.baseUrl}/getNotes`,
    //     data: { username: this.username },
    //   }).then((data) => {
    //     console.log(data.data);
    //     this.$store.commit('map/setNotes', data.data)
    //   })
    // },

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
  overflow-y: var(--htmlGNS);
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
