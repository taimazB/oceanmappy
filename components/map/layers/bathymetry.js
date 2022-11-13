import turf from 'turf'

export function addBathymetry() {
  // if (this.selectedBathymetry.source === 'NOAA') {
  //   this.removeBathymetry()
  //   this.addBathymetryNOAAregions()
  // } else {
  // this.$store.commit('map/setNOAAbathymetryRegion', null)
  // this.removeBathymetryNOAAregions() // --- In case NOAA was previously selected
  this.addBathymetryFilled()
  if (this.showBathymetryContours) this.addBathymetryContours()
  // }
}

export function removeBathymetry() {
  // --- REMOVE NOAA REGIONS IF AVIALABLE
  this.removeBathymetryNOAAregions()

  // --- REMOVE FILLED BATHYMETRY
  this.removeBathymetryFilled()
  this.removeBathymetryContours()
}

// ################################################################
// ######################## --- FILLED --- ########################
export function addBathymetryFilled() {
  // const region = this.$store.state.map.NOAAbathymetryRegion
  if (this.map.getSource('bathymetryFilled')) {
    this.removeBathymetryFilled()
  }

  const sessionID = this.$store.state.map.sessionID
  const model = this.$store.state.layers.selectedBathymetry.directory
  const colorbar = this.$store.state.layers.bathymetries.colorbar
  const minOrg = colorbar.minOrg
  const step = colorbar.step

  let url = `${process.env.tuvaq2Url}/img?id=${sessionID}&field=Bathymetry&model=${model}&z={z}&x={x}&y={y}&minOrg=${minOrg}&step=${step}`

  const stops = []
  const colors = []
  colorbar.colormap.forEach((obj) => {
    stops.push(obj.value)
    colors.push(obj.color.replace('#', ''))
  })

  stops.forEach((stop) => {
    url = `${url}&stop=${stop}`
  })
  colors.forEach((color) => {
    url = `${url}&color=${color}`
  })

  url = `${url}&dt=${Date.now()}`
  this.map.addSource('bathymetryFilled', {
    type: 'raster',
    // tiles: [
    //   `${process.env.tuvaq2Url}/mapTiles/Bathymetry/${
    //     this.$store.state.layers.selectedBathymetry.directory
    //   }/tiles/filled/${region ? region + '/' : ''}{z}/{x}/{y}.png`,
    // ],
    tiles: [url],
  })

  this.map.addLayer({
    id: 'bathymetryFilled',
    type: 'raster',
    source: 'bathymetryFilled',
    paint: {
      'raster-resampling': 'nearest',
      'raster-opacity': this.bathymetryOpacity,
    },
  })
  this.sortLayers()
}

export function modifyBathymetryFilled() {
  this.map.setPaintProperty(
    'bathymetryFilled',
    'raster-opacity',
    this.bathymetryOpacity
  )
}

export function removeBathymetryFilled() {
  try {
    this.map.removeLayer('bathymetryFilled')
    this.map.removeSource('bathymetryFilled')
  } catch (error) {
    return null
  }
}

// ##################################################################
// ######################## --- CONTOURS --- ########################
export function addBathymetryContours() {
  // const region = this.$store.state.map.NOAAbathymetryRegion
  if (this.map.getSource('bathymetryContours')) {
    this.removeBathymetryContours()
  }

  this.map.addSource('bathymetryContours', {
    type: 'vector',
    // tiles: [
    //   `${process.env.tuvaq2Url}/models/${
    //     this.selectedBathymetry.directory
    //   }/contours/${
    //     region ? region + '/' : ''
    //   }{z}/{x}/{y}.pbf?dt=${Date.now()}`,
    // ],
    tiles: [
      `${process.env.tuvaq2Url}/models/${
        this.selectedBathymetry.directory
      }/contours/{z}/{x}/{y}.pbf?dt=${Date.now()}`,
    ],
  })

  const selectedBathymetryContours =
    this.$store.state.map.selectedBathymetryContours

  this.map.addLayer({
    id: 'bathymetryContourLines',
    type: 'line',
    source: 'bathymetryContours',
    'source-layer': 'depths',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: { 'line-color': '#666' },
    filter: [
      'all',
      ['match', ['get', 'ELEV'], selectedBathymetryContours, true, false],
    ],
  })

  this.sortLayers()
}

export function modifyBathymetryContours() {
  if (this.map.getLayer('bathymetryContourLines')) {
    const selectedBathymetryContours =
      this.$store.state.map.selectedBathymetryContours
    this.map.setFilter('bathymetryContourLines', [
      'all',
      ['match', ['get', 'ELEV'], selectedBathymetryContours, true, false],
    ])
  }

  if (this.map.getLayer('bathymetryContourLabels')) {
    const selectedBathymetryContours =
      this.$store.state.map.selectedBathymetryContours
    this.map.setFilter('bathymetryContourLabels', [
      'all',
      ['match', ['get', 'ELEV'], selectedBathymetryContours, true, false],
    ])
  }
}

export function removeBathymetryContours() {
  try {
    this.map.removeLayer('bathymetryContourLines')
    this.map.removeLayer('bathymetryContourLabels')
    this.map.removeSource('bathymetryContours')
  } catch (error) {
    return null
  }
}

// ######################################################################
// ######################## --- NOAA REGIONS --- ########################
export function addBathymetryNOAAregions() {
  const bathymetries = this.$store.state.layers.NOAAbathymetries

  const features = []
  bathymetries.forEach((b) => {
    const coordinates = [
      [
        [b.lonMin, b.latMin],
        [b.lonMin, b.latMax],
        [b.lonMax, b.latMax],
        [b.lonMax, b.latMin],
        [b.lonMin, b.latMin],
      ],
    ]

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates,
      },
      properties: {
        region: b.region,
        area: turf.area(turf.polygon(coordinates)),
      },
    })
  })

  const gj = {
    type: 'FeatureCollection',
    features,
  }

  this.map.addSource('NOAAbathymetryRegions', {
    type: 'geojson',
    data: gj,
  })
  this.map.addLayer({
    id: 'NOAAbathymetryRegions',
    type: 'fill',
    source: 'NOAAbathymetryRegions', // reference the data source
    layout: {},
    paint: {
      'fill-color': '#aaa',
      'fill-opacity': 0.5,
    },
  })

  // --- Click on each box -> zoom and add corresponding bathymetry
  this.map.on('click', 'NOAAbathymetryRegions', (e) => {
    const allRegions = this.$store.state.layers.NOAAbathymetries.map(
      (b) => b.region
    )
    const clickedRegions = this.map
      .queryRenderedFeatures(e.point)
      .map((layer) => layer.properties)
      .filter((r) => r.region) // -- Get rid of undefined ones
      .filter((r) => allRegions.includes(r.region))
    clickedRegions.sort((a, b) =>
      a.area > b.area ? 1 : b.area > a.area ? -1 : 0
    )
    this.$store.commit('map/setNOAAbathymetryRegion', clickedRegions[0].region)
    this.addBathymetryFilled()
    if (this.showBathymetryContours) this.addBathymetryContours()
  })
}

export function removeBathymetryNOAAregions() {
  try {
    this.map.removeLayer('NOAAbathymetryRegions')
    this.map.removeSource('NOAAbathymetryRegions')
  } catch (error) {}
}

// ####################################################################
// ######################## --- BOUNDARIES --- ########################
export function addBathymetryBoundaries() {
  if (this.map.getSource('bathymetryBoundaries')) {
    this.removeBathymetryBoundaries()
  }

  this.map.addSource('bathymetryBoundaries', {
    type: 'vector',
    tiles: [
      `${
        process.env.tuvaq2Url
      }/models/EEZboundaries/tiles/{z}/{x}/{y}.pbf?dt=${Date.now()}`,
    ],
  })

  this.map.addLayer({
    id: 'bathymetryBoundaries',
    type: 'line',
    source: 'bathymetryBoundaries',
    'source-layer': 'boundary',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: { 'line-color': '#606', 'line-width': 3 },
    // filter: [
    //   'all',
    //   ['match', ['get', 'ELEV'], selectedBathymetryContours, true, false],
    // ],
  })

  this.sortLayers()
}

export function removeBathymetryBoundaries() {
  try {
    this.map.removeLayer('bathymetryBoundaries')
    this.map.removeSource('bathymetryBoundaries')
  } catch (error) {
    return null
  }
}
