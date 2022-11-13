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
    <!-- 2D/3D SWITCH -->
    <v-icon
      large
      color="white"
      @click="switchMapProjection"
      style="
        position: absolute;
        z-index: 2;
        background: #333;
        border-bottom-right-radius: 15px;
      "
      >mdi-video-{{ mapProjection === '3d' ? '2d' : '3d' }}</v-icon
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

import { updateProfile } from '../profile/profile'
import { updateDistance } from '../profile/distance'
import {
  initOPASSmarkers,
  addOPASSmarkers,
  removeOPASSmarkers,
  removeOPASS,
  // updateOPASSlonLat,
  // updateOPASSwpt,
  updateOPASSsurfacings,
} from '../OPASS/opass.js'

// PATH PLANNING
import {
  // initPPmarkers,
  // addPPmarkers,
  // removePPmarkers,
  PPupdateProjection,
  PPshowHideProjection,
  // updatePPmap,
  removePPmap,
  // boldPPpath,
  addPath,
  addWPs,
  // addProjection,
  // addConfidence
} from '../PP/pathPlanning'

import {
  initMissionPlots,
  endMissionPlots,
  updateMissionPlotsSelectedPoints,
  addSlocumProfilePointsMap,
  getMissionVariables,
} from '../missions/missionPlots'

// MISSIONS
import {
  updateMissions,
  addPropertyTextLayer,
  generateVelocityLayerGJ,
  addPropertyVelocityLayer,
  updatePropertyVelocityLayer,
  removePropertyLayer,
} from '../missions/missions'

// CURRENTS
import {
  // loadImageCurrents,
  // onAllLoadedCurrents,
  loadUV,
  removeUV,
} from './currents/currents'
import {
  // staticPrepare,
  // generateGJ,
  updateStaticUV,
  updateStaticUVmaxSpeed,
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
  // addBathymetryContourLabels,
  // modifyBathymetryContourLabels,
  // boldBathymetryContourLines,
  // removeBathymetryContourLabels
  // removeBathymetryContours
} from './bathymetry'
import { addTopography, removeTopography } from './topography'
// import { addIceberg, removeIceberg } from './iceberg'
import { decodeColor, decodeColorCurrent } from './decodeColor'
import mouseInfo from './mouseInfo.vue'
// import {
//   startLine,
//   mapClick,
//   // linesMarkerDrag,
//   removeLines,
//   updateLines,
//   updateXYplot
// } from './drawLine.js'
import { addPulsingDot, updatePulsingDot, removePulsingDot } from './pulsingDot'
import { updateAltimetry, updateAltimetryColormap } from './altimetry/altimetry'

import { updateAIS } from './AIS/AIS'

import {
  updateArgoCoordinates,
  argoClicked,
  updateArgoTracks,
  updateArgoProfilePoint,
} from './argo/argo'

import {
  updateSentinelBoxes,
  updateSentinelImage,
  removeSentinel,
} from './sentinel/sentinel'

// const isSea = require('is-sea')

// import { useWindowSize } from 'vue-window-size';
// let cancelTokenSource = axios.CancelToken.source()

export default {
  components: { mouseInfo },
  // ##############################################################
  // ######################## --- DATA --- ########################

  data() {
    return {
      map: null,
      mapProjection: '2d',
      draw: null,
      accessToken:
        // 'pk.eyJ1IjoidGFpbWF6IiwiYSI6ImNrNTlzd2h2dTA3NXgza3J6aHh2cHJlbDkifQ.iY8Kc535hXfTZ4VksOUBWg',
        'pk.eyJ1Ijoib2NlYW5nbnMiLCJhIjoiY2tteXgyYjczMDRjcDJudnZwZWNramJpOSJ9.WMXJlyVCZ3Ay1tMzHVRODA',
      mapStyle: 'mapbox://styles/oceangns/ckoaj8miq072p17p97l9x6fvj?fresh=true',
      // mapStyle:
      //   'mapbox://styles/oceangns/ckoaj8miq072p17p97l9x6fvj/draft?fresh=true',
      // center: [-52.71, 47.56],
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 14,
      maxBounds: [
        [-179.99, -85],
        [179.99, 85],
      ],
      imgFilledGlobal: { img: null, width: 0, height: 0 },
      // cnvFilledContour: null,
      imgCurrentsGlobal: { img: null, width: 0, height: 0 },
      cnvCurrents: null,
      ctxCurrents: null,
      resizeTrack: null,
      wind: null,
      WindGL: null,
      reqAnimID: null,
      bathymetryLevel: null,
      // PPmarkers: [],
      drawLine: false,
      lineOperations: [],
      lines: { markers: [] },
      clientWidth: 0,
      clientHeight: 0,

      // urlLayer: '', // --- stores the url of the last active layer tile loaded for reading values
      lastTile: '', // --- stores the url of the last active layer tile loaded for reading values
      // ctxTmpLayer: null,
      imgLayerData: null,
      // imgLoaded: false,
      PPmarkerStart: null,
      PPmarkerEnd: null,
      // profileTime_tileX: null, // --- Variables to keep X/Y index of tile for time profile data read
      // profileTime_tileY: null,
      layersOrder: [
        'bathymetryFilled',
        'filled_ocean',
        'current',
        'seaiceVelocity',

        'bathymetryContourLines',
        'bathymetryContourLabels',
        'altimetry',
        'AIS',
        'bathymetryBoundaries',
        'lines.line',
        'lines.text',
        'mission', // --- This covers all mission related layers
        'pulsingDot',
        // 'PP_Confidence_fill',
        // 'PP_Projection_circles',
        // 'PP_Projection_text',
        // 'PP_path_line',
        // 'PP_path_circles',
        // 'PP_path_text',
        // 'PP_WPs_circles',
        // 'PP_WPs_text',
        'PP',
        'OPASS_surfacings',
        'gl-draw',
        'slocumProfilePoints',
        'missionPlotsSelectedPoints',
        'distance',
        'argo',
        // --- BASE MAP
        'land',

        // SATELLITE IMAGES
        'sentinel',

        // ATMOSPHERE
        'filled_atmosphere',
        'wind',

        // MAP STUFF
        'tunnel',
        'road',
        'bridge',
        'country-label',
        'state-label',
        'settlement',

        'landMargin',
      ], // --- Last on top

      OPASSmarkers: [],
      OPASSmarkerStart: null,
      OPASSmarkerWPT: null,
      showConfirmDelete: false,
      deletedDrawFeatures: [],
    }
  },

  // ##################################################################
  // ######################## --- COMPUTED --- ########################

  computed: {
    username() {
      if (this.$store.state.profile && this.$store.state.profile.user) {
        return this.$store.state.profile.user.username
      } else return ''
    },

    selected() {
      return this.$store.state.layers.selected
    },

    // selectedField() {
    //   if (this.selected) {
    //     const fields = []
    //     this.$store.state.layers.fields.forEach((f) => {
    //       if (f.subFields) f.subFields.forEach((sf) => fields.push(sf))
    //       else fields.push(f)
    //     })
    //     return fields.filter((f) => f.name === this.selected.fieldName)[0]
    //   } else return null

    //   // return this.$store.state.layers.fields
    //   //   .filter((f) => c.name === this.selected.category)[0]
    //   //   .fields.filter((f) => f.name === this.selected.field)[0]
    // },

    // selectedModel() {
    //   if (this.selected) {
    //     const model = this.$store.state.layers.models.filter(
    //       (m) => m.name === this.selected.modelName
    //     )[0]
    //     model.iRegion = this.selected.iRegion
    //     return model
    //   } else return null
    // },

    // fieldAndModel() {
    //   if (this.selected)
    //     return `${this.selectedField.name}${this.selectedModel.name}${this.selectedModel.iRegion}`
    //   else return null
    // },

    // colormap() {
    //   if (this.selected) return this.selectedField.colorbar.colormap
    //   else return this.$store.state.layers.bathymetries.colorbar.colormap
    // },

    redraw() {
      return this.$store.state.map.redraw
    },

    // PPfromCoordinate() {
    //   return this.$store.state.map.PP.fromCoordinate
    // },
    // PPtoCoordinate() {
    //   return this.$store.state.map.PP.toCoordinate
    // },

    mapOpacity() {
      return { opacity: this.$store.state.map.mapOpacity }
    },

    imgBnds() {
      if (this.$store.state.layers.selected === null) return null
      else return this.$store.state.layers.selected.imgBnds
    },

    // PPresults() {
    //   return this.$store.state.PP.PPs.map(PP=>PP.results)
    // },

    // PPiBold() {
    //   return this.$store.state.map.PP.iBold
    // },

    PPs() {
      return this.$store.state.PP.PPs
    },
    PPid2update() {
      return this.$store.state.PP.PPid2update
    },
    PPmarkers() {
      return this.$store.state.PP.PPmarkers
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

    // profileXYon() {
    //   return this.$store.state.map.profileXYon
    // },

    width() {
      return window.innerWidth
    },
    height() {
      return window.innerHeight
    },

    // missions() {
    //   return this.$store.state.missions.missions
    // },
    // missionZoomIndex() {
    //   return this.$store.state.missions.missionZoomIndex
    // },
    /**
     * {id, gj, show, displayProperties}
     */
    missionsData() {
      return this.$store.state.missions.missionsData
    },

    flyToCoord() {
      return this.$store.state.map.flyToCoord
    },

    fitBoundsCoords() {
      return this.$store.state.map.fitBoundsCoords
    },

    //     missionsCenterCoord(){
    // const lonAvg = this.missions.map(m=>m.lastCoord[0]).reduce((a,b)=>a+b,0) / this.missions.length || 0
    // const latAvg = this.missions.map(m=>m.lastCoord[1]).reduce((a,b)=>a+b,0) / this.missions.length || 0
    // return [lonAvg,latAvg]
    //     },

    // missionsColor() {
    //   return this.$store.state.missions.missionsColor
    // },
    // missionsPropertyLayer() {
    //   return this.$store.state.missions.missionsPropertyLayer
    // },

    pins() {
      return this.$store.state.map.pins
    },
    pinsNumber() {
      return this.$store.state.map.pins.length
    },

    missionWPpins() {
      return this.$store.state.missions.missionWPpins
    },
    noMissionWPpins() {
      return this.$store.state.missions.missionWPpins.length
    },

    currentsMin() {
      return this.$store.state.map.currentsMin
    },

    currentsMax() {
      return this.$store.state.map.currentsMax
    },

    selectedBathymetryContours() {
      return this.$store.state.map.selectedBathymetryContours
    },

    OPASSon() {
      return this.$store.state.map.OPASS.on
    },
    OPASSsurfacings() {
      return this.$store.state.map.OPASS.surfacingsGJ
    },

    leftBarContent() {
      // if (this.map) this.map.resize()
      return this.$store.state.map.leftBarContent
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
    seagliderEscapePin() {
      return this.$store.state.WPgen.seagliderEscapePin
    },

    currentsDirectionOn() {
      return this.$store.state.map.currentsDirectionOn
    },

    activeLayerOpacity() {
      return this.$store.state.map.activeLayerOpacity
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

    missionPlotsShow() {
      return this.$store.state.missions.missionPlots.show
    },
    missionPlotsUpdate() {
      return this.$store.state.missions.missionPlots.update
    },

    activeLayerValueAtMouseStatus() {
      return this.$store.state.map.activeLayerValueAtMouseStatus
    },

    // Draw: {
    //   get() {
    //     return this.$store.state.map.Draw
    //   },
    //   set(value) {
    //     this.$store.commit('map/setDraw', value)
    //   }
    // }

    selectedAltimetryPackage() {
      return this.$store.state.altimetry.selectedAltimetryPackage
    },
    // selectedAltimetrySatellites() {
    //   return this.$store.state.layers.selectedAltimetrySatellites
    // },
    // selectedAltimetryDates() {
    //   return this.$store.state.layers.selectedAltimetryDates
    // },
    // selectedAltimetryVariable() {
    //   return this.$store.state.layers.selectedAltimetryVariable
    // },
    altimetryMapboxColormap() {
      return this.$store.state.altimetry.altimetryMapboxColormap
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

    // logSelectedMission() {
    //   return this.$store.state.missions.logSelectedMission
    // },

    selectedMissionNoteID() {
      return this.$store.state.missions.selectedMissionNoteID
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

    // --- SENTINEL
    sentinelGJ() {
      return this.$store.state.sentinel.filteredGJ
    },

    sentinelSelected() {
      return this.$store.state.sentinel.selected
    },

    isRemoveSentinel() {
      return this.$store.state.map.isRemoveSentinel
    },

    vectorStatic() {
      return this.$store.state.map.vectorStatic
    },

    maxSpeed() {
      if (this.selected && this.selected.field.name === 'current')
        return this.$store.state.map.maxSpeedCurrent
      else return this.$store.state.map.maxSpeedWind
    },
  },

  // ###############################################################
  // ######################## --- WATCH --- ########################

  watch: {
    // --- Change of model -> Initiate availDateTimes and the rest
    selected: {
      handler(newVal, oldVal) {
        this.removeAllLayers()
        if (this.selected === null) {
          this.addBathymetry()
          return null
        }

        // if (
        //   this.selected.field === 'current' ||
        //   this.selected.field === 'wind' ||
        //   this.selected.field === 'seaiceVelocity'
        // ) {
        //   // this.addBathymetry()
        //   this.$store.commit(
        //     'layers/setDate',
        //     this.$store.state.map.now.format('YYYYMMDD')
        //   )
        //   this.$store.commit(
        //     'layers/setTime',
        //     this.$store.state.map.now.format('HH')
        //   )
        //   const iRegion = this.selected.iRegion
        //   if (this.selected.regions[iRegion].levels.hasLevels)
        //     this.$store.commit(
        //       'layers/setLevel',
        //       this.selected.regions[iRegion].levels.iLevel
        //     )
        //   // else this.$store.commit('layers/setLevel', 0)
        //   this.$store.commit('map/setRedrawTrue')
        //   // } else if (this.selected.field === 'Iceberg') {
        //   //   this.addIceberg()
        // } else {
        //   // --- FILLED CONTOURS
        //   this.removeBathymetryFilled()
        //   this.$store.commit(
        //     'layers/setDate',
        //     this.$store.state.map.now.format('YYYYMMDD')
        //   )
        //   this.$store.commit(
        //     'layers/setTime',
        //     this.$store.state.map.now.format('HH')
        //   )
        //   this.$store.commit('map/setRedrawTrue')
        // }

        if (this.selected.field.type === 'vector') this.addBathymetry()
        else this.removeBathymetryFilled()

        // this.$store.commit(
        //   'layers/setDate',
        //   this.$store.state.map.now.format('YYYYMMDD')
        // )
        // this.$store.commit(
        //   'layers/setTime',
        //   this.$store.state.map.now.format('HH')
        // )

        // this.$store.commit('layers/setDateTime', moment.utc())

        // const iRegion = this.selectedModel.iRegion
        if (this.selected.hasLevels)
          this.$store.commit(
            'layers/setLevel',
            this.selected.region.levels.iLevel
          )
        this.$store.commit('map/setRedrawTrue')

        if (this.selected.region.name !== 'global') {
          const minLon = this.selected.region.bnds.minLon
          const maxLon = this.selected.region.bnds.maxLon
          const minLat = this.selected.region.bnds.minLat
          const maxLat = this.selected.region.bnds.maxLat
          this.$store.commit('map/setFitBoundsCoords', [
            [minLon, minLat],
            [maxLon, maxLat],
          ])
        }

        if (newVal === null || oldVal === null) this.map.resize()
      },
      deep: true,
    },

    redraw(n, o) {
      if (this.redraw) {
        if (this.selected) {
          if (this.selected.field.type === 'vector') {
            // if (this.currentsDirectionOn) {
            //   if (this.currentsAnimationOn) this.loadImageCurrents()
            //   else this.staticPrepare()
            // }
            // this.addFilledContour()
            // } else if (this.selected.field === 'Iceberg') {
            //   return null
            this.loadUV()
          } else {
            this.addFilledContour()
          }
        } else {
          this.addBathymetry()
        }

        if (this.drawMode === 'profile') this.updateProfile()
      }
    },

    // colormap: {
    //   handler() {
    //     this.$store.commit('map/setRedrawTrue')
    //   },
    //   deep: true,
    // },

    selectedBathymetry() {
      this.removeAllLayers()
      if (this.selectedBathymetry === null) this.removeBathymetry()
      else this.addBathymetry()
    },

    bathymetryOpacity() {
      // if (this.bathymetryOpacity === 0) {
      //   this.removeBathymetryFilled()
      // } else if (this.bathymetryOpacity === 1) {
      //   this.addBathymetry()
      // } else this.modifyBathymetryFilled()
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
        //   this.selected.field === 'Wind'
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

    // #################
    // --- Path Planning
    PPmarkers() {
      Object.keys(this.PPmarkers).forEach((marker) => {
        this.PPmarkers[marker].addTo(this.map)
      })
    },

    // PPs: {
    //   handler(newPPs,oldPPs) {
    //     newPPs.forEach(PP => {
    //       const id = PP.id

    //       // --- Find PP in oldPPs
    //       const oldI = oldPPs.map(PP=>PP.id).indexOf(id)

    //       // --- If not found, add everything
    //       if(oldP===-1){}
    //       // --- If found, modify if needed
    //       else{
    //       const newWPs = PP.results.WPs
    //       const oldWPs = oldPPs[oldI].results.WPs

    //       const projection = PP.results.projection

    //       if (projection && projection.gj) {
    //         const gj = projection.gj
    //         this.PPupdateProjection(id, gj)
    //       }
    //       }
    //     })
    //   },
    //   deep: true
    // },
    PPid2update() {
      // --- Don't do anything if PPid2update == null
      if (this.PPid2update) {
        const id = this.PPid2update.split('_')[0]
        const action = this.PPid2update.split('_')[1]

        // --- Find the path to modify
        const PP = this.PPs.filter((PP) => PP.id === id)[0]
        const gj = PP.results.projection.gj

        if (action === 'add') {
          // --- Add WPpins to the map
          PP.results.WPs.forEach((WP) => WP.marker.addTo(this.map))

          if (gj) {
            // --- Add gj to map
            if (action === 'add') this.PPupdateProjection(PP.id, gj)
          }
        }

        if (action === 'showHide') {
          // --- Show/Hide markers
          PP.results.WPs.forEach((WP) => {
            WP.marker._element.style.visibility = PP.show ? 'visible' : 'hidden'
          })

          if (gj) {
            this.PPshowHideProjection(PP.id, PP.show)
          }
        }

        if (action === 'color') {
          PP.results.WPs.forEach((WP) =>
            this.$store.dispatch('WPgen/changeColor', {
              marker: WP.marker,
              color: PP.color,
            })
          )

          if (gj) {
            gj.data.features.forEach((feature) => {
              feature.properties.color = `#${PP.color}`
            })
            this.PPupdateProjection(PP.id, gj)
          }
        }

        if (action === 'delete') {
          PP.results.WPs.forEach((WP) => WP.marker.remove())

          try {
            this.map.removeLayer(`PP_${id}_projection_circles`)
            this.map.removeLayer(`PP_${id}_projection_text`)
            this.map.removeSource(`PP_${id}_projection`)
          } catch (error) {}

          const i = this.PPs.map((PP) => PP.id).indexOf(PP.id)
          this.PPs.splice(i, 1)
        }
      }
    },

    // PPon() {
    //   this.PPon ? this.addPPmarkers() : this.removePPmarkers()
    // },

    // PPresults() {
    //   this.PPresults ? this.updatePPmap() : this.removePPmap()
    // },

    // #################
    // --- OPASS
    OPASSon() {
      this.OPASSon ? this.addOPASSmarkers() : this.removeOPASSmarkers()
    },
    OPASSsurfacings: {
      handler() {
        if (this.OPASSsurfacings) this.updateOPASSsurfacings()
      },
      deep: true,
    },

    // #################
    // --- Drawing Lines
    // drawLine() {
    //   this.drawLine ? this.startLine() : this.removeLines()
    // },

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

    // missions: {
    //   handler() {
    //     this.updateMissions()
    //   },
    //   deep: true,
    // },

    // leftBarContent() {
    //   if (this.map) {
    //     this.map.resize()
    //   }
    //   if (this.leftBarContent === 'missions') this.updateMissions()
    // },

    // missionZoomIndex() {
    //   if (this.missionZoomIndex.changed) {
    //     const features = this.missions[this.missionZoomIndex.i].gj.features
    //     const coords = features[features.length - 1].geometry.coordinates
    //     const lastCoord = coords[coords.length - 1]

    //     this.map.flyTo({ center: lastCoord, zoom: 8 })
    //     this.$store.commit('missions/setMissionZoomIndex', {
    //       i: this.missionZoomIndex,
    //       changed: false
    //     })
    //   }
    // },

    missionsData: {
      handler() {
        this.updateMissions()
      },
      deep: true,
    },

    flyToCoord: {
      handler() {
        this.map.flyTo({ center: this.flyToCoord, zoom: 6 })
      },
      deep: true,
    },

    fitBoundsCoords: {
      handler() {
        this.map.fitBounds(this.fitBoundsCoords)
      },
      deep: true,
    },

    // currentsMin() {
    //   // --- Only if changed by the settings dialog
    //   // if (this.$store.state.map.showSettings) {
    //   if (
    //     this.selected &&
    //     (this.selected.field === 'current' || this.selected.field === 'wind') &&
    //     !this.currentsAnimationOn
    //   ) {
    //     const gj = this.generateGJ()
    //     this.updateStaticCurrentsLayer(gj)
    //   }

    //   // --- Update missions velocity arrows if needed
    //   this.missions.forEach((mission, i) => {
    //     if (
    //       mission.selectedProperty &&
    //       mission.selectedProperty.includes('Velocity')
    //     ) {
    //       const gj = this.generateVelocityLayerGJ(mission.selectedProperty, i)
    //       this.updatePropertyVelocityLayer(i, gj)
    //     }
    //   })
    //   // }
    // },
    // currentsMax() {
    //   // --- Only if changed by the settings dialog
    //   // if (this.$store.state.map.showSettings) {
    //   if (
    //     this.selected &&
    //     (this.selected.field === 'current' || this.selected.field === 'wind') &&
    //     !this.currentsAnimationOn
    //   ) {
    //     const gj = this.generateGJ()
    //     this.updateStaticCurrentsLayer(gj)
    //   }

    //   // --- Update missions velocity arrows if needed
    //   this.missions.forEach((mission, i) => {
    //     if (
    //       mission.selectedProperty &&
    //       mission.selectedProperty.includes('Velocity')
    //     ) {
    //       const gj = this.generateVelocityLayerGJ(mission.selectedProperty, i)
    //       this.updatePropertyVelocityLayer(i, gj)
    //     }
    //   })
    //   // }
    // },

    selectedBathymetryContours: {
      handler() {
        this.modifyBathymetryContours()
      },
      deep: true,
    },

    // profileXYon() {
    //   if (this.profileXYon) {
    //     this.lineOperations.push('profile')
    //     this.drawLine = true
    //   } else {
    //     this.lineOperations = this.lineOperations.filter(
    //       (lo) => lo !== 'profile'
    //     )
    //     if (this.lineOperations.length === 0) this.drawLine = false
    //   }
    // },

    pinsNumber() {
      this.pins.forEach((pin) => {
        pin.marker.addTo(this.map)
      })
    },

    noMissionWPpins() {
      this.missionWPpins.forEach((pin) => {
        pin.marker.addTo(this.map)
        // pin.marker.togglePopup()
      })
    },

    // --- When new WP pin is added
    noWPpins() {
      this.WPpins.forEach((pin, i) => {
        let coord = pin.marker.getLngLat()
        if (!coord) {
          coord = this.map.getCenter()
        }
        this.WPpins[i].marker.setLngLat(coord).addTo(this.map).togglePopup()
        // this.$store.commit('map/setWPpins', this.WPpins)
      })
    },
    seagliderEscapePin() {
      if (this.seagliderEscapePin) {
        let coord = this.seagliderEscapePin.marker.getLngLat()
        if (!coord) {
          coord = this.map.getCenter()
        }
        this.seagliderEscapePin.marker.setLngLat(coord).addTo(this.map)
      }
    },

    showLayers() {
      this.map.resize()
    },

    // --- MISSION NOTE
    selectedMissionNoteID() {
      // --- REMOVE DRAW IF ALREADY THERE
      // if (this.draw) {
      //   this.map.removeControl(this.draw)
      //   this.draw = null
      // }

      console.log(this.selectedMissionNoteID);
      if (this.selectedMissionNoteID) {
        const missions = this.$store.state.missions.missions
        const i = missions.map((m) => m._id).indexOf(this.selectedMissionNoteID)
        const mission = missions[i]
        let features = mission.notes.map((n) => n.features).filter((x) => x)
        features = [].concat.apply([], features)

        const pointFeatures = features.filter(
          (f) => f.geometry.type === 'Point'
        )
        const lineFeatures = features.filter(
          (f) => f.geometry.type === 'LineString'
        )
        const polygonFeatures = features.filter(
          (f) => f.geometry.type === 'Polygon'
        )

        // POINTS
        if (pointFeatures.length > 0) {
          const ID = `missionNotes_point_${this.selectedMissionNoteID}`
          this.map.addSource(ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: pointFeatures,
            },
          })

          this.map.addLayer({
            id: ID,
            type: 'circle',
            source: ID,
            paint: {
              // 'circle-color': ['get', 'color'],
              'circle-color': 'red',
            },
          })
        }

        // LINES
        if (lineFeatures.length > 0) {
          const ID = `missionNotes_line_${this.selectedMissionNoteID}`
          this.map.addSource(ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: lineFeatures,
            },
          })

          this.map.addLayer({
            id: ID,
            type: 'line',
            source: ID,
            paint: {
              // 'line-color': ['get', 'color'],
              // 'line-width': ['get', 'thickness'],
              'line-color': 'red',
            },
          })
        }

        // POLYGONS
        if (polygonFeatures.length > 0) {
          const ID = `missionNotes_polygon_${this.selectedMissionNoteID}`
          this.map.addSource(ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: polygonFeatures,
            },
          })

          this.map.addLayer({
            id: ID,
            type: 'fill',
            source: ID,
            paint: {
              'fill-opacity': 0.5,
              // 'fill-outline-color': ['get', 'color'],
              'fill-outline-color': 'red',
            },
          })
        }
      } else {
        const sources = Object.keys(this.map.getStyle().sources).filter((s) =>
          s.includes('missionNotes')
        )
        console.log(sources);
        sources.forEach((ID) => {
          try {
            this.map.removeLayer(ID)
            this.map.removeSource(ID)
          } catch (error) {}
        })
      }
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
        if (this.drawMode === 'missionNote') {
          this.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              point: true,
              line_string: true,
              polygon: true,
              trash: true,
            },
            // userProperties: true,
            // styles: this.$store.state.map.MBdefaultDrawStyles.concat([
            //   {
            //     id: 'gl-draw-line-user',
            //     type: 'line',
            //     filter: [
            //       'all',
            //       ['==', '$type', 'LineString'],
            //       ['has', 'user_color'],
            //     ],
            //     paint: {
            //       'line-color': ['get', 'user_color'],
            //       'line-width': ['get', 'user_thickness'],
            //     },
            //   },
            //   {
            //     id: 'gl-draw-polygon-user',
            //     type: 'line',
            //     filter: [
            //       'all',
            //       ['==', 'active', 'false'],
            //       ['==', '$type', 'Polygon'],
            //       ['!=', 'mode', 'static'],
            //     ],
            //     paint: {
            //       'line-color': ['get', 'user_color'],
            //       'line-width': ['get', 'user_thickness'],
            //     },
            //   },
            // ]),
          })
          this.map.addControl(this.draw, 'top-right')
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

    missionPlotsShow() {
      this.map.resize()
      if (this.missionPlotsShow) {
        this.$store.commit(
          'map/setFlyToCoord',
          this.$store.state.missions.missionPlots.mission.lastCoord
        )
        this.initMissionPlots()
      } else this.endMissionPlots()
    },

    missionPlotsUpdate() {
      this.updateMissionPlotsSelectedPoints()
    },

    selectedAltimetryPackage: {
      handler() {
        this.updateAltimetry()
      },
      deep: true,
    },

    // selectedAltimetrySatellites: {
    //   handler() {
    //     this.toggleAltimetry()
    //   },
    //   deep: true,
    // },

    // selectedAltimetryDates: {
    //   handler() {
    //     this.toggleAltimetry()
    //   },
    //   deep: true,
    // },

    // selectedAltimetryVariable() {
    //   this.toggleAltimetry()
    // },

    altimetryMapboxColormap() {
      // if (this.selectedAltimetryVariable) this.updateAltimetry()
      this.updateAltimetryColormap()
    },

    // drawSelectedFeatures: {
    //   handler() {
    //     const ids = this.drawSelectedFeatures.map(f => f.id)
    //     this.draw.changeMode('simple_select', { featureIds: ids })
    //   },
    //   deep: true
    // }

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

    // --------------------------------------------------
    // --- SENTINEL
    sentinelGJ: {
      handler() {
        this.updateSentinelBoxes()
      },
      deep: true,
    },

    sentinelSelected: {
      handler() {
        this.updateSentinelImage()
      },
      deep: true,
    },

    isRemoveSentinel() {
      if (this.isRemoveSentinel) {
        this.removeSentinel()
      }
    },

    // --------------------------------------------------
    // --- Vector Static Change
    vectorStatic() {
      this.removeUV()
      this.$store.commit('map/setRedrawTrue')
    },

    maxSpeed() {
      if (this.vectorStatic) this.updateStaticUVmaxSpeed()
      else this.$store.commit('map/setRedrawTrue')
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

    this.map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      'bottom-right'
    )
    // this.map.dragRotate.disable()
    // this.map.touchZoomRotate.disableRotation()
    // this.map.scrollZoom.setWheelZoomRate(1) TAIMAZ
    this.map.on('load', this.onMapLoad)
    this.map.on('idle', this.setMapIdle)
    this.map.on('move', this.onMapMove)
    this.map.on('moveend', this.onMapMoveEnd)
    this.map.on('zoomend', this.onZoomEnd)
    // this.map.on('zoomend', this.roundZoom) TAIMAZ
    // this.$store.commit('map/setMapZoom', this.zoom)

    // --- Add arrow images for currents
    this.map.loadImage(
      // 'https://api.oceangns.com/images/arrowBlack.png',
      'https://api.oceangns.com/images/arrowBlack.png',
      (err, img) => {
        if (err) {
          console.log(err)
        }

        this.map.addImage('arrowBlack', img)
      }
    )
    // this.map.loadImage(
    //   'https://api.oceangns.com/images/arrowRed.png',
    //   (err, img) => {
    //     if (err) {
    //       console.log(err)
    //     }

    //     this.map.addImage('arrowRed', img)
    //   }
    // )
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
    // loadImageCurrents,
    // onAllLoadedCurrents,
    loadUV,
    removeUV,

    // --- CURRENTS STATIC
    // staticPrepare,
    // generateGJ,
    updateStaticUV,
    updateStaticUVmaxSpeed,

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

    // --- PATH PLANNING
    // initPPmarkers,
    // addPPmarkers,
    // removePPmarkers,
    PPupdateProjection,
    PPshowHideProjection,
    // updatePPmap,
    removePPmap,
    // boldPPpath,
    addPath,
    addWPs,
    // addProjection,
    // addConfidence,

    // --- OPASS
    initOPASSmarkers,
    addOPASSmarkers,
    removeOPASSmarkers,
    removeOPASS,
    // updateOPASSlonLat,
    // updateOPASSwpt,
    updateOPASSsurfacings,
    // --- DRAWING LINES
    // startLine,
    // mapClick,
    // --- PROFILE TIME
    // activateProfileTime,
    // diactivateProfileTime,
    // linesMarkerDrag,
    // removeLines,
    // updateLines,
    // updateXYplot,
    // --- PULSING DOT
    addPulsingDot,
    updatePulsingDot,
    removePulsingDot,
    // --- MISSIONS
    updateMissions,
    addPropertyTextLayer,
    generateVelocityLayerGJ,
    addPropertyVelocityLayer,
    updatePropertyVelocityLayer,
    removePropertyLayer,
    // --- MISION PLOTS
    initMissionPlots,
    endMissionPlots,
    updateMissionPlotsSelectedPoints,
    addSlocumProfilePointsMap,
    getMissionVariables,
    // --- ALTIMETRY
    // toggleAltimetry,
    updateAltimetry,
    updateAltimetryColormap,
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
    // --- SENTINEL
    updateSentinelBoxes,
    updateSentinelImage,
    removeSentinel,

    onMapLoad() {
      this.map.setFog({})
      this.$store.commit('map/setBounds', this.map.getBounds())
      this.$store.commit('map/setMapCenter', this.map.getCenter())

      this.addBathymetry()
      // --- Add contour lines and labels
      this.$store.commit('map/setShowBathymetryBoundaries', false)
      this.$store.commit('map/setShowBathymetryContours', true)
      // this.$store.commit('map/setBathymetryContourLabels', true)

      this.initDepthReading()
      this.map.on('mousemove', this.onMouseMove)

      // this.initPPmarkers()
      this.initOPASSmarkers()

      // --- TEST GRAYSCALE
      // const field = 'SST'
      // const model = 'tt'
      // const dir = 'HYCOM_SST_20220420_12'
      // const minOrg=-2
      // const maxOrg = 35
      // const step = .1

      // this.map.addSource(`filled_1`, {
      //   type: 'raster',
      //   tiles: [
      //     `${
      //       // process.env.tuvaq2Url}/mapTiles/${field}/${model}/tiles/${dir}/{z}/{x}/{y}.png?dt=${Date.now()}`
      //       process.env.tuvaq2Url
      //     }/img?field=${field}&model=${model}&dir=${dir}&z={z}&x={x}&y={y}&minOrg=${minOrg}&maxOrg=${maxOrg}&step=${step}&dt=${Date.now()}`
      //   ],
      //   tilesize: 512
      // })

      // this.map.addLayer(
      //   {
      //     id: `filled_1`,
      //     type: 'raster',
      //     source: `filled_1`,
      //     paint: {
      //       'raster-resampling': 'nearest',
      //       'raster-opacity': 1
      //     }
      //   }
      // )
    },

    onMapMove() {
      if (
        this.selected &&
        this.selected.field.type === 'vector' &&
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
      if (this.selected && this.selected.field.type === 'vector') {
        // this.resetCurrents()
        // this.drawCurrents()
        // this.loadImageCurrents()
        this.$store.commit('map/setRedrawTrue')
      }
      // this.$store.commit('map/setRedrawTrue')
    },

    onMouseMove(e) {
      this.$store.commit('map/setMouseCoordinate', e.lngLat)
      this.$store.commit('map/setMouseXY', e.point)

      // --- GET DEPTH & ACTIVE LAYER VALUE
      this.$store.commit('map/setDepthAtMouse', this.getDepth(e.lngLat)) // --- In functions.js
      if (this.activeLayerValueAtMouseStatus) this.getActiveLayerValue(e.lngLat)

      // if (this.showBathymetryContours) this.boldBathymetryContourLines(e)
    },

    onZoomEnd() {
      this.$store.commit('map/setZoomLevel', this.map.getZoom().toFixed(2))
    },

    // roundZoom() {
    //   this.map.setZoom(Math.round(this.map.getZoom()))
    //   this.$store.commit('map/setMapZoom', this.map.getZoom())
    // },

    // updatePPfromCoord(e) {
    //   const coord = [e.marker._lngLat.lng, e.marker._lngLat.lat]
    //   this.$store.commit('map/setPPfromCoordinate', coord)
    // },
    // updatePPtoCoord(e) {
    //   const coord = [e.marker._lngLat.lng, e.marker._lngLat.lat]
    //   this.$store.commit('map/setPPtoCoordinate', coord)
    // },

    resizeEnd() {
      // this.$store.commit('map/setBounds', this.map.getBounds())
      // this.$store.commit('map/setMapCenter', this.map.getCenter())
      // this.$store.commit('map/setRedrawTrue')
      this.map.on('moveend', this.onMapMoveEnd)
      this.onMapMoveEnd()
      // if (this.selected.field === 'Currents') {
      //   this.reset()
      //   this.createAnimCanvas()
      //   this.drawCurrents()
      // }
      // : this.addFilledContour()
    },

    switchMapProjection() {
      if (this.mapProjection === '3d') {
        this.mapProjection = '2d'
        this.map.setProjection({
          name: 'mercator',
        })
      } else {
        this.mapProjection = '3d'
        this.map.setProjection({
          name: 'globe',
        })
        this.map.setFog({})
      }
      this.$store.commit('map/setMapProjection', this.mapProjection)
    },

    removeAllLayers() {
      // this.resetCurrents()
      if (!this.currentsLocked) this.removeUV()
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
        model = this.selected.name
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

        let level = ''
        if (this.selected.hasLevels) {
          level =
            '_' +
            this.selected.region.levels.values[
              this.selected.region.levels.iLevel
            ]
        }

        const promisses = []

        let tile
        if (
          this.selected.field === 'current' ||
          this.selected.field === 'wind' ||
          this.selected.field === 'seaiceVelocity'
        ) {
          ;['U', 'V'].forEach((dir) => {
            tile = `${process.env.tuvaq2Url}/mapTiles/${field}/${model}/tiles${dir}/${model}_${field}_${date}_${time}${level}/${zoom}/${X}/${Y}.png`
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
          if (this.selected.field.type === 'vector') {
            const u =
              this.selected.field.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selected.field.colorbar.step
            const v =
              this.selected.field.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selected.field.colorbar.step
            value = Math.sqrt(u ** 2 + v ** 2)
          } else {
            value =
              this.selected.field.colorbar.minOrg +
              this.imgLayerData[0][4 * (xRem + 512 * yRem)] *
                this.selected.field.colorbar.step
          }
          const unit = this.selected.field.unit
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
      })

      this.draw.set(gj)

      this.$store.commit('map/setDrawGJ', gj)

      if (this.drawMode === 'profile') this.updateProfile()
      if (this.drawMode === 'distance') this.updateDistance()
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
