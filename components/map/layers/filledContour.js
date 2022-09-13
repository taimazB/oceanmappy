export function addFilledContour() {
  const sessionID = this.$store.state.map.sessionID
  const category = this.$store.state.layers.selected.category
  const field = this.$store.state.layers.selected.field
  const model = this.$store.state.layers.selected.modelDir
  const date = this.$store.state.layers.interDate
  const time = this.$store.state.layers.interTime
  const isAtmosphere = this.$store.state.layers.categories.filter(c=>c.name===category)[0].atmosphere
  console.log(category,field,model,time,date,isAtmosphere);
  const colorbar = this.$store.state.layers.categories
    .filter((c) => c.name === category)[0]
    .fields.filter((f) => f.name === field)[0].colorbar
  const minOrg = colorbar.minOrg
  const step = colorbar.step
  const stops = []
  const colors = []
  colorbar.colormap.forEach((obj) => {
    stops.push(obj.value)
    colors.push(obj.color.replace('#', ''))
  })

  let url
  // if (field === 'SST' && model === 'HYCOM') {
  //   url = `${process.env.tuvaq2Url}/imgHYCOM?id=${sessionID}&field=${field}&model=${model}&date=${date}&time=${time}&iDepth=${iDepth}&z={z}&x={x}&y={y}&minOrg=${minOrg}&step=${step}`
  // } else {
  let dir = `${model}_${field}_${date}_${time}`
  if (this.$store.state.layers.selected.depthProperties.hasDepth)
    dir = `${dir}_${
      this.$store.state.layers.selected.depthProperties.depthValues[
        this.$store.state.layers.selected.depthProperties.iDepth
      ]
    }`
  url = `${process.env.tuvaq2Url}/img?id=${sessionID}&field=${field}&model=${model}&dir=${dir}&z={z}&x={x}&y={y}&minOrg=${minOrg}&step=${step}`
  // }

  stops.forEach((stop) => {
    url = `${url}&stop=${stop}`
  })
  colors.forEach((color) => {
    url = `${url}&color=${color}`
  })

  url = `${url}&dt=${Date.now()}`

  const sources = Object.keys(this.map.getStyle().sources)
  const oldLayers = sources.filter((src) => src.includes('filled'))

  if (oldLayers.length === 0) {
    const srcName = `filled_${isAtmosphere?'atm':'ocn'}_0`
    this.map.addSource(srcName, {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer(
      {
        id: srcName,
        type: 'raster',
        source: srcName,
        paint: {
          'raster-resampling': 'nearest',
          'raster-opacity': this.activeLayerOpacity,
          // 'raster-opacity': 0.25
        },
      }
      // upLayer
    )
  } else {
    const oldLayer = oldLayers[oldLayers.length - 1]
    const i = parseInt(oldLayer.split('_')[2]) + 1
    const srcName = `filled_${isAtmosphere?'atm':'ocn'}_${i}`
    this.map.addSource(srcName, {
      type: 'raster',
      tiles: [url],
      tilesize: 512,
    })

    this.map.addLayer({
      id: srcName,
      type: 'raster',
      source: srcName,
      paint: {
        'raster-resampling': 'nearest',
        'raster-opacity': this.activeLayerOpacity,
        // 'raster-opacity': 0.25
      },
    })

    this.map.once('idle', (e) => {
      oldLayers.forEach((oldLayer) => {
        this.map.removeLayer(oldLayer)
        this.map.removeSource(oldLayer)
      })
    })
  }

  this.sortLayers()
}

export function removeFilledContour() {
  const sources = Object.keys(this.map.getStyle().sources)
  const oldLayers = sources.filter((src) => src.includes('filled'))
  oldLayers.forEach((oldLayer) => {
    this.map.removeLayer(oldLayer)
    this.map.removeSource(oldLayer)
  })
}
