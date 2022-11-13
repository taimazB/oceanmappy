<template>
  <v-sheet light height="20px" style="background: lightgray">
    <v-row class="py-0 my-0" style="height: 100%">
      <!-- DATE & TIME -->
      <v-col cols="auto" class="date d-none d-sm-block">
        <v-icon x-small>mdi-calendar-range</v-icon>
        {{ now.format('MMM DD, YYYY') }}
      </v-col>
      <v-col cols="auto" class="date text-smOnly-caption">
        <v-icon x-small>mdi-clock-time-four-outline</v-icon>
        {{ now.format('HH:mm:ss') }} UTC
      </v-col>

      <v-divider vertical />

      <!-- ZOOM LEVEL -->
      <v-col cols="auto" class="date text-smOnly-caption">
        <v-icon x-small>mdi-loupe</v-icon>
        {{ zoomLevel }}
      </v-col>

      <v-spacer />

      <!-- ACTIVE LAYER -->
      <v-col
      v-show="false"
        align-self="end"
        class="ma-0 pa-0 mx-1"
        cols="auto"
        style="text-align: right"
      >
        <section class="mobileFontSize text-sm-caption" style="display: flex">
          <div
            class="mx-1"
            :style="{
              width: '6px',
              height: '6px',
              'border-radius': '6px',
              background: activeLayerValueAtMouseStatus ? 'green' : 'red',
              'align-self': 'center',
            }"
            @click="toggleActiveLayerValueAtMouse"
          ></div>
          <p class="my-0" v-html="`${layerValueAtMouse}`"></p>
        </section>
      </v-col>

      <v-divider vertical />

      <!-- LEVEL -->
      <v-col
      v-show="false"
        align-self="end"
        class="my-0 py-0 mx-1"
        cols="auto"
        style="text-align: right; width: 100px"
      >
        <section class="mobileFontSize text-sm-caption">
          <p class="my-0" v-html="`${levelAtMouse} m`"></p>
        </section>
      </v-col>

      <v-divider vertical />

      <!-- COORDINATE -->
      <v-col
        align-self="end"
        class="my-0 py-0 mx-1"
        cols="auto"
        style="text-align: center; width: 150px"
      >
        <section id="coord" class="mobileFontSize text-sm-caption">
          <p class="my-0" v-html="`${mouseLat} , ${mouseLon}`"></p>
        </section>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import moment from 'moment'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      now: moment.utc(),
    }
  },

  computed: {
    layerValueAtMouse() {
      return this.$store.state.map.layerValueAtMouse
    },

    levelAtMouse() {
      return this.$store.state.map.levelAtMouse
    },

    layerValue() {
      return this.$store.state.map.valueAtMouse
    },

    mouseLat() {
      return this.num2latlon(this.$store.state.map.mouseCoordinate.lat, 'lat')
    },
    mouseLon() {
      return this.num2latlon(this.$store.state.map.mouseCoordinate.lng, 'lon')
    },

    activeLayerValueAtMouseStatus() {
      return this.$store.state.map.activeLayerValueAtMouseStatus
    },

    zoomLevel() {
      return this.$store.state.map.zoomLevel
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.now = moment.utc()
    setInterval(() => {
      this.now = moment.utc()
      this.$store.commit('map/setNow', this.now)
    }, 1000)
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  methods: {
    toggleActiveLayerValueAtMouse() {
      this.$store.commit(
        'map/setActiveLayerValueAtMouseStatus',
        !this.activeLayerValueAtMouseStatus
      )
    },
  },
}
</script>

<style scoped>
.mobileFontSize {
  font-size: 0.5rem;
}
</style>
