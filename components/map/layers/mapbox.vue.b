<template>
  <div class="fullScreen">
    <client-only>
      <MglMap
        :access-token="accessToken"
        :map-style="mapStyle"
        :center="center"
        :zoom="zoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :max-bounds="maxBounds"
        :preserveDrawingBuffer="true"
        @load="onMapLoaded"
        @move="onMapMove"
        @mousemove="onMouseMove"
      >
        <!-- ########################## -->
        <!-- MISSION -->
        <MglGeojsonLayer
          v-if="missionData !== undefined"
          :sourceId="missionData.id + 'line'"
          :source="missionData.linestringSource"
          :layerId="missionData.id + 'line'"
          :layer="missionData.linesLayer"
        />
        <MglGeojsonLayer
          v-if="missionData !== undefined"
          :sourceId="missionData.id + 'circle'"
          :source="missionData.pointsSource"
          :layerId="missionData.id + 'circle'"
          :layer="missionData.circlesLayer"
        />
        <!-- ########################## -->
        <!-- PATH PLANNING -->
        <MglGeojsonLayer
          v-for="(result, i) in PPresults.results"
          :key="i + 'line'"
          :sourceId="result.id + 'line'"
          :source="result.linestringSource"
          :layerId="result.id + 'line'"
          :layer="result.linesLayer"
        />
        <MglGeojsonLayer
          v-for="(result, i) in PPresults.results"
          :key="i + 'circle'"
          :sourceId="result.id + 'circle'"
          :source="result.pointsSource"
          :layerId="result.id + 'circle'"
          :layer="result.circlesLayer"
        />

        <MglMarker
          v-if="PPon"
          :coordinates="PPfromCoord"
          :draggable="true"
          color="green"
          @drag="updatePPfromCoord"
        />
        <MglMarker
          v-if="PPon"
          :coordinates="PPtoCoord"
          :draggable="true"
          color="red"
          @drag="updatePPtoCoord"
        />
        <!-- ########################## -->
        <!-- DISTANCE -->
        <MglGeojsonLayer
          v-if="distanceOn"
          :sourceId="distance.id + 'line'"
          :source="distance.linestringSource"
          :layerId="distance.id + 'line'"
          :layer="distance.linesLayer"
        />
        <!-- <MglGeojsonLayer
          v-if="distance !== null"
          :sourceId="distance.id + 'circle'"
          :source="distance.pointsSource"
          :layerId="distance.id + 'circle'"
          :layer="distance.circlesLayer"
        /> -->
        <MglMarker
          v-for="(point, indx) in distance.points"
          :id="point.id"
          :key="indx"
          :coordinates="point.coordinate"
          :draggable="true"
          anchor="bottom"
          color="black"
          @drag="distancePointDrag"
        >
          <!-- <MglPopup :showed="true">
            <VCard>
              <div>Hello, I'm popup!</div>
            </VCard>
          </MglPopup> -->
        </MglMarker>
        <!-- <MglGeojsonLayer
          v-if="distance.points.length > 0"
          :sourceId="distance.id + 'text'"
          :source="distance.symbolSource"
          :layerId="distance.id + 'text'"
          :layer="distance.textLayer"
        /> -->
      </MglMap>
      <mouse-info />
    </client-only>
  </div>
</template>


<script>
import axios from 'axios'
let cancelTokenSource = axios.CancelToken.source()

import {
  resetCurrents,
  createCanvas,
  loadImageCurrents,
  initWebGL,
  frame,
  drawCurrents,
  ctx2GJ,
} from './currents'
import { removeFilledContour, addFilledContour } from './filledContour'
import {
  addBathymetry,
  modifyBathymetry,
  addBathymetryContourLines,
  boldBathymetryContourLines,
  removeBathymetry,
  removeBathymetryContourLines,
} from './bathymetry'
import { addTopography, removeTopography } from './topography'
import { addIceberg, removeIceberg } from './iceberg'
import { decodeColor } from './decodeColor'
import mouseInfo from './mouseInfo.vue'
import {
  addDistance,
  removeDistance,
  mapDistanceLinearClick,
  mapDistanceLinearMove,
  distancePointDrag,
} from './drawLine.js'

// const isSea = require('is-sea')
import get from 'is-sea'

export default {
  components: { mouseInfo },
  // ##############################################################
  // ######################## --- DATA --- ########################

  data() {
    return {
      map: null,
      accessToken:
        // 'pk.eyJ1IjoidGFpbWF6IiwiYSI6ImNrNTlzd2h2dTA3NXgza3J6aHh2cHJlbDkifQ.iY8Kc535hXfTZ4VksOUBWg',
        'pk.eyJ1Ijoib2NlYW5nbnMiLCJhIjoiY2tteXgyYjczMDRjcDJudnZwZWNramJpOSJ9.WMXJlyVCZ3Ay1tMzHVRODA',
      mapStyle: 'mapbox://styles/oceangns/ckoaj8miq072p17p97l9x6fvj?fresh=true',
      center: [-52.71, 47.56],
      zoom: 4,
      minZoom: 2,
      maxZoom: 8,
      maxBounds: [
        [-179.99, -85],
        [179.99, 85],
      ],
      imgFilledGlobal: { img: null, width: 0, height: 0 },
      // cnvFilledContour: null,
      imgCurrentsGlobal: { img: null, width: 0, height: 0 },
      cnvCurrents: null,
      resizeTrack: null,
      wind: null,
      WindGL: null,
      reqAnimID: null,
      bathymetryLevel: null,
      distance: { points: [] },
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    selected() {
      return this.$store.state.map.selected
    },

    redraw() {
      return this.$store.state.map.redraw
    },

    PPfromCoord() {
      return this.$store.state.map.PPfromCoord
    },
    PPtoCoord() {
      return this.$store.state.map.PPtoCoord
    },

    mapOpacity() {
      return { opacity: this.$store.state.map.mapOpacity }
    },

    imgBnds() {
      if (this.$store.state.map.selected === null) return null
      else return this.$store.state.map.selected.imgBnds
    },

    PPon() {
      return this.$store.state.map.PPon
    },

    PPresults() {
      return this.$store.state.map.PPresults
    },

    missionData() {
      const data = this.$store.state.missions.missionData
      if (data !== undefined) {
        return {
          id: 'mission',
          pointsSource: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'MultiPoint',
                coordinates: data.map((d) => [d.lon, d.lat]),
              },
              properties: {
                color: '#000',
                radius: 4,
                // radius: 2 + 5 * Math.exp(10 * (i / data.length - 1)),
              },
            },
          },
          circlesLayer: {
            type: 'circle',
            paint: {
              'circle-color': ['get', 'color'],
              'circle-radius': ['get', 'radius'],
            },
          },
          linestringSource: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: data.map((d) => [d.lon, d.lat]),
                  },
                  properties: { color: '#333333' },
                },
              ],
            },
          },
          linesLayer: {
            type: 'line',
            paint: {
              'line-color': ['get', 'color'],
              'line-width': 4,
            },
          },
        }
      } else {
        return undefined
      }
    },

    showBathymetry() {
      return this.$store.state.map.showBathymetry
    },

    showBathymetryContourLines() {
      return this.$store.state.map.showBathymetryContourLines
    },

    bathymetryOpacity() {
      return this.$store.state.map.bathymetryOpacity
    },

    mouseCoordinate() {
      return [
        this.$store.state.map.mouseCoordinate.lng,
        this.$store.state.map.mouseCoordinate.lat,
      ]
    },

    distanceOn() {
      this.$store.state.map.distanceOn
        ? this.addDistance()
        : this.removeDistance()
      return this.$store.state.map.distanceOn
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    this.WindGL = initWebGL()

    window.addEventListener('resize', () => {
      this.map.off('moveend', this.onMapMoveEnd)
      clearTimeout(this.resizeTrack)
      this.resizeTrack = setTimeout(this.resizeEnd, 100)
    })
  },

  // created() {
  //   map = Mapbox
  //   console.log(map);
  // },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    createCanvas,
    addFilledContour,
    loadImageCurrents,
    initWebGL,
    drawCurrents,
    frame,
    resetCurrents,
    removeFilledContour,
    addBathymetry,
    modifyBathymetry,
    addBathymetryContourLines,
    boldBathymetryContourLines,
    removeBathymetry,
    removeBathymetryContourLines,
    addTopography,
    removeTopography,
    addIceberg,
    removeIceberg,
    decodeColor,
    ctx2GJ,
    addDistance,
    removeDistance,
    mapDistanceLinearClick,
    mapDistanceLinearMove,
    distancePointDrag,

    onMapLoaded(e) {
      console.log(e)
      this.map = e.map
      this.map.on('moveend', this.onMapMoveEnd)

      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())

      this.addTopography()
      // --- Initiate a layer
      document.getElementById('Currents_HYCOM').click()
      this.addBathymetry()
      // document.getElementById('SST_JPLMUR41').click()
      // document.getElementById('Chlorophyll_NESDIS').click()
    },

    onMapMove() {
      const dLon =
        this.$store.state.map.bnds._ne.lng - this.$store.state.map.bnds._sw.lng
      const dLat =
        this.$store.state.map.bnds._ne.lat - this.$store.state.map.bnds._sw.lat

      if (
        this.selected.field !== 'Currents' &&
        (Math.abs(
          this.$store.state.map.bnds._ne.lng - this.map.getBounds()._ne.lng
        ) >
          0.1 * dLon ||
          Math.abs(
            this.$store.state.map.bnds._ne.lat - this.map.getBounds()._ne.lat
          ) >
            0.1 * dLat)
      ) {
        this.onMapMoveEnd()
      }
    },

    onMapMoveEnd() {
      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())
      if (this.selected.field === 'Currents') this.drawCurrents()
      //   : this.addFilledContour()
    },

    onMouseMove(e) {
      this.$store.commit('map/setMouseCoordinate', e.mapboxEvent.lngLat)
      this.$store.commit('map/setMouseXY', e.mapboxEvent.point)

      if (
        this.$store.state.map.showMouseInfo &&
        get(e.mapboxEvent.lngLat.lat, e.mapboxEvent.lngLat.lng)
      ) {
        const canvas = this.map.getCanvas()
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
        if (gl) {
          const { x, y } = e.mapboxEvent.point
          const data = new Uint8Array(4)
          const canvasX = x - canvas.offsetLeft
          const canvasY = canvas.height - y - canvas.offsetTop
          gl.readPixels(canvasX, canvasY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data)
          const [r, g, b, a] = data
          this.$store.commit('map/setMouseInfoValue', this.decodeColor(r, g, b))
        }
      }

      if (this.showBathymetryContourLines) this.boldBathymetryContourLines(e)
    },

    updatePPfromCoord(e) {
      const coord = [e.marker._lngLat.lng, e.marker._lngLat.lat]
      this.$store.commit('map/setPPfromCoordinate', coord)
    },
    updatePPtoCoord(e) {
      const coord = [e.marker._lngLat.lng, e.marker._lngLat.lat]
      this.$store.commit('map/setPPtoCoordinate', coord)
    },

    resizeEnd() {
      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())

      this.$store.dispatch('map/redraw')
      this.map.on('moveend', this.onMapMoveEnd)
      // if (this.selected.field === 'Currents') {
      //   this.reset()
      //   this.createCanvas()
      //   this.drawCurrents()
      // }
      // : this.addFilledContour()
    },

    getAvailDateTimes(data) {
      cancelTokenSource.cancel()

      cancelTokenSource = axios.CancelToken.source()
      axios({
        method: 'post',
        url: `${process.env.baseUrl}/getAvailDateTimes`,
        data, // --- instead of data: data
        cancelToken: cancelTokenSource.token,
      })
        .then((results) => {
          const availDates = results.data.map((d) => {
            const arr = d.split('_')
            return { date: arr[0], time: arr[1] }
          })
          this.$store.commit('layers/setAvailDateTimes', availDates)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    removeAllLayers() {
      this.resetCurrents()
      this.removeFilledContour()
      this.removeIceberg()
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  watch: {
    // --- Change of model -> Initiate availDateTimes and the rest
    selected() {
      // --- If selected changed, remove all layers first, then add the selected one
      this.removeAllLayers()

      if (this.selected.field === 'Currents') {
        this.getAvailDateTimes({
          field: this.$store.state.map.selected.field,
          model: this.$store.state.map.selected.modelDir,
          fileType: 'jpg',
          hasHighRes: this.$store.state.map.selected.hasHighRes,
        })
      } else if (this.selected.field === 'Iceberg') {
        this.addIceberg()
      } else {
        this.getAvailDateTimes({
          field: this.$store.state.map.selected.field,
          model: this.$store.state.map.selected.modelDir,
          fileType: 'tiles',
          hasHighRes: false,
        })
      }
    },

    redraw() {
      if (this.selected.field === 'Currents') {
        this.resetCurrents()
        this.cnvCurrents = this.createCanvas()
        const ctxCurrents = this.cnvCurrents.getContext('webgl', {
          antialiasing: false,
        })
        this.wind = new this.WindGL(ctxCurrents)
        this.loadImageCurrents()
      } else if (this.selected.field === 'Iceberg') {
        null
      } else {
        this.addFilledContour()
      }
    },

    bathymetryOpacity() {
      if (this.bathymetryOpacit == 0) {
        this.removeBathymetry()
      } else if (this.bathymetryOpacity == 1) {
        this.addBathymetry()
      } else this.modifyBathymetry(this.bathymetryOpacity)
    },

    showBathymetryContourLines() {
      this.showBathymetryContourLines
        ? this.addBathymetryContourLines()
        : this.removeBathymetryContourLines()
    },

    imgBnds() {
      if (this.map && this.imgBnds.minLon !== -180) {
        this.map.fitBounds(
          [
            [this.imgBnds.minLon, this.imgBnds.minLat],
            [this.imgBnds.maxLon, this.imgBnds.maxLat],
          ],
          { padding: 20 }
        )
      }
    },

    PPresults() {
      if (!this.PPresults.show) {
        this.map
          .getStyle()
          .layers.filter((layer) => layer.id.slice(0, 3) === 'PP_')
          .forEach((layer) => {
            this.map.removeLayer(layer.id)
            this.map.removeSource(layer.id)
          })
      }
    },
  },
}
</script>


<style>
.mapboxgl-popup-tip {
  border: none;
}

.mapboxgl-popup-content {
  background: none !important;
  box-shadow: none !important;
}
</style>