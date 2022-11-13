<template>
  <v-app>
    
    <v-container fluid class="h-100">
      <app-header style="height:60px;position:inherit;background: #1e4356;"/>
      
      <!-- ######################################################## -->
      <!-- HEADER -->
      <!-- <v-toolbar dense flat dark>
        
        <missions />
        <v-spacer></v-spacer>
      </v-toolbar> -->

      <!-- <path-planning v-if="showPathPlanning" /> -->

      <!-- <v-row
        style="
          position: absolute;
          z-index: 2;
          right: 0;
          padding: 0;
          margin: 5px;
        "
      > -->
      <!-- <section
          id="mouseValue"
          class="mx-5"
          style="color: gold; font-size: large"
        >
          <p class="my-0" v-html="mouseValue"></p>
        </section> -->

      <!-- <section id="coord" class="mx-5" style="color: gold; font-size: small">
          <p class="my-0 coord" v-html="`${mouseLat} , ${mouseLon}`"></p>
        </section> -->
      <!-- </v-row> -->

      <v-card>
        <v-row style="width: 100vw; height: calc(100vh - 60px); margin: 0">
          <!-- ######################################################## -->
          <!-- LEFT NAVIGATION BAR -->
          <v-col
            cols="2"
            class="px-0 py-0 d-flex flex-column"
            style="background: ghostwhite"
          >
            <!-- <v-navigation-drawer
            permanent
            :style="{ 'margin-bottom': bottomBarHeight, 'z-index': 2 }"
          > -->
            <v-expansion-panels accordion>
              <!-- PATH PLANNING -->
              <v-expansion-panel @change="togglePP">
                <v-expansion-panel-header>
                  <v-icon>mdi-map-marker-path</v-icon>
                  Path Planning
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <PathPlanning />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- MISSIONS -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-icon>mdi-database</v-icon>
                  Missions
                </v-expansion-panel-header>
                <v-expansion-panel-content
                  ><Missions />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- MAP TOOLS -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-icon>mdi-tools</v-icon>
                  Map Tools</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <toolbox v-show="true" />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- DRAWING TOOLS -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-icon>mdi-drawing</v-icon>
                  Drawing Tools</v-expansion-panel-header
                >
                <v-expansion-panel-content> </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- <v-list nav dense>
              <v-list-item @click="togglePP">
                <v-list-item-icon>
                  <v-icon>mdi-map-marker-path</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Path Planning</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Missions</v-list-item-title>
              </v-list-item>
            </v-list> -->
            <!-- </v-navigation-drawer> -->
          </v-col>

          <!-- ######################################################## -->
          <!-- MAP -->
          <v-col
            cols="9"
            class="px-0 py-0 mx-0 my-0"
            style="position: relative"
          >
            <mapbox />
            <!-- COLOR BAR -->
            <color-bar v-if="chkColorbar" class="c-colorBar" />
            <!-- DEPTH PICKER -->
            <!-- <section
              v-if="chkDepth"
              class="col-1 d-flex flex-column rightBar"
              style="position: absolute; right: 0; bottom: 100px"
            > -->
            <depth-picker
              v-if="chkDepth"
              class="c-depthPicker"
              style="position: absolute; right: 150px; bottom: 100px"
            />
            <!-- </section> -->
          </v-col>

          <!-- ######################################################## -->
          <!-- RIGHT NAVIGATION BAR -->
          <v-col
            cols="1"
            class="px-1 d-flex flex-column"
            style="background: ghostwhite"
          >
            <!-- <v-navigation-drawer
            permanent
            absolute
            :style="{ 'margin-bottom': bottomBarHeight, 'z-index': 2 }"
            right
          > -->
            <!-- DATE & TIME -->
            <section id="clock" style="height: 10%">
              <p class="date">{{ now.format('MMM DD, YYYY') }}</p>
              <p class="time">{{ now.format('HH:mm:ss') }} UTC</p>
            </section>

            <v-divider />

            <!-- LAYERS -->
            <section
              class=""
              style="height: 45%; overflow-y: scroll; overflow-x: hidden"
            >
              <layersControl />
            </section>

            <v-divider />

            <!-- DATE & TIME PICKER -->
            <section
              align-self="center"
              class="my-0 py-0"
              style="bottom: 0; height: 45%"
            >
              <time-picker v-if="chkTime" />
              <v-divider />
              <date-picker v-if="chkDate" />
            </section>
            <!-- </v-navigation-drawer> -->
          </v-col>

          <!-- BOTTOM BAR -->
          <v-bottom-sheet
            v-model="showBottomBar"
            hide-overlay
            persistent
            no-click-animation
          >
            <v-sheet :height="bottomBarHeight" light>
              <v-row>
                <v-spacer />

                <!-- ACTIVE LAYER -->
                <v-col align-self="end" class="my-0 py-0 mx-1" cols="auto">
                  <section style="font-size: small">
                    <p
                      class="my-0"
                      v-html="`${layerValueAtMouse}`"
                      style="font-family: 'Concert One', cursive !important"
                      :style="{ height: bottomBarHeight }"
                    ></p>
                  </section>
                </v-col>

                <v-divider vertical />

                <!-- DEPTH -->
                <v-col align-self="end" class="my-0 py-0 mx-1" cols="auto">
                  <section style="font-size: small">
                    <p
                      class="my-0"
                      v-html="`${depthAtMouse} m`"
                      style="font-family: 'Concert One', cursive !important"
                      :style="{ height: bottomBarHeight }"
                    ></p>
                  </section>
                </v-col>

                <v-divider vertical />

                <!-- COORDINATE -->
                <v-col align-self="end" class="my-0 py-0 mx-1" cols="auto">
                  <section id="coord" style="font-size: small">
                    <p
                      class="my-0"
                      v-html="`${mouseLat} , ${mouseLon}`"
                      style="font-family: 'Concert One', cursive !important"
                      :style="{ height: bottomBarHeight }"
                    ></p>
                  </section>
                </v-col>
              </v-row>
            </v-sheet>
          </v-bottom-sheet>

          <!-- <section style="position: absolute; width: 100%; height: 100%"> -->
          <!-- ######################################################## -->
          <!-- MAP -->
          <!-- <mapbox style="position: absolute" /> -->

          <!-- <section class="d-flex"> -->
          <!-- <section
              style="position: absolute; width: 100%; height: 100%; z-index: 2"
            > -->

          <!-- BUTTONS -->
          <!-- <buttons style="position: absolute; right: 0; top: 100px" /> -->

          <!-- DEPTH PICKER -->
          <!-- <section
              v-if="chkDepth"
              class="col-1 d-flex flex-column rightBar"
              style="position: absolute; right: 0; bottom: 100px"
            >
              <depth-picker class="c-depthPicker" />
            </section> -->

          <!-- COLORBAR -->
          <!-- <color-bar
              v-if="chkColorbar"
              class="c-colorBar ml56"
              style="bottom: 50px"
            /> -->
          <!-- </section> -->
        </v-row>
      </v-card>

      <!-- DATE & TIME PICKER -->
      <!-- <v-footer app> -->
      <!-- <v-row
        class="d-flex"
        style="
          position: absolute;
          bottom: 0%;
          right: 10px;
          width: 100%;
          background: rgba(255, 255, 255, 1);
        "
      > -->
      <!-- <v-col align-self="center" cols="1" /> -->
      <!-- <v-col align-self="center" cols="10" class="my-0 py-0"> -->
      <!-- <time-picker v-if="chkTime" /> -->
      <!-- </v-col> -->
      <!-- <v-col align-self="center" cols="2" class="my-0 py-0"> -->
      <!-- <date-picker v-if="chkDate" /> -->
      <!-- </v-col> -->
      <!-- </v-row> -->
      <!-- </v-footer> -->
    </v-container>
  </v-app>
</template>


<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import depthPicker from '~/components/map/depthPicker'
import timePicker from '~/components/map/timePicker'
import datePicker from '~/components/map/datePicker'
import colorBar from '~/components/map/colorBar'
// import Buttons from '~/components/map/buttons'
import layersControl from '~/components/map/layersControl'
import toolbox from '~/components/map/toolbox'
import Mapbox from '~/components/map/layers/mapbox.vue'
import pathPlanning from '~/components/map/pathPlanning.vue'
import AppHeader from '~/layouts/Site/Header'


export default {
  components: {
    depthPicker,
    timePicker,
    datePicker,
    colorBar,
    // Buttons,
    layersControl,
    toolbox,
    Mapbox,
    pathPlanning,
    // missions,
    AppHeader,
  },
  
  middleware: 'notAuthenticated',

  // ##############################################################
  // ######################## --- DATA --- ########################

  data() {
    return {
      now: moment.utc(),
      showToolbox: true,
      showBottomBar: true,
      bottomBarHeight: '20px',
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
    missions() {
      const user = this.$store.state.profile
      if (user && user.missions) {
        return user.missions.split(',')
      } else return null
    },

    mouseLat() {
      return this.num2latlon(this.$store.state.map.mouseCoordinate.lat, 'lat')
    },
    mouseLon() {
      return this.num2latlon(this.$store.state.map.mouseCoordinate.lng, 'lon')
    },

    layerValueAtMouse() {
      return this.$store.state.map.layerValueAtMouse
    },

    depthAtMouse() {
      return this.$store.state.map.depthAtMouse
    },

    layerValue() {
      return this.$store.state.map.valueAtMouse
    },

    chkColorbar() {
      // if (
      // this.$store.state.map.selected === null ||
      // !this.$store.state.map.selected.colorbar.hasColorbar
      // )
      // return false
      // else return true
      return true
    },

    chkDepth() {
      if (
        this.$store.state.map.selected === null ||
        !this.$store.state.map.selected.depthProperties.hasDepth
      )
        return false
      else return true
    },

    chkDate() {
      if (
        this.$store.state.map.selected === null ||
        this.$store.state.map.selected.selectedDate === null
      )
        return false
      else return true
    },

    chkTime() {
      if (
        this.$store.state.map.selected === null ||
        this.$store.state.map.selected.selectedTime === null
      )
        return false
      else return true
    },

    showPathPlanning() {
      return this.$store.state.map.PP.on
    },
  },

  // #################################################################
  // ######################## --- CREATED --- ########################

  created() {
    this.$store.commit('layers/setSelectedBathymetry', 'GEBCO')

    // send vuex to get profile data
    let token = ''
    if (process.browser) {
      token = localStorage.getItem('ocean_auth_token')
    } else {
      token = Cookies.get('ocean_auth_token')
    }
    this.$store.commit('getProfileData', token)
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    setInterval(() => {
      this.now = moment.utc()
    }, 1000)
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    num2latlon(num, latlon) {
      let result
      if (latlon === 'lat') {
        num >= 0
          ? (result = num.toFixed(3) + ' &deg;N')
          : (result = (-num).toFixed(3) + ' &deg;S')
      } else if (latlon === 'lon') {
        num >= 0
          ? (result = num.toFixed(3) + ' &deg;E')
          : (result = (-num).toFixed(3) + ' &deg;W')
      }
      return result
    },

    togglePP() {
      this.$store.commit('map/setPPon', !this.$store.state.map.PP.on)
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