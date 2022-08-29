<template>
  <section style="height: 100%">
    <section
      :style="{
        'max-height': heightArgoList,
        'overflow-y': 'auto',
        'overflow-x': 'hidden',
      }"
    >
      <!-- GENERAL CONTROLS -->
      <v-row class="px-1">
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <!-- SHOW LAST LOCATIONS -->
          <v-btn elevation="0" fab width="20px" height="20px">
            <v-icon x-small @click="toggleLastLocations()">{{
              showArgos ? 'mdi-eye-off-outline' : 'mdi-eye-off'
            }}</v-icon>
          </v-btn>
          <!-- FILTER -->
          <v-btn elevation="0" fab width="20px" height="20px">
            <v-icon x-small @click="showFilter = !showFilter">{{
              showFilter ? 'mdi-filter' : 'mdi-filter-outline'
            }}</v-icon>
          </v-btn>
          <!-- DELETE ALL -->
          <v-btn
            elevation="0"
            fab
            width="20px"
            height="20px"
            :disabled="selectedFloats.filter((f) => f.show).length === 0"
          >
            <v-icon x-small color="red" @click="removeAll()">mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- FILTERS -->
      <section v-if="showFilter">
        <v-row class="px-1">
          <v-col cols="3" style="place-self: center; font-size: small"
            >Dates</v-col
          >
          <v-col cols="9">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scroll-y-reverse-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="selectedDates"
                  readonly
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selectedDates"
                range
                :max="maxDate"
                @input="menu1 = true"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn
              width="100%"
              elevation="0"
              color="primary"
              x-small
              class="ma-1"
              :disabled="!selectedDates"
              @click="applyFilter"
              >Apply</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              width="100%"
              elevation="0"
              color="error"
              x-small
              class="ma-1"
              @click="resetFilter"
              >Reset</v-btn
            >
          </v-col>
        </v-row>
      </section>

      <!-- GUIDE -->
      <v-row v-if="selectedFloats.filter((f) => f.show).length === 0">
        <v-col cols="1" style="place-self:center">
          <v-icon>mdi-arrow-left-thick</v-icon>
        </v-col>
        <v-col cols="11" class="px-2 py-4" style="font-size:small;color:#333">
        Click on any of the dots to show its track
        </v-col>
      </v-row>

      <!-- CLICKED WMOS -->
      <section
        v-for="(float, i) in selectedFloats.filter((f) => f.show)"
        :key="i"
      >
        <v-divider class="ma-0" />
        <v-row class="px-1">
          <!-- COLOR -->
          <v-col cols="1" style="place-self: center">
            <div
              :style="{
                width: '10px',
                height: '10px',
                'border-radius': '5px',
                background: float.color,
              }"
              @click="changeColor(float.WMO)"
            ></div>
          </v-col>
          <!-- WMO -->
          <v-col
            cols="4"
            style="place-self: center; font-size: small; font-weight: bold"
          >
            {{ float.WMO }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <!-- ZOOM -->
            <v-btn elevation="0" fab width="20px" height="20px">
              <v-icon x-small @click="zoom(float.WMO)"
                >mdi-magnify-plus-outline</v-icon
              >
            </v-btn>
            <!-- PLOT -->
            <v-btn elevation="0" fab width="20px" height="20px">
              <v-icon x-small @click="initPlot(float.WMO, float.color)"
                >mdi-chart-bell-curve-cumulative</v-icon
              >
            </v-btn>
            <!-- DELETE -->
            <v-btn elevation="0" fab width="20px" height="20px">
              <v-icon x-small color="orange" @click="removeWMO(float.WMO)"
                >mdi-delete</v-icon
              >
            </v-btn>
          </v-col>

          <v-col cols="12" style="font-size: x-small">{{
            getDatetime(float.WMO)
          }}</v-col>
        </v-row>
      </section>
    </section>

    <!-- ################################################# -->
    <!-- ##  PLOT -->
    <section
      v-if="showPlot"
      :style="{
        width: '100%',
        height: heightArgoPlot,
        position: 'absolute',
        bottom: 0,
      }"
    >
      <v-divider class="ma-0 pa-0" />
      <v-divider class="ma-0 pa-0" />

      <!-- VARIABLE -->
      <v-btn-toggle v-model="iPlotVariable" mandatory style="width: 100%">
        <v-btn
          :width="iPlotVariable === 0 ? '70%' : '30%'"
          class="py-3"
          :style="{
            height: '20px',
            transition: 'width .25s',
            'font-size': iPlotVariable === 0 ? 'inherit' : 'x-small',
          }"
        >
          Temperature
        </v-btn>
        <v-btn
          :width="iPlotVariable === 1 ? '70%' : '30%'"
          class="py-3"
          :style="{
            height: '20px',
            transition: 'width .25s',
            'font-size': iPlotVariable === 1 ? 'inherit' : 'x-small',
          }"
        >
          Salinity
        </v-btn>
      </v-btn-toggle>

      <!-- CONTROLS -->
      <v-row class="px-1" style="height: 20px">
        <v-icon color="primary" small @click="first()">mdi-page-first</v-icon>
        <v-icon color="primary" small @click="previous()"
          >mdi-chevron-left</v-icon
        >
        <v-icon color="primary" small @click="next()">mdi-chevron-right</v-icon>
        <v-icon color="primary" small @click="last()">mdi-page-last</v-icon>

        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
        <v-icon color="red" small @click="showPlot = false"
          >mdi-close-box</v-icon
        >
      </v-row>

      <!-- PLOT -->
      <scatter
        :data="chartData"
        :options="chartOptions"
        style="height: calc(100% - 80px)"
      />

      <!-- DETAILS -->
      <v-row style="height: 20px">
        <v-spacer></v-spacer>
        <v-col
          cols="1"
          style="
            font-size: x-small;
            font-weight: bold;
            text-align: center;
            align-self: center;
          "
          >{{ plotData.features[plotData.index].properties.mode }}</v-col
        >
        <v-col
          cols="1"
          style="
            font-size: x-small;
            font-weight: bold;
            text-align: center;
            align-self: center;
          "
          >{{ plotData.features[plotData.index].properties.cycle }}</v-col
        >
        <v-col
          cols="1"
          style="font-size: x-small; text-align: center; align-self: center"
        >
          <v-icon small>{{
            plotData.features[plotData.index].properties.direction === 'A'
              ? 'mdi-arrow-up-thin'
              : 'mdi-arrow-down-thin'
          }}</v-icon>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="5"
          style="font-size: x-small; text-align: center; align-self: center"
          >{{
            dateTimeFormat(
              plotData.features[plotData.index].properties.dateTime
            )
          }}</v-col
        >
      </v-row>

      <!-- LEGENDS -->
      <v-menu offset-y absolute>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="0"
            style="
              font-size: x-small;
              bottom: 75px;
              right: 15px;
              position: absolute;
              height: 20px;
              width: 50px;
              background: none;
            "
            v-bind="attrs"
            v-on="on"
          >
            {{ selectedCompareModel }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(compareModel, i) in compareModels" :key="i">
            <v-list-item-title @click="selectedCompareModel = compareModel">{{
              compareModel
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        elevation="0"
        :style="{
          'font-size': 'x-small',
          bottom: '90px',
          right: '15px',
          position: 'absolute',
          height: '20px',
          width: '50px',
          color: plotData.color,
          background: 'none',
        }"
      >
        Argo
      </v-btn>
    </section>

    <!-- ################################################# -->
    <!-- ##  COLOR PICKER -->
    <v-dialog v-model="showDialogColor" width="fit-content" hide-overlay>
      <v-card class="py-9" flat>
        <v-color-picker
          v-model="color"
          dot-size="25"
          hide-inputs
          hide-canvas
          hide-sliders
          show-swatches
          swatches-max-height="200"
        ></v-color-picker>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import moment from 'moment'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      showArgos: true,
      filterTypes: ['WMO', 'Date'],
      showDialogColor: false,
      color: null,
      colorWMO: null,
      showFilter: false,
      menu1: false,
      menu2: false,
      selectedDates: null,
      profileData: [],
      iPlotVariable: 0,
      showPlot: false,
      compareModels: ['HYCOM'],
      selectedCompareModel: '',
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    argoLatest() {
      return this.$store.state.argo.argoLatest
    },

    selectedFloats() {
      return this.$store.state.argo.selectedFloats
    },

    maxDate() {
      return moment.utc().format('YYYY-MM-DD')
    },

    chartData() {
      const datasets = []
      this.profileData.forEach((data, i) => {
        datasets.push({
          data,
          radius: 1,
          // borderColor: this.plotColor, // Add custom color border
          backgroundColor: i === 0 ? this.plotData.color : '#333', // Argo color: user selected ; Model: gray
        })
      })
      return { datasets }
    },

    chartOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                reverse: true,
                min: 0,
              },
            },
          ],
        },
        animation: {
          duration: 0,
        },
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        legend: {
          display: false,
        },
      }
    },

    heightArgoList() {
      return this.showPlot ? '50%' : '100%'
    },

    heightArgoPlot() {
      return this.showPlot ? '50%' : 0
    },

    plotData() {
      return this.$store.state.argo.plotData
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    color() {
      this.selectedFloats.filter((f) => f.WMO === this.colorWMO)[0].color =
        this.color.substring(0, 7)
      if (this.plotData.WMO === this.colorWMO) {
        this.plotData.color = this.color
        this.plot()
      }
    },

    iPlotVariable() {
      this.plot()
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.$store.commit('map/setSelectedLayersTab', 'argo')
    this.getLatestCoords()
    this.selectedCompareModel = this.compareModels[0]
  },

  // ###################################################################
  // ######################## --- DESTROYED --- ########################
  destroyed() {
    this.showArgos = false
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    getLatestCoords() {
      this.$axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/argoLatest`,
      }).then((res) => {
        this.$store.commit('argo/setArgoLatest', res.data)
      })
    },

    initPlot(WMO, color) {
      this.$axios({
        method: 'post',
        url: `${process.env.tuvaq2Url}/getArgoTrack`,
        data: { WMO },
      }).then((res) => {
        this.plotData.WMO = WMO
        this.plotData.color = color
        this.plotData.features = res.data.features.filter(
          (f) => f.geometry.type === 'Point'
        )
        this.plotData.index = this.plotData.features.length - 1

        this.showPlot = true
        this.plot()
      })
    },

    first() {
      this.plotData.index = 0
      this.plot()
    },

    previous() {
      if (this.plotData.index - 1 < 0) return
      this.plotData.index -= 1
      this.plot()
    },

    next() {
      const maxI = this.plotData.features.length - 1
      if (this.plotData.index + 1 > maxI) return
      this.plotData.index += 1
      this.plot()
    },

    last() {
      this.plotData.index = this.plotData.features.length - 1
      this.plot()
    },

    plot() {
      const i = this.plotData.index
      const feature = this.plotData.features[i]
      this.profileData = []

      this.$axios
        .post(`${process.env.tuvaq2Url}/getArgoProfile`, {
          WMO: this.plotData.WMO,
          cycle: feature.properties.cycle,
          mode: feature.properties.mode,
          direction: feature.properties.direction,
          iPlotVariable: this.iPlotVariable,
        })
        .then((res) => {
          const Z = res.data.Z.map((x) => parseFloat(x))
          const X = res.data.variable.map((x) => parseFloat(x))
          const n = X.length
          const data = []
          for (let i = 0; i < n; i++) {
            data.push({ x: X[i], y: Z[i] })
          }
          this.profileData.push(data)

          const maxZ = Math.max(...Z)
          // MODEL COMPARE
          if (
            moment.utc(feature.properties.dateTime) > moment.utc('20220101')
          ) {
            this.selectedCompareModel = 'HYCOM'
            this.compareModels = ['HYCOM']
            this.$axios
              .post(`${process.env.tuvaq2Url}/getModelProfile`, {
                model: 'hycom',
                dateTime: feature.properties.dateTime,
                coord: feature.geometry.coordinates,
                iVariable: this.iPlotVariable,
              })
              .then((res) => {
                const missingValue = -9999
                const Z = res.data.z.map((x) => (x === missingValue ? null : x))
                const X = res.data.values.map((x) =>
                  x === missingValue ? null : x
                )
                const n = X.length
                const data = []
                for (let i = 0; i < n; i++) {
                  if (Z[i] > maxZ) {
                    Z[i] = null
                    X[i] = null
                  }
                  data.push({ x: X[i], y: Z[i] })
                }
                this.profileData.push(data)
              })
          } else {
            this.selectedCompareModel = ''
            this.compareModels = []
          }
        })
    },

    zoom(WMO) {
      const coord = this.argoLatest.features.filter(
        (f) => f.properties.WMO === WMO
      )[0].geometry.coordinates
      this.$store.commit('map/setFlyToCoord', coord)
    },

    removeWMO(WMO) {
      this.selectedFloats.filter((f) => f.WMO === WMO)[0].show = false

      // --- Remove plot if for this WMO
      if (this.plotData.WMO === WMO) {
        this.showPlot = false
        this.plotData.index = null
      }
    },

    removeAll() {
      this.selectedFloats.forEach((f) => {
        this.removeWMO(f.WMO)
      })
    },

    changeColor(WMO) {
      this.colorWMO = WMO
      this.showDialogColor = true
      this.color = this.selectedFloats.filter((f) => f.WMO === WMO)[0].color
    },

    getDatetime(WMO) {
      const feature = this.argoLatest.features.filter(
        (f) => f.properties.WMO === WMO
      )[0]
      return moment.utc(feature.properties.dateTime).fromNow()
    },

    toggleLastLocations() {
      this.showArgos = !this.showArgos
      if (this.showArgos) this.getLatestCoords()
      else this.argoLatest.features = []
    },

    applyFilter() {
      this.selectedDates.sort()
      this.argoLatest.features = this.argoLatest.features.filter(
        (f) =>
          moment.utc(f.properties.dateTime) >=
            moment.utc(this.selectedDates[0]) &&
          moment.utc(f.properties.dateTime) <= moment.utc(this.selectedDates[1])
      )
    },

    resetFilter() {
      this.selectedDates = null
      this.getLatestCoords()
    },

    dateTimeFormat(dateTime) {
      return moment.utc(dateTime).format('MMM DD YYYY, HH:mm')
    },
  },
}
</script>

<style scoped>
.row {
  margin: 0;
  padding: 0;
}

.col {
  margin: 0;
  padding: 0;
}
</style>
