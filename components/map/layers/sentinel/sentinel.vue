<template>
  <section v-if="gj" style="font-family: monospace">
    <!-- SETTINGS -->
    <v-row class="pr-2">
      <v-col cols="auto">
        <v-icon x-small @click="showInfo = !showInfo"
          >mdi-information-variant</v-icon
        >
      </v-col>
      <v-col cols="auto">
        <v-icon
          x-small
          :color="removeSentinel ? '' : 'success'"
          @click="removeSentinel = !removeSentinel"
          >mdi-pin</v-icon
        >
      </v-col>
      <v-col cols="auto">
        <v-icon x-small @click="getLatest = !showInfo">mdi-reload</v-icon>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-icon
          x-small
          :color="filterRegion ? 'success' : ''"
          @click="filterRegion = !filterRegion"
          >mdi-selection-marker</v-icon
        >
      </v-col>
      <v-col cols="auto">
        <v-icon
          x-small
          :color="selectedDates ? 'success' : ''"
          @click="showFilter = !showFilter"
        >
          mdi-filter
        </v-icon>
      </v-col>
      <v-col cols="auto">
        <v-icon x-small @click="showPalette = !showPalette">mdi-palette</v-icon>
      </v-col>
    </v-row>

    <v-divider class="ma-1 pa-0" />

    <section style="">
      <!-- IMAGES -->
      <v-row
        v-for="(feature, i) in filteredGJ.features"
        :key="i"
        dense
        :style="{
          'font-size': 'small',
          background: rowBGcolor(i),
        }"
      >
        <v-col cols="10">
          <v-row>
            <v-col cols="auto">
              {{ getDateRange(feature.properties.fileName) }}
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">{{
              getPolarization(feature.properties.fileName)
            }}</v-col>
          </v-row>
          <v-row style="font-size: x-small">
            {{ getLongitudeRange(feature.geometry.coordinates) }}
          </v-row>
          <v-row style="font-size: x-small">
            {{ getLatitudeRange(feature.geometry.coordinates) }}
          </v-row>
        </v-col>
        <v-col cols="2" style="align-self: center; text-align: center">
          <v-icon x-small @click="loadImage(feature)"
            >mdi-magnify-plus-outline</v-icon
          >
        </v-col>
      </v-row>
    </section>

    <!-- ############################################## -->
    <!-- DIALOGS -->

    <!-- FILTER -->
    <v-dialog v-model="showFilter" width="auto">
      <v-date-picker
        v-model="selectedDates"
        range
        :min="minDate"
        :max="maxDate"
        @input="menu1 = true"
      ></v-date-picker>
      <v-btn color="warning" @click="selectedDates = null">RESET</v-btn>
    </v-dialog>

    <!-- COLOR PALETTE -->
    <v-dialog v-model="showPalette" width="400px">
      <v-card style="height: 200px">
        <!-- DROPDOWN -->
        <v-row class="ma-0 py-1">
          <v-select
            v-model="selectedPalette"
            label="Palettes"
            :items="palettes"
          >
            <template #item="{ item }">
              <v-row class="ma-1">
                <v-col cols="3" class="pa-1" style="font-size: x-small">
                  {{ item.name }}
                </v-col>
                <v-col cols="9" class="pa-1">
                  <v-sheet
                    rounded
                    :style="generatePalette(item.colors)"
                  ></v-sheet>
                </v-col>
              </v-row>
            </template>
            <template #selection="{ item }">
              {{ item.name }}
            </template>
          </v-select>
        </v-row>

        <!-- SELECTED PALETTE -->
        <v-row class="px-1">
          <v-sheet
            v-if="selectedPalette"
            rounded
            :style="generatePalette(selectedPalette.colors)"
          ></v-sheet>
        </v-row>

        <!-- MIN/MAX -->
        <v-row class="mt-4">
          <v-col cols="3">
            <v-text-field
              v-model="minPaletteValue"
              label="Min"
              :rules="positiveNums"
              hide-details
              dense
            ></v-text-field
          ></v-col>
          <v-spacer />
          <v-col cols="3">
            <v-text-field
              v-model="maxPaletteValue"
              label="Max"
              :rules="positiveNums"
              hide-details
              dense
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="pa-0 ma-0"
        ><v-btn color="primary" width="100%" @click="updatePalette"
          >Apply</v-btn
        ></v-row
      >
    </v-dialog>

    <!-- INFO -->
    <v-dialog v-model="showInfo" width="350px" scrollable>
      <v-card max-height="500px">
        <v-card-text>
          <v-card-title>SENTINEL-1</v-card-title>
          <v-card-text
            >is an imaging radar mission providing continuous all-weather,
            day-and-night imagery at C-band. The SENTINEL-1 constellation
            provides high reliability, improved revisit time, geographical
            coverage and rapid data dissemination to support operational
            applications in the priority areas of marine monitoring, land
            monitoring and emergency services.</v-card-text
          >
          <v-card-text>
            <a
              target="_blank"
              href="https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar/overview"
              >More</a
            >
          </v-card-text>

          <v-img :src="require('~/assets/images/sentinel/rows.jpg')" />

          <v-divider />

          <!-- TOP BAR -->
          <v-card-subtitle class="text-h6">Configuration Bar</v-card-subtitle>

          <v-img
            class="ma-5"
            :src="require('~/assets/images/sentinel/bar.jpg')"
          />

          <v-divider />

          <!-- COLOR PALETTE -->
          <v-card-subtitle class="text-h6"
            >Select Colormap/Range</v-card-subtitle
          >
          <v-card-text>
            Use the "Color Palette Selection" tool to change the colormap used
            for painting the Sentinel-1 images, and change the minimum and
            maximum band value. Narrowing the band range allows users to focus
            more on local features and better distinguish fine features visible
            in images.
          </v-card-text>
          <v-img
            class="ma-5"
            :src="require('~/assets/images/sentinel/colorPalette.jpg')"
          />

          <v-divider />

          <!-- DATE FILTER -->
          <v-card-subtitle class="text-h6">Filter by Date</v-card-subtitle>
          <v-card-text>
            Use the date selection tool to filter images by date. Clicking on
            any available date will show the image captured on that date only.
            Clicking on a second date will filter images between the two
            selected dates. Use the "RESET" button to go back to all available
            images. By default, images since yesterday are displayed.
          </v-card-text>
          <v-img
            class="ma-5"
            :src="require('~/assets/images/sentinel/dateSelect.jpg')"
          />

          <v-divider />

          <!-- REGION FILTER -->
          <v-card-subtitle class="text-h6"
            >Filter by Visible Region</v-card-subtitle
          >
          <v-card-text>
            By enabling this tool, images will be filtered based on the visible
            region of the map. As the user pans/zooms the map, available images
            will be filtered automatically on the right pane. Clicking on the
            icon again will turn off the filtering.
          </v-card-text>

          <v-divider />

          <!-- RELOAD -->
          <v-card-subtitle class="text-h6">Reload</v-card-subtitle>
          <v-card-text>
            Click on the "Reload" button to fetch latest available images to the
            map.
          </v-card-text>

          <v-divider />

          <v-card-text style="font-size: x-small; font-style: italic"
            >Max zoom level available: 10</v-card-text
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

export default {
  // ##############################################################
  // ######################## --- DATA --- ########################
  data() {
    return {
      showFilter: false,
      showPalette: false,
      showInfo: false,
      selectedDates: null,
      filterRegion: false,
      selectedPalette: null,
      minPaletteValue: 0,
      maxPaletteValue: 1000,
      positiveNums: [
        (value) => !!value || 'Required.',
        (value) => (value && value >= 0) || 'Positive numbers only',
      ],
      removeSentinel: true,
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################
  computed: {
    gj() {
      return this.$store.state.sentinel.gj
    },

    filteredGJ() {
      let features = this.gj.features
      if (this.selectedDates) {
        if (this.selectedDates.length === 1) {
          features = features.filter(
            (f) =>
              moment(
                f.properties.fileName.split('-')[4].replace('t', 'T')
              ).format('YYYY-MM-DD') === this.selectedDates[0]
          )
        } else {
          const dates = this.selectedDates.sort()
          features = features.filter(
            (f) =>
              moment(f.properties.fileName.split('-')[4].replace('t', 'T')) >=
                moment(dates[0]) &&
              moment(f.properties.fileName.split('-')[4].replace('t', 'T')) <=
                moment(`${dates[1]} 23:59:59`)
          )
        }
      }

      if (this.filterRegion) {
        const bounds = this.$store.state.map.bnds
        const minMapLon = bounds._sw.lng
        const minMapLat = bounds._sw.lat
        const maxMapLon = bounds._ne.lng
        const maxMapLat = bounds._ne.lat

        features = features.filter((f) => {
          let chk = false
          const coordinates = f.geometry.coordinates[0]
          const lons = _.uniq(coordinates.map((c) => parseFloat(c[0])))
          const lats = _.uniq(coordinates.map((c) => parseFloat(c[1])))

          lons.forEach((lon) => {
            lats.forEach((lat) => {
              if (
                lon > minMapLon &&
                lon < maxMapLon &&
                lat > minMapLat &&
                lat < maxMapLat
              )
                chk = true
            })
          })
          return chk
        })
      }

      const gj = {
        type: 'FeatureCollection',
        features,
      }

      this.$store.commit('sentinel/setFilteredGJ', gj)
      return gj
    },

    selected() {
      return this.$store.state.sentinel.selected
    },

    minDate() {
      const parts =
        this.gj.features[this.gj.features.length - 1].properties.fileName.split(
          '-'
        )
      return moment.utc(parts[4].replace('t', 'T')).format('YYYY-MM-DD')
    },

    maxDate() {
      const parts = this.gj.features[0].properties.fileName.split('-')
      return moment.utc(parts[4].replace('t', 'T')).format('YYYY-MM-DD')
    },

    palettes() {
      return this.$store.state.layers.palettes
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################
  watch: {
    // selectedPalette:{
    //     handler(){
    //         console.log(this.selectedPalette);
    //     },deep:true
    // }
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################
  mounted() {
    this.getLatest()

    this.selectedPalette = this.palettes[3]
    this.$store.commit('sentinel/setPalette', {
      colors: this.selectedPalette.colors,
      min: this.minPaletteValue,
      max: this.maxPaletteValue,
    })

    this.selectedDates = [
      moment.utc().subtract(1, 'days').format('YYYY-MM-DD'),
      moment.utc().format('YYYY-MM-DD'),
    ]
  },

  // ###################################################################
  // ######################## --- DESTROYED --- ########################
  destroyed() {
    if (this.removeSentinel) {
      this.$store.dispatch('map/triggerSentinelRemove')}
  },

  // #################################################################
  // ######################## --- METHODS --- ########################
  methods: {
    getLatest() {
      this.$axios({
        method: 'get',
        url: `${process.env.tuvaq2Url}/sentinelGJ`,
      }).then((res) => {
        this.$store.commit('sentinel/setGJ', res.data)
      })
    },

    loadImage(feature) {
      const minLon = feature.geometry.coordinates[0][0][0]
      const minLat = feature.geometry.coordinates[0][0][1]
      const maxLon = feature.geometry.coordinates[0][2][0]
      const maxLat = feature.geometry.coordinates[0][2][1]
      //   const n = feature.geometry.coordinates[0].length
      //   const lonAvg =
      //     feature.geometry.coordinates[0]
      //       .map((coord) => parseFloat(coord[0]))
      //       .reduce((a, b) => a + b, 0) / n
      //   const latAvg =
      //     feature.geometry.coordinates[0]
      //       .map((coord) => parseFloat(coord[1]))
      //       .reduce((a, b) => a + b, 0) / n
      this.$store.commit('map/setFitBoundsCoords', [
        [minLon, minLat],
        [maxLon, maxLat],
      ])
      this.$store.commit('sentinel/setSelected', feature)
    },

    getPolarization(fileName) {
      const parts = fileName.split('-')
      return parts[3]
    },

    getDateRange(fileName) {
      const parts = fileName.split('-')
      const startDatetime = moment
        .utc(parts[4].replace('t', 'T'))
        .format('MMM DD, HH:mm')
      const endTime = moment.utc(parts[5].replace('t', 'T')).format('HH:mm')
      return `${startDatetime} - ${endTime}`
      // s1a-ew-grd-hh-20220906t105735-20220906t105835-044883-055c69-001
    },

    getLongitudeRange(coordinates) {
      const lonMin = parseFloat(coordinates[0][0][0])
      const lonMax = parseFloat(coordinates[0][2][0])

      return `${this.num2latlon(lonMin, 'lon')} ⇢ ${this.num2latlon(
        lonMax,
        'lon'
      )}`
    },

    getLatitudeRange(coordinates) {
      const latMin = parseFloat(coordinates[0][0][1])
      const latMax = parseFloat(coordinates[0][2][1])

      return `${this.num2latlon(latMin, 'lat')} ⇢ ${this.num2latlon(
        latMax,
        'lat'
      )}`
    },

    generatePalette(colors) {
      const n = colors.length
      const colorGradient = colors
        .map(
          (color, i) =>
            `rgb(${this.hex2rgb(color)}) ${(100 * i) / n}%, rgb(${this.hex2rgb(
              color
            )}) ${(100 * i) / n}%`
        )
        .join()
      return {
        width: '100%',
        height: '20px',
        background: `linear-gradient(to right, ${colorGradient})`,
      }
    },

    updatePalette() {
      this.renewSessionID()

      this.$store.commit('sentinel/setPalette', {
        colors: this.selectedPalette.colors,
        min: this.minPaletteValue,
        max: this.maxPaletteValue,
      })

      const feature = this.$store.state.sentinel.selected
      this.$store.commit('sentinel/setSelected', null)
      this.loadImage(feature)
    },

    rowBGcolor(i) {
      if (
        this.selected &&
        this.selected.properties.fileName ===
          this.filteredGJ.features[i].properties.fileName
      )
        return 'orange'
      else if (i % 2 === 0) {
        return 'none'
      } else return 'lightgray'
    },

    // initPlot(WMO, color) {
    //   this.$axios({
    //     method: 'post',
    //     url: `${process.env.tuvaq2Url}/getArgoTrack`,
    //     data: { WMO },
    //   }).then((res) => {
    //     this.plotData.WMO = WMO
    //     this.plotData.color = color
    //     this.plotData.features = res.data.features.filter(
    //       (f) => f.geometry.type === 'Point'
    //     )
    //     this.plotData.index = this.plotData.features.length - 1

    //     this.showPlot = true
    //     this.plot()
    //   })
    // },

    // first() {
    //   this.plotData.index = 0
    //   this.plot()
    // },

    // previous() {
    //   if (this.plotData.index - 1 < 0) return
    //   this.plotData.index -= 1
    //   this.plot()
    // },

    // next() {
    //   const maxI = this.plotData.features.length - 1
    //   if (this.plotData.index + 1 > maxI) return
    //   this.plotData.index += 1
    //   this.plot()
    // },

    // last() {
    //   this.plotData.index = this.plotData.features.length - 1
    //   this.plot()
    // },

    // plot() {
    //   const i = this.plotData.index
    //   const feature = this.plotData.features[i]
    //   this.profileData = []

    //   this.$axios
    //     .post(`${process.env.tuvaq2Url}/getArgoProfile`, {
    //       WMO: this.plotData.WMO,
    //       cycle: feature.properties.cycle,
    //       mode: feature.properties.mode,
    //       direction: feature.properties.direction,
    //       iPlotVariable: this.iPlotVariable,
    //     })
    //     .then((res) => {
    //       const Z = res.data.Z.map((x) => parseFloat(x))
    //       const X = res.data.variable.map((x) => parseFloat(x))
    //       const n = X.length
    //       const data = []
    //       for (let i = 0; i < n; i++) {
    //         data.push({ x: X[i], y: Z[i] })
    //       }
    //       this.profileData.push(data)

    //       const maxZ = Math.max(...Z)
    //       // MODEL COMPARE
    //       if (
    //         moment.utc(feature.properties.dateTime) > moment.utc('20220101')
    //       ) {
    //         this.selectedCompareModel = 'HYCOM'
    //         this.compareModels = ['HYCOM']
    //         this.$axios
    //           .post(`${process.env.tuvaq2Url}/getModelProfile`, {
    //             model: 'hycom',
    //             dateTime: feature.properties.dateTime,
    //             coord: feature.geometry.coordinates,
    //             iVariable: this.iPlotVariable,
    //           })
    //           .then((res) => {
    //             const missingValue = -9999
    //             const Z = res.data.z.map((x) => (x === missingValue ? null : x))
    //             const X = res.data.values.map((x) =>
    //               x === missingValue ? null : x
    //             )
    //             const n = X.length
    //             const data = []
    //             for (let i = 0; i < n; i++) {
    //               if (Z[i] > maxZ) {
    //                 Z[i] = null
    //                 X[i] = null
    //               }
    //               data.push({ x: X[i], y: Z[i] })
    //             }
    //             this.profileData.push(data)
    //           })
    //       } else {
    //         this.selectedCompareModel = ''
    //         this.compareModels = []
    //       }
    //     })
    // },

    // zoom(WMO) {
    //   const coord = this.argoLatest.features.filter(
    //     (f) => f.properties.WMO === WMO
    //   )[0].geometry.coordinates
    //   this.$store.commit('map/setFlyToCoord', coord)
    // },

    // removeWMO(WMO) {
    //   this.selectedFloats.filter((f) => f.WMO === WMO)[0].show = false

    //   // --- Remove plot if for this WMO
    //   if (this.plotData.WMO === WMO) {
    //     this.showPlot = false
    //     this.plotData.index = null
    //   }
    // },

    // removeAll() {
    //   this.selectedFloats.forEach((f) => {
    //     this.removeWMO(f.WMO)
    //   })
    // },

    // changeColor(WMO) {
    //   this.colorWMO = WMO
    //   this.showDialogColor = true
    //   this.color = this.selectedFloats.filter((f) => f.WMO === WMO)[0].color
    // },

    // getDatetime(WMO) {
    //   const feature = this.argoLatest.features.filter(
    //     (f) => f.properties.WMO === WMO
    //   )[0]
    //   return moment.utc(feature.properties.dateTime).fromNow()
    // },

    // toggleLastLocations() {
    //   this.showArgos = !this.showArgos
    //   if (this.showArgos) this.getLatestCoords()
    //   else this.argoLatest.features = []
    // },

    // applyFilter() {
    //   this.selectedDates.sort()
    //   this.argoLatest.features = this.argoLatest.features.filter(
    //     (f) =>
    //       moment.utc(f.properties.dateTime) >=
    //         moment.utc(this.selectedDates[0]) &&
    //       moment.utc(f.properties.dateTime) <= moment.utc(this.selectedDates[1])
    //   )
    // },

    // resetFilter() {
    //   this.selectedDates = null
    //   this.getLatestCoords()
    // },

    // dateTimeFormat(dateTime) {
    //   return moment.utc(dateTime).format('MMM DD YYYY, HH:mm')
    // },

    // getWMOcolor(WMO) {
    //   const feature = this.argoLatest.features.filter(
    //     (f) => f.properties.WMO === WMO
    //   )[0]
    //   return 'color' in feature.properties ? feature.properties.color : '#000'
    // },

    // getWMOs(){
    //   this.$axios({
    //     method: 'get',
    //     url: `${process.env.tuvaq2Url}/argoWMOs`,
    //   }).then((res) => {
    //     this.WMOs = res.data
    //   })
    // }
  },
}
</script>

<style scoped>
.row {
  margin: 0;
  padding: 0 0 0 3px;
}

.col {
  margin: 0;
  padding: 0;
}

/* .v-slider__track-container{
    visibility: hidden;
} */
</style>
