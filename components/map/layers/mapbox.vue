<template>
  <div
    id="map"
    ref="map"
    :style="{
      width: '100%',
      height: '100%',
      position: 'absolute',
    }"
  >
    <!-- ##  CONFIRM DELETE -->
    <v-dialog v-model="showConfirmDelete" width="200px" persistent>
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Do you really want to remove them?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="showConfirmDelete = false">Yep!</v-btn>
          <v-btn @click="restoreDeletedDrawFeatures">Nope</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import PNG from 'pngjs3'
import axios from 'axios'
import moment from 'moment'

// import get from 'is-sea'
import tilebelt from '@mapbox/tilebelt'
import _ from 'lodash'

import { updateProfile } from '../profile/profile'
import { updateDistance } from '../profile/distance'

// CURRENTS
import {
  loadImageCurrents,
  loadImageWind,
  onAllLoadedCurrents,
  removeCurrents,
} from './currents/currents'
import {
  staticPrepare,
  generateGJ,
  updateStaticCurrentsLayer,
} from './currents/currentsStatic'
import {
  createAnimCanvas,
  clearAnimCanvas,
  animPrepare,
  initWebGL,
  frame,
} from './currents/currentsAnim'

import { removeFilledContour, addFilledContour } from './filledContour'
import {
  addBathymetry,
  removeBathymetry,
  addBathymetryFilled,
  modifyBathymetryFilled,
  removeBathymetryFilled,
  addBathymetryContours,
  modifyBathymetryContours,
  removeBathymetryContours,
  addBathymetryBoundaries,
  removeBathymetryBoundaries,
  addBathymetryNOAAregions,
  removeBathymetryNOAAregions,
} from './bathymetry'
import { addTopography, removeTopography } from './topography'
// import { addIceberg, removeIceberg } from './iceberg'
import { decodeColor, decodeColorCurrent } from './decodeColor'
import mouseInfo from './mouseInfo.vue'
import { addPulsingDot, updatePulsingDot, removePulsingDot } from './pulsingDot'
import { toggleAltimetry, updateAltimetry } from './altimetry/altimetry'
import { updateAIS } from './AIS/AIS'

import {
  updateArgoCoordinates,
  argoClicked,
  updateArgoTracks,
  updateArgoProfilePoint,
} from './argo/argo'

// const isSea = require('is-sea')

// import { useWindowSize } from 'vue-window-size';

export default {
  components: { mouseInfo },
  // ##############################################################
  // ######################## --- DATA --- ########################

  data() {
    return {
      map: null,
      draw: null,
      accessToken:
        'pk.eyJ1Ijoib2NlYW5nbnMiLCJhIjoiY2tteXgyYjczMDRjcDJudnZwZWNramJpOSJ9.WMXJlyVCZ3Ay1tMzHVRODA',
      mapStyle: 'mapbox://styles/oceangns/ckoaj8miq072p17p97l9x6fvj?fresh=true',
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 14,
      maxBounds: [
        [-179.99, -85],
        [179.99, 85],
      ],
      imgFilledGlobal: { img: null, width: 0, height: 0 },
      imgCurrentsGlobal: { img: null, width: 0, height: 0 },
      cnvCurrents: null,
      ctxCurrents: null,
      resizeTrack: null,
      wind: null,
      WindGL: null,
      reqAnimID: null,
      bathymetryLevel: null,
      drawLine: false,
      lineOperations: [],
      lines: { markers: [] },
      clientWidth: 0,
      clientHeight: 0,

      lastTile: '', // --- stores the url of the last active layer tile loaded for reading values
      imgLayerData: null,
      layersOrder: [
        'bathymetryFilled',
        'filled_ocn',
        'Currents',
        'bathymetryContourLines',
        'bathymetryContourLabels',
        'altimetry',
        'AIS',
        'bathymetryBoundaries',
        'lines.line',
        'lines.text',
        'pulsingDot',
        'gl-draw',
        'distance',
        'argo',
        // --- LAND
        'country-boundaries',
        // --- ATMOSPHERE
        'filled_atm',
        'wind',
        // --- MAP STUFF
        'tunnel',
        'road',
        'bridge',
        'country-label',
        'state-label',
        'settlement',
      ], // --- Last on top
      showConfirmDelete: false,
      deletedDrawFeatures: [],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    selected() {
      return this.$store.state.layers.selected
    },

    selectedField() {
      return this.$store.state.layers.categories
        .filter((c) => c.name === this.selected.category)[0]
        .fields.filter((f) => f.name === this.selected.field)[0]
    },

    fieldAndModel() {
      if (this.$store.state.layers.selected !== null)
        return (
          this.$store.state.layers.selected.field +
          this.$store.state.layers.selected.modelDir
        )
      else return null
    },

    colormap() {
      if (this.selected) return this.selectedField.colorbar.colormap
      else return this.$store.state.layers.bathymetries.colorbar.colormap
    },

    redraw() {
      return this.$store.state.map.redraw
    },

    mapOpacity() {
      return { opacity: this.$store.state.map.mapOpacity }
    },

    imgBnds() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected.imgBnds
    },

    selectedBathymetry() {
      return this.$store.state.layers.selectedBathymetry
    },

    showBathymetry() {
      return this.$store.state.map.showBathymetry
    },

    showBathymetryBoundaries() {
      return this.$store.state.map.showBathymetryBoundaries
    },
    showBathymetryContours() {
      return this.$store.state.map.showBathymetryContours
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
      return this.$store.state.map.distanceOn
    },

    width() {
      return window.innerWidth
    },
    height() {
      return window.innerHeight
    },

    flyToCoord() {
      return this.$store.state.map.flyToCoord
    },

    fitBoundsCoords() {
      return this.$store.state.map.fitBoundsCoords
    },

    pins() {
      return this.$store.state.map.pins
    },
    pinsNumber() {
      return this.$store.state.map.pins.length
    },

    currentsMin() {
      return this.$store.state.map.currentsMin
    },

    currentsMax() {
      return this.$store.state.map.currentsMax
    },

    selectedBathymetryContourLevels() {
      return this.$store.state.map.selectedBathymetryContourLevels
    },

    rightBarContent() {
      return this.$store.state.map.rightBarContent
    },

    WPpins() {
      return this.$store.state.WPgen.WPpins
    },
    noWPpins() {
      return this.WPpins.length
    },

    currentsDirectionOn() {
      return this.$store.state.map.currentsDirectionOn
    },

    activeLayerOpacity() {
      return this.$store.state.map.activeLayerOpacity
    },

    maxWindSpeed(){
return this.$store.state.map.maxWindSpeed
    },

    showLayers() {
      return this.$store.state.map.showLayers
    },

    drawMode() {
      return this.$store.state.map.drawMode
    },

    drawSelectedFeatures: {
      get() {
        return this.$store.state.map.drawSelectedFeatures
      },
      set(array) {
        this.$store.commit('map/setDrawSelectedFeatures', array)
      },
    },

    activeLayerValueAtMouseStatus() {
      return this.$store.state.map.activeLayerValueAtMouseStatus
    },

    selectedAltimetrySatellites() {
      return this.$store.state.layers.selectedAltimetrySatellites
    },
    selectedAltimetryDates() {
      return this.$store.state.layers.selectedAltimetryDates
    },
    selectedAltimetryVariable() {
      return this.$store.state.layers.selectedAltimetryVariable
    },
    altimetryMapboxColormap() {
      return this.$store.state.map.altimetryMapboxColormap
    },

    AISselectedYear() {
      return this.$store.state.map.AISselectedYear
    },
    AISselectedMonthIndex() {
      return this.$store.state.map.AISselectedMonthIndex
    },

    profileCoords() {
      return this.$store.state.map.profile.coords
    },
    distanceCoords() {
      return this.$store.state.map.distance.coords
    },

    colors() {
      return this.$store.state.map.colors
    },

    currentsLocked() {
      return this.$store.state.map.currentsLocked
    },

    updatedDrawProperties() {
      return this.$store.state.map.updatedDrawProperties
    },

    updatedDrawCoordinates() {
      return this.$store.state.map.updatedDrawCoordinates
    },

    mapResize() {
      return this.$store.state.map.mapResize
    },

    // --- ARGO
    argoLatest() {
      return this.$store.state.argo.argoLatest
    },

    selectedFloats() {
      return this.$store.state.argo.selectedFloats
    },

    argoPlotData() {
      return this.$store.state.argo.plotData
    },

    currentsAnimationOn: {
      get() {
        return this.$store.state.map.currentsAnimationOn
      },
      set(status) {
        this.$store.commit('map/setCurrentsAnimationOn', status)
      },
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  watch: {
    // --- Change of model -> Initiate availDateTimes and the rest
    fieldAndModel(newVal, oldVal) {
      this.removeAllLayers()
      if (this.selected === null) {
        this.addBathymetry()
        return null
      }

      if (
        this.selected.field === 'Currents' ||
        this.selected.field === 'wind'
      ) {
        // this.addBathymetry()
        this.$store.commit(
          'layers/setDate',
          this.$store.state.map.now.format('YYYYMMDD')
        )
        this.$store.commit(
          'layers/setTime',
          this.$store.state.map.now.format('HH')
        )
        // if (this.selected.depthProperties.hasDepth)
        //   this.$store.commit(
        //     'layers/setDepth',
        //     this.selected.depthProperties.depthValues.length - 1
        //   )
        // else
        this.$store.commit('layers/setDepth', 0)
        this.$store.commit('map/setRedraw', true)
        // } else if (this.selected.field === 'Iceberg') {
        //   this.addIceberg()
      } else {
        // --- FILLED CONTOURS
        this.removeBathymetryFilled()
        this.$store.commit(
          'layers/setDate',
          this.$store.state.map.now.format('YYYYMMDD')
        )
        this.$store.commit(
          'layers/setTime',
          this.$store.state.map.now.format('HH')
        )
        this.$store.dispatch('map/setRedrawTrue')
      }

      if (newVal === null || oldVal === null) this.map.resize()
    },

    redraw(n, o) {
      if (this.redraw) {
        if (this.selected !== null) {
          if (
            this.selected.field === 'Currents' ||
            this.selected.field === 'wind'
          ) {
            // if (this.currentsDirectionOn)
            this.loadImageCurrents()

            if (this.selected.field === 'Currents') this.addFilledContour()
            // } else if (this.selected.field === 'Iceberg') {
            //   return null
          } else {
            this.addFilledContour()
          }
        } else {
          this.addBathymetry()
        }

        if (this.drawMode === 'profile') this.updateProfile()
      }
    },

    colormap: {
      handler() {
        this.$store.dispatch('map/setRedrawTrue')
      },
      deep: true,
    },

    selectedBathymetry() {
      this.removeAllLayers()
      if (this.selectedBathymetry === null) this.removeBathymetry()
      else this.addBathymetry()
    },

    bathymetryOpacity() {
      this.modifyBathymetryFilled()
    },

    showBathymetryBoundaries() {
      this.showBathymetryBoundaries
        ? this.addBathymetryBoundaries()
        : this.removeBathymetryBoundaries()
    },

    showBathymetryContours() {
      this.showBathymetryContours
        ? this.addBathymetryContours()
        : this.removeBathymetryContours()
    },

    activeLayerOpacity() {
      if (this.selected) {
        // if (
        //   this.selected.field === 'Currents' ||
        //   this.selected.field === 'wind'
        // )
        //   if (this.currentsAnimationOn)
        //     this.map.setPaintProperty(
        //       'currents',
        //       'raster-opacity',
        //       this.activeLayerOpacity
        //     )
        //   else {
        //     this.map.setPaintProperty(
        //       'currents',
        //       'icon-opacity',
        //       this.activeLayerOpacity
        //     )
        //   }
        // else {
        const layers = this.map
          .getStyle()
          .layers.filter((layer) => layer.id.includes('filled'))
        layers.forEach((layer) => {
          this.map.setPaintProperty(
            layer.id,
            'raster-opacity',
            this.activeLayerOpacity
          )
        })
        // }
      }
    },

    maxWindSpeed(){
      this.$store.dispatch('map/setRedrawTrue')
    },

    distanceOn() {
      if (this.distanceOn) {
        this.lineOperations.push('distance')
        this.drawLine = true
        this.map.setLayoutProperty('lines.text', 'visibility', 'visible')
      } else {
        this.lineOperations = this.lineOperations.filter(
          (lo) => lo !== 'distance'
        )
        if (this.lineOperations.length === 0) this.drawLine = false
        else {
          // --- Hide distance labels
          this.map.setLayoutProperty('lines.text', 'visibility', 'none')
        }
      }
    },

    flyToCoord: {
      handler() {
        this.map.flyTo({ center: this.flyToCoord, zoom: 8 })
      },
      deep: true,
    },

    fitBoundsCoords: {
      handler() {
        this.map.fitBounds(this.fitBoundsCoords)
      },
      deep: true,
    },

    currentsMin() {
      // --- Only if changed by the settings dialog
      // if (this.$store.state.map.showSettings) {
      if (
        this.selected &&
        (this.selected.field === 'Currents' ||
          this.selected.field === 'wind') &&
        !this.currentsAnimationOn
      ) {
        const gj = this.generateGJ()
        this.updateStaticCurrentsLayer(gj)
      }

      // --- Update missions velocity arrows if needed
      this.missions.forEach((mission, i) => {
        if (
          mission.selectedProperty &&
          mission.selectedProperty.includes('Velocity')
        ) {
          const gj = this.generateVelocityLayerGJ(mission.selectedProperty, i)
          this.updatePropertyVelocityLayer(i, gj)
        }
      })
      // }
    },
    currentsMax() {
      // --- Only if changed by the settings dialog
      // if (this.$store.state.map.showSettings) {
      if (
        this.selected &&
        (this.selected.field === 'Currents' ||
          this.selected.field === 'wind') &&
        !this.currentsAnimationOn
      ) {
        const gj = this.generateGJ()
        this.updateStaticCurrentsLayer(gj)
      }

      // --- Update missions velocity arrows if needed
      this.missions.forEach((mission, i) => {
        if (
          mission.selectedProperty &&
          mission.selectedProperty.includes('Velocity')
        ) {
          const gj = this.generateVelocityLayerGJ(mission.selectedProperty, i)
          this.updatePropertyVelocityLayer(i, gj)
        }
      })
      // }
    },

    selectedBathymetryContourLevels: {
      handler() {
        this.modifyBathymetryContours()
      },
      deep: true,
    },

    pinsNumber() {
      this.pins.forEach((pin) => {
        pin.marker.addTo(this.map)
      })
    },

    currentsDirectionOn() {
      // if (this.currentsDirectionOn)
      this.loadImageCurrents()
      // else this.removeCurrents()
    },

    currentsAnimationOn() {
      this.removeCurrents()
      this.$store.dispatch('map/setRedrawTrue')
    },

    showLayers() {
      this.map.resize()
    },

    drawMode() {
      // --- Remove previous draw if already there
      if (this.draw) {
        this.map.removeControl(this.draw)
        this.draw = null
        // --- Remove distance layer if already there
        if (this.map.getSource('distance')) {
          this.map.removeLayer('distance')
          this.map.removeSource('distance')
        }
      }

      if (this.drawMode) {
        if (this.drawMode === 'log') {
          this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              point: true,
              line_string: true,
              polygon: true,
              trash: true,
            },
            userProperties: true,
            styles: this.$store.state.map.MBdefaultDrawStyles.concat([
              {
                id: 'gl-draw-line-user',
                type: 'line',
                filter: [
                  'all',
                  ['==', '$type', 'LineString'],
                  ['has', 'user_color'],
                ],
                paint: {
                  'line-color': ['get', 'user_color'],
                  'line-width': ['get', 'user_thickness'],
                },
              },
              {
                id: 'gl-draw-polygon-user',
                type: 'line',
                filter: [
                  'all',
                  ['==', 'active', 'false'],
                  ['==', '$type', 'Polygon'],
                  ['!=', 'mode', 'static'],
                ],
                paint: {
                  'line-color': ['get', 'user_color'],
                  'line-width': ['get', 'user_thickness'],
                },
              },
            ]),
          })
          this.map.addControl(this.draw, 'top-right')

          // --- Initial addition of loaded features if not added once before
          // let features = this.$store.state.map.drawGJ.features
          // if (features.length === 0)

          // const features = this.logSelectedMission.logs.features
          // const gj = { type: 'FeatureCollection', features }

          if (this.logSelectedMission)
            this.draw.set(this.logSelectedMission.logs)
        } else if (
          this.drawMode === 'profile' ||
          this.drawMode === 'distance'
        ) {
          this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              line_string: true,
              trash: true,
            },
            userProperties: true,
            styles: this.$store.state.map.MBdefaultDrawStyles.concat([
              {
                id: 'gl-draw-line-user',
                type: 'line',
                filter: [
                  'all',
                  ['==', '$type', 'LineString'],
                  ['has', 'user_color'],
                ],
                paint: {
                  'line-color': ['get', 'user_color'],
                },
              },
            ]),
          })

          this.map.addControl(this.draw, 'top-right')
        }

        // const gj = this.draw.getAll()
        // this.$store.commit('map/setDrawGJ', gj)
      }

      this.map.resize()
    },

    profileCoords: {
      handler() {
        this.updateProfile()
      },
      deep: true,
    },

    selectedAltimetrySatellites: {
      handler() {
        this.toggleAltimetry()
      },
      deep: true,
    },

    selectedAltimetryDates: {
      handler() {
        this.toggleAltimetry()
      },
      deep: true,
    },

    selectedAltimetryVariable() {
      this.toggleAltimetry()
    },

    altimetryMapboxColormap() {
      if (this.selectedAltimetryVariable) this.toggleAltimetry()
    },

    AISselectedYear() {
      this.updateAIS()
    },
    AISselectedMonthIndex() {
      this.updateAIS()
    },

    updatedDrawProperties: {
      handler() {
        // this.draw.setFeatureProperty(
        //   this.updatedDrawProperties.id,
        //   this.updatedDrawProperties.property,
        //   this.updatedDrawProperties.value
        // )
        // const gj = this.draw.getAll()
        // this.$store.commit('map/setDrawGJ', gj)
      },
      deep: true,
    },

    updatedDrawCoordinates: {
      handler() {
        const gj = this.draw.getAll()
        const feature = gj.features.filter(
          (f) => f.id === this.updatedDrawCoordinates.id
        )[0]
        feature.geometry.coordinates = this.updatedDrawCoordinates.coordinates
        this.draw.set(gj)
        this.$store.commit('map/setDrawGJ', gj)
      },
      deep: true,
    },

    mapResize() {
      if (this.mapResize) this.map.resize()
    },

    // --------------------------------------------------
    // --- ARGO
    argoLatest: {
      handler() {
        this.updateArgoCoordinates()
      },
      deep: true,
    },

    selectedFloats: {
      handler() {
        this.updateArgoTracks()
      },
      deep: true,
    },

    'argoPlotData.index'() {
      this.updateArgoProfilePoint()
    },
  },

  // #################################################################
  // ######################## --- MOUNTED --- ########################

  mounted() {
    this.clientWidth = this.$refs.map.clientWidth
    this.clientHeight = this.$refs.map.clientHeight

    // --- Initialte mapbox
    mapboxgl.accessToken = this.accessToken
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      center: this.center,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      // maxBounds: this.maxBounds,
      preserveDrawingBuffer: true,
    })
    console.log(this.map)

    // ################################
    // --- DRAWING TOOLS
    this.map.on('draw.create', this.updateDraw)
    this.map.on('draw.delete', this.deleteDraw)
    this.map.on('draw.update', this.updateDraw)
    this.map.on('draw.selectionchange', (e) => {
      this.drawSelectedFeatures = e.features
    })

    this.map.on('load', this.onMapLoad)
    this.map.on('idle', this.setMapIdle)
    this.map.on('move', this.onMapMove)
    this.map.on('moveend', this.onMapMoveEnd)
    this.$store.commit('map/setMapZoom', this.zoom)

    // --- Add arrow images for currents
    this.map.loadImage(
      'https://api.oceangns.com/images/arrowBlack.png',
      (err, img) => {
        if (err) {
          console.log(err)
        }

        this.map.addImage('arrowBlack', img)
      }
    )
    this.map.loadImage(
      'https://api.oceangns.com/images/arrowRed.png',
      (err, img) => {
        if (err) {
          console.log(err)
        }

        this.map.addImage('arrowRed', img)
      }
    )
    this.map.loadImage(
      'https://api.oceangns.com/images/arrowBlue.png',
      (err, img) => {
        if (err) {
          console.log(err)
        }

        this.map.addImage('arrowBlue', img)
      }
    )

    // --- Initiate current/wind animation
    this.cnvCurrents = this.createAnimCanvas()
    this.ctxCurrents = this.cnvCurrents.getContext('webgl', {
      antialiasing: false,
    })
    this.WindGL = initWebGL()
    this.wind = new this.WindGL(this.ctxCurrents)

    window.addEventListener('resize', (e) => {
      this.clientWidth = this.$refs.map.clientWidth
      this.clientHeight = this.$refs.map.clientHeight
      this.map.off('moveend', this.onMapMoveEnd)
      clearTimeout(this.resizeTrack)
      this.resizeTrack = setTimeout(this.resizeEnd, 100)
    })

    // --- Create canvas to help reading layer values
    const cnvTmpLayer = document.createElement('canvas')
    cnvTmpLayer.width = 512
    cnvTmpLayer.height = 512
    const ctxTmpInsideLayer = cnvTmpLayer.getContext('2d')
    this.ctxTmpLayer = ctxTmpInsideLayer
    this.imgLayer = new Image()
    this.imgLayer.crossOrigin = 'Anonymous'
    const that = this
    this.imgLayer.onload = function () {
      ctxTmpInsideLayer.clearRect(0, 0, cnvTmpLayer.width, cnvTmpLayer.height)
      ctxTmpInsideLayer.drawImage(this, 0, 0)
      that.imgLoaded = true
    }
    this.imgLayer.onerror = function () {
      that.imgLoaded = false
    }
  },

  // #################################################################
  // ######################## --- METHODS --- ########################

  methods: {
    // --- CURRENTS
    loadImageCurrents,
    loadImageWind,
    onAllLoadedCurrents,
    removeCurrents,

    // --- CURRENTS STATIC
    staticPrepare,
    generateGJ,
    updateStaticCurrentsLayer,

    // --- CURRENTS ANIMATION
    createAnimCanvas,
    clearAnimCanvas,
    animPrepare,
    initWebGL,
    frame,

    // --- FILLED CONTOURS
    addFilledContour,
    removeFilledContour,
    addBathymetry,
    removeBathymetry,
    // --- BATHYMETRY
    addBathymetryFilled,
    modifyBathymetryFilled,
    removeBathymetryFilled,
    addBathymetryContours,
    modifyBathymetryContours,
    removeBathymetryContours,
    addBathymetryBoundaries,
    removeBathymetryBoundaries,
    addBathymetryNOAAregions,
    removeBathymetryNOAAregions,
    // ---
    addTopography,
    removeTopography,
    // addIceberg,
    // removeIceberg,
    decodeColor,
    decodeColorCurrent,

    // --- PULSING DOT
    addPulsingDot,
    updatePulsingDot,
    removePulsingDot,

    // --- ALTIMETRY
    toggleAltimetry,
    updateAltimetry,
    // --- AIS
    updateAIS,
    // --- PROFILE
    updateProfile,
    updateDistance,

    // --- ARGO
    updateArgoCoordinates,
    argoClicked,
    updateArgoTracks,
    updateArgoProfilePoint,

    onMapLoad() {
      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())

      this.addBathymetry()
      // --- Add contour lines and labels
      this.$store.commit('map/setShowBathymetryBoundaries', false)
      this.$store.commit('map/setShowBathymetryContours', true)
      // this.$store.commit('map/setBathymetryContourLabels', true)

      this.initDepthReading()
      this.map.on('mousemove', this.onMouseMove)
    },

    onMapMove() {
      if (
        this.selected !== null &&
        (this.selected.field === 'Currents' ||
          this.selected.field === 'wind') &&
        this.currentsAnimationOn
      )
        this.clearAnimCanvas()
      // const dLon =
      //   this.$store.state.map.bnds._ne.lng - this.$store.state.map.bnds._sw.lng
      // const dLat =
      //   this.$store.state.map.bnds._ne.lat - this.$store.state.map.bnds._sw.lat

      // if (this.selected !== null) {
      //   if (
      //     this.selected.field !== 'Currents' &&
      //     (Math.abs(
      //       this.$store.state.map.bnds._ne.lng - this.map.getBounds()._ne.lng
      //     ) >
      //       0.1 * dLon ||
      //       Math.abs(
      //         this.$store.state.map.bnds._ne.lat - this.map.getBounds()._ne.lat
      //       ) >
      //         0.1 * dLat)
      //   ) {
      //     this.onMapMoveEnd()
      //   }
      // }
    },
    onMapMoveEnd() {
      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())
      if (
        this.selected !== null &&
        (this.selected.field === 'Currents' || this.selected.field === 'wind')
      ) {
        // this.resetCurrents()
        // this.drawCurrents()
        // this.loadImageCurrents()
        this.$store.dispatch('map/setRedrawTrue')
      }
    },

    onMouseMove(e) {
      this.$store.commit('map/setMouseCoordinate', e.lngLat)
      this.$store.commit('map/setMouseXY', e.point)

      // --- GET DEPTH & ACTIVE LAYER VALUE
      this.$store.commit('map/setDepthAtMouse', this.getDepth(e.lngLat)) // --- In functions.js
      if (this.activeLayerValueAtMouseStatus) this.getActiveLayerValue(e.lngLat)
    },

    roundZoom() {
      this.map.setZoom(Math.round(this.map.getZoom()))
      this.$store.commit('map/setMapZoom', this.map.getZoom())
    },

    resizeEnd() {
      this.map.on('moveend', this.onMapMoveEnd)
      this.onMapMoveEnd()
    },

    removeAllLayers() {
      // this.resetCurrents()
      if (!this.currentsLocked) this.removeCurrents()
      this.removeFilledContour()
      // this.removeIceberg()
    },

    // #############################
    // --- READ ACTIVE LAYER VALUE
    getActiveLayerValue(coord) {
      let field, model, date, time
      if (this.$store.state.layers.selected === null)
        this.$store.commit('map/setLayerValueAtMouse', '-')
      else {
        field = this.selected.field
        model = this.selected.modelDir
        date = this.$store.state.layers.interDate
        time = this.$store.state.layers.interTime

        // const zoom = 7 // Math.min(Math.round(this.map.getZoom()), 7) // --- tiles max zoom level = 7
        const zoom = Math.min(7, this.$store.state.map.mapZoom)
        const tileAddress = tilebelt.pointToTileFraction(
          coord.lng,
          coord.lat,
          zoom
        )

        const x = tileAddress[0]
        const X = parseInt(x)
        const y = tileAddress[1]
        const Y = parseInt(y)

        const xRem = Math.round(512 * (x - X))
        const yRem = Math.round(512 * (y - Y))

        let depth = ''
        if (this.$store.state.layers.selected.depthProperties.hasDepth) {
          depth =
            '_' +
            this.$store.state.layers.selected.depthProperties.depthValues[
              this.$store.state.layers.selected.depthProperties.iDepth
            ]
        }

        const promisses = []

        let tile
        if (
          this.selected.field === 'Currents' ||
          this.selected.field === 'wind'
        ) {
          ;['U', 'V'].forEach((dir) => {
            tile = `${process.env.tuvaq2Url}/mapTiles/${field}/${model}/tiles${dir}/${model}_${field}_${date}_${time}${depth}/${zoom}/${X}/${Y}.png`
            promisses.push(
              axios({
                method: 'get',
                url: tile,
                responseType: 'arraybuffer',
              })
            )
          })
        } else {
          tile = `${process.env.tuvaq2Url}/mapTiles/${field}/${model}/tiles/${model}_${field}_${date}_${time}/${zoom}/${X}/${Y}.png`
          promisses.push(
            axios({
              method: 'get',
              url: tile,
              responseType: 'arraybuffer',
            })
          )
        }

        if (this.lastTile !== tile) {
          this.lastTile = tile
          this.imgLayerData = []

          Promise.all(promisses).then((responds) => {
            responds.forEach((res) => {
              const png = new PNG({
                bitDepth: 16,
                colorType: 0,
                skipRescale: true,
              })
              png.parse(res.data, (err, png) => {
                if (err) console.log(err)
                this.imgLayerData.push(png.store.data)
              })
            })
          })
        }

        let value = ''
        if (this.imgLayerData[0].length > 0) {
          if (
            this.selectedField.field === 'Currents' ||
            this.selectedField.field === 'wind'
          ) {
            const u =
              this.selectedField.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selectedField.colorbar.step
            const v =
              this.selectedField.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selectedField.colorbar.step
            value = Math.sqrt(u ** 2 + v ** 2)
          } else {
            value =
              this.selectedField.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selectedField.colorbar.step
          }
          const unit = this.selectedField.unit
          this.$store.commit(
            'map/setLayerValueAtMouse',
            `${value.toFixed(1)} ${unit}`
          )
        }
      }
    },

    updateDraw() {
      const gj = this.draw.getAll()

      gj.features.forEach((feature, i) => {
        if (!feature.properties.color) {
          const color = this.colors[i % this.colors.length]
          feature.properties.color = color
        }

        if (!feature.properties.thickness) {
          feature.properties.thickness = 2
        }

        if (this.drawMode === 'log' && !('timestamp' in feature.properties)) {
          feature.properties.timestamp = moment().unix()
          feature.properties.name = null
          feature.properties.text = ''
        }
      })

      this.draw.set(gj)

      if (this.drawMode === 'log') {
        this.logSelectedMission.logs = this.sortByTime(gj)
      } else {
        this.$store.commit('map/setDrawGJ', gj)

        if (this.drawMode === 'profile') this.updateProfile()
        if (this.drawMode === 'distance') this.updateDistance()
      }
    },

    deleteDraw(e) {
      const gj = this.draw.getAll()
      this.deletedDrawFeatures = e.features

      if (this.drawMode === 'log') {
        this.showConfirmDelete = true
        this.logSelectedMission.logs = this.sortByTime(gj)
      } else {
        this.$store.commit('map/setDrawGJ', gj)
        if (this.drawMode === 'profile') this.updateProfile()
        if (this.drawMode === 'distance') this.updateDistance()
      }
    },

    restoreDeletedDrawFeatures() {
      const gj = this.draw.getAll()
      this.deletedDrawFeatures.forEach((f) => {
        gj.features.push(f)
      })
      this.draw.set(gj)
      this.logSelectedMission.logs = this.sortByTime(gj)
      this.showConfirmDelete = false
    },

    setMapIdle() {
      this.$store.commit('map/setMapIdle', true)
    },

    sortLayers() {
      const availLayers = this.map.getStyle().layers.map((layer) => layer.id)
      this.layersOrder.forEach((layer) => {
        availLayers
          .filter((availLayer) => availLayer.includes(layer))
          .forEach((availLayer) => {
            this.map.moveLayer(availLayer)
          })
      })
    },
  },
}
</script>

<style scoped>
.mapboxgl-popup-tip {
  border: none;
}

.mapboxgl-popup-content {
  background: none !important;
  box-shadow: none !important;
}
</style>
