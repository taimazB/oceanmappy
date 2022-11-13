export const state = () => ({
  NOAAbathymetryRegion: null,
  selectedBathymetryContours: [
    -20, -50, -100, -150, -200, -250, -300, -350, -400, -450, -500, -600, -700,
    -800, -900, -1000, -2000, -3000, -4000, -5000, -7500, -10000,
  ],

  bathymetryMin: -10325,
  bathymetryMax: 0,

  showBathymetrySettings: false,

  now: null,
  // mapZoom: 4,
  zoomLevel: 2,

  // bnds: { _ne: { lat: 50, lng: 50 }, _sw: { lat: -50, lng: -50 } },
  bnds: '', // --- To crop layers based on map's visible area
  mapLimits: null, // --- Limit map to an area
  mapCenter: [0, 0],
  mouseCoordinate: { lat: 0, lng: 0 },
  mouseXY: { x: 0, y: 0 },

  currentsMin: 0,
  currentsMax: 1,

  showSettings: false,

  allowMouseInfo: false,
  showMouseInfo: false,
  mouseInfoValue: null,

  distanceOn: false,

  profile: { coords: null, data: [] },
  distance: { coords: null, data: [] },
  // profileTimeOn: false,
  // profileData: { profileArray: [], profileVerticals: [] },
  // PPprojectionSpeedData: null,
  // PPprojectionBathymetryData: null,

  isRulerOn: false,

  redraw: false,
  isClean: false,

  // showBathymetry: false,
  bathymetryOpacity: 1,
  showBathymetryBoundaries: false,
  showBathymetryContours: false,
  // showBathymetryContourLabels: false,

  isHighResOn: false,

  dXY: { dX: 0, dY: 0 },

  showButtons: true,

  depthAtMouse: '',
  layerValueAtMouse: '-',

  currentsCnvProps: {},

  leftBarContent: null,
  rightBarContent: null,

  // --- DEPTH READING
  urlBathymetry: null,
  ctxTmpBathymetry: null,
  imgBathymetry: null,

  pins: [],

  // --- OPASS
  OPASS: {
    on: false,
    lat: 0,
    lon: 0,
    WPTlat: 0,
    WPTlon: 0,
    surfacingsGJ: {
      type: 'FeatureCollection',
      features: [],
    },
    plots: [
      {
        name: 'tz',
        type: 'line',
        data: [],
        xAxisLabel: 'Time (hr)',
        yAxisLabel: 'Depth (m)',
        minY: null,
        maxY: 0,
      },
      {
        name: 'td',
        type: 'circle',
        data: [],
        xAxisLabel: 'Time (hr)',
        yAxisLabel: 'Remaining Distance (km)',
        minY: 0,
        maxY: null,
      },
    ],
    showPlots: false,
  },

  currentsDirectionOn: true,
  currentsAnimationOn: false,

  showToolbox: false,

  activeLayerOpacity: 1,

  showLayers: false,
  showInfoDialog: false,

  // notes: [],
  flyToCoord: null,

  sessionID: null,

  mapIdle: false,
  activeLayerValueAtMouseStatus: false,



  AISselectedYear: null,
  AISselectedMonthIndex: null,

  drawGJ: { type: 'FeatureCollection', features: [] },
  drawMode: null,
  drawSelectedFeatures: [],

  MBdefaultDrawStyles: [
    {
      id: 'gl-draw-polygon-fill-inactive',
      type: 'fill',
      filter: [
        'all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Polygon'],
        ['!=', 'mode', 'static'],
      ],
      paint: {
        'fill-color': '#3bb2d0',
        'fill-outline-color': '#3bb2d0',
        'fill-opacity': 0.1,
      },
    },
    {
      id: 'gl-draw-polygon-fill-active',
      type: 'fill',
      filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      paint: {
        'fill-color': '#fbb03b',
        'fill-outline-color': '#fbb03b',
        'fill-opacity': 0.1,
      },
    },
    {
      id: 'gl-draw-polygon-midpoint',
      type: 'circle',
      filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
      paint: {
        'circle-radius': 3,
        'circle-color': '#fbb03b',
      },
    },
    {
      id: 'gl-draw-polygon-stroke-inactive',
      type: 'line',
      filter: [
        'all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Polygon'],
        ['!=', 'mode', 'static'],
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#3bb2d0',
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-polygon-stroke-active',
      type: 'line',
      filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#fbb03b',
        'line-dasharray': [0.2, 2],
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-line-inactive',
      type: 'line',
      filter: [
        'all',
        ['==', 'active', 'false'],
        ['==', '$type', 'LineString'],
        ['!=', 'mode', 'static'],
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#3bb2d0',
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-line-active',
      type: 'line',
      filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#fbb03b',
        'line-dasharray': [0.2, 2],
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
      type: 'circle',
      filter: [
        'all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static'],
      ],
      paint: {
        'circle-radius': 5,
        'circle-color': '#fff',
      },
    },
    {
      id: 'gl-draw-polygon-and-line-vertex-inactive',
      type: 'circle',
      filter: [
        'all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static'],
      ],
      paint: {
        'circle-radius': 3,
        'circle-color': '#fbb03b',
      },
    },
    {
      id: 'gl-draw-point-point-stroke-inactive',
      type: 'circle',
      filter: [
        'all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
        ['!=', 'mode', 'static'],
      ],
      paint: {
        'circle-radius': 5,
        'circle-opacity': 1,
        'circle-color': '#fff',
      },
    },
    {
      id: 'gl-draw-point-inactive',
      type: 'circle',
      filter: [
        'all',
        ['==', 'active', 'false'],
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
        ['!=', 'mode', 'static'],
      ],
      paint: {
        'circle-radius': 3,
        'circle-color': '#3bb2d0',
      },
    },
    {
      id: 'gl-draw-point-stroke-active',
      type: 'circle',
      filter: [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'active', 'true'],
        ['!=', 'meta', 'midpoint'],
      ],
      paint: {
        'circle-radius': 7,
        'circle-color': '#fff',
      },
    },
    {
      id: 'gl-draw-point-active',
      type: 'circle',
      filter: [
        'all',
        ['==', '$type', 'Point'],
        ['!=', 'meta', 'midpoint'],
        ['==', 'active', 'true'],
      ],
      paint: {
        'circle-radius': 5,
        'circle-color': '#fbb03b',
      },
    },
    {
      id: 'gl-draw-polygon-fill-static',
      type: 'fill',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      paint: {
        'fill-color': '#404040',
        'fill-outline-color': '#404040',
        'fill-opacity': 0.1,
      },
    },
    {
      id: 'gl-draw-polygon-stroke-static',
      type: 'line',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#404040',
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-line-static',
      type: 'line',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#404040',
        'line-width': 2,
      },
    },
    {
      id: 'gl-draw-point-static',
      type: 'circle',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
      paint: {
        'circle-radius': 5,
        'circle-color': '#404040',
      },
    },
  ],

  colors: [
    '#f00',
    '#0f0',
    '#00f',
    '#f80',
    '#0f8',
    '#80f',
    '#ff0',
    '#0ff',
    '#f0f',
  ],

  fitBoundsCoords: null,

  alert: { show: false, text: '', type: '' },

  currentsLocked: false,

  updatedDrawProperties: null,
  updatedDrawCoordinates: null,

  preventCloseOn: false,

  mapResize: false,

  demo: false,

  selectedLayersTab: 0,

  maxSpeedCurrent: 1.5,
  maxSpeedWind: 20,
  maxSpeedSeaiceVelocity:1,

  isRemoveSentinel: false,

  vectorStatic: false,
  mapProjection:'2d'
})

export const mutations = {
  setNow(state, dateTime) {
    state.now = dateTime
  },

  // setMapZoom(state, map) {
  //   state.mapZoom = map
  // },

  setZoomLevel(state, value) {
    state.zoomLevel = value
  },

  setSelectedBathymetryContours(state, array) {
    state.selectedBathymetryContours = array
  },

  setBathymetryOpacity(state, value) {
    if (value < 0) {
      state.bathymetryOpacity = 1
    } else {
      state.bathymetryOpacity = value
    }
  },

  // --- To crop layers based on map's visible area
  setBounds(state, bnds) {
    state.bnds = bnds
  },

  // --- Limit map to an area
  setMapLimits(state, bnds) {
    state.mapLimits = bnds
  },

  setMapCenter(state, coord) {
    state.mapCenter = [coord.lng, coord.lat]
  },

  setMouseCoordinate(state, point) {
    state.mouseCoordinate = point
  },

  setMouseXY(state, point) {
    state.mouseXY = point
  },

  setAllowMouseInfo(state, status) {
    state.allowMouseInfo = status
    if (!status) this.commit('map/setShowMouseInfo', false)
  },

  setShowMouseInfo(state, status) {
    state.showMouseInfo = status
  },

  setMouseInfoValue(state, value) {
    state.mouseInfoValue = value
  },

  setRedrawTrue(state) {
    state.redraw = true
    setTimeout(() => {
      state.redraw = false
    }, 100)
  },

  setCleanStatus(state, status) {
    state.isClean = status
  },

  // setMinMax(state, values) {
  //     state.selected.min = values.min;
  //     state.selected.max = values.max;
  //     this.dispatch('map/redraw');
  // },

  // setMinMaxOrg(state, values) {
  //   state.selected.minOrg = values.min
  //   state.selected.maxOrg = values.max
  // },

  setHighRes(state, status) {
    state.highRes = status
  },

  // setAvailDateTimes(state, arr) {
  //     state.selected.availDateTimes = arr;
  //     if (!arr.map(d => d.date).includes(state.interDate)) this.commit("layers/setDate", arr[arr.length - 1].date)
  //     else this.commit("layers/setDate", state.interDate)
  // },

  setdXY(state, obj) {
    state.dXY = obj
  },

  // setHighResolutionStatus(state, status) {
  //   state.isHighResOn = status
  // },

  setRulerStatus(state, status) {
    state.isRulerOn = status
  },

  // updateBathymetryLevels(state, obj) {
  //   state.bathymetryLevels[obj.levelIndex].id = obj.id
  // },

  setShowBathymetryBoundaries(state, status) {
    state.showBathymetryBoundaries = status
  },

  setShowBathymetryContours(state, status) {
    state.showBathymetryContours = status
  },

  setShowButtons(state, status) {
    state.showButtons = status
  },

  setShowDatePicker(state, status) {
    state.showDatePicker = status
  },

  // setDistanceOn(state, status) {
  //   state.distanceOn = status
  // },

  setProfileCoordinates(state, array) {
    state.profile.coords = array
  },
  setProfileData(state, array) {
    state.profile.data = array
  },

  // setDistanceCoordinates(state, array) {
  //   state.distance.coords = array
  // },
  // setDistanceData(state, array) {
  //   state.distance.data = array
  // },

  setDepthAtMouse(state, value) {
    state.depthAtMouse = value
  },

  setLayerValueAtMouse(state, value) {
    state.layerValueAtMouse = value
  },

  setFlyToCoord(state, coord) {
    state.flyToCoord = coord
  },

  setFitBoundsCoords(state, coords) {
    state.fitBoundsCoords = coords
  },

  setCurrentsMin(state, value) {
    state.currentsMin = value
  },
  setCurrentsMax(state, value) {
    state.currentsMax = value
  },

  setShowBathymetrySettings(state, value) {
    state.showBathymetrySettings = value
  },

  setShowSettings(state, value) {
    state.showSettings = value
  },

  setCurrentsCnvProps(state, obj) {
    state.currentsCnvProps = obj
  },

  setLeftBarContent(state, value) {
    state.leftBarContent = value
  },

  setRightBarContent(state, value) {
    state.rightBarContent = value
  },

  setUrlBathymetry(state, value) {
    state.urlBathymetry = value
  },
  setCtxTmpBathymetry(state, value) {
    state.ctxTmpBathymetry = value
  },
  setImgBathymetry(state, value) {
    state.imgBathymetry = value
  },

  setPins(state, array) {
    state.pins = array
  },

  // --- OPASS
  setOPASS(state, obj) {
    state.OPASS = obj
  },

  setNOAAbathymetryRegion(state, value) {
    state.NOAAbathymetryRegion = value
  },

  setCurrentsDirectionOn(state, value) {
    state.currentsDirectionOn = value
  },

  setCurrentsAnimationOn(state, value) {
    state.currentsAnimationOn = value
  },

  setShowToolbox(state, value) {
    state.showToolbox = value
  },

  setActiveLayerOpacity(state, value) {
    state.activeLayerOpacity = value
  },

  setShowLayers(state, value) {
    state.showLayers = value
  },

  setShowInfoDialog(state, value) {
    state.showInfoDialog = value
  },

  setDrawGJ(state, gj) {
    state.drawGJ = gj
  },

  // setNotes(state, obj) {
  //   state.notes = obj
  // },

  setDrawSelectedFeatures(state, array) {
    state.drawSelectedFeatures = array
  },

  setSessionID(state, value) {
    state.sessionID = value
  },

  setMapIdle(state, status) {
    state.mapIdle = status
  },

  setActiveLayerValueAtMouseStatus(state, status) {
    if (!status) state.layerValueAtMouse = '-'
    state.activeLayerValueAtMouseStatus = status
  },



  // --- AIS
  setAISselectedYear(state, value) {
    state.AISselectedYear = value
  },
  setAISselectedMonthIndex(state, value) {
    state.AISselectedMonthIndex = value
  },

  setDrawMode(state, value) {
    state.drawMode = value
  },

  setAlert(state, obj) {
    state.alert = obj
    setTimeout(() => {
      state.alert.show = false
    }, 3000)
  },

  setCurrentsLocked(state, status) {
    state.currentsLocked = status
  },

  updateDrawProperties(state, obj) {
    state.updatedDrawProperties = obj
  },

  updateDrawCoordinates(state, obj) {
    state.updatedDrawCoordinates = obj
  },

  setPreventCloseOn(state, status) {
    state.preventCloseOn = status
  },

  forceMapResize(state) {
    state.mapResize = true
    setTimeout(() => {
      state.mapResize = false
    }, 1)
  },

  setDemo(state, status) {
    state.demo = status
  },

  setSelectedLayersTab(state, value) {
    state.selectedLayersTab = value
  },

  setMaxSpeedCurrent(state, value) {
    state.maxSpeedCurrent = value
  },
  setMaxSpeedWind(state, value) {
    state.maxSpeedWind = value
  },
  setMaxSpeedSeaiceVelocity(state, value) {
    state.maxSpeedSeaiceVelocity = value
  },

  setRemoveSentinel(state, status) {
    state.isRemoveSentinel = status
  },

  setVectorStatic(state, status) {
    state.vectorStatic = status
  },

  setMapProjection(state,value){
    state.mapProjection=value
  }
}

export const actions = {
  triggerSentinelRemove(context) {
    context.commit('setRemoveSentinel', false)
    setTimeout(() => {
      context.commit('setRemoveSentinel', true)
    }, 100)
  },
}
